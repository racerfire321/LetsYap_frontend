import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Modal,
  Animated,
  Dimensions,
  TouchableOpacity,
  TextInput,
  Alert,
  Image,
  FlatList
} from 'react-native';
import io from 'socket.io-client';
import firestore from '@react-native-firebase/firestore';
import { SOCKET_URL } from '../utils/config/config';
import { launchImageLibrary } from 'react-native-image-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { AuthContext } from '../contexts/auth/AuthProvider';
import { uploadImage } from '../services/ImageService'; 

const { height } = Dimensions.get('window');

const socket = io(SOCKET_URL);

const ExploreScreen = ({ navigation }) => {
    const [rooms, setRooms] = useState([]);
    const [username, setUsername] = useState('');
    const [showCreateRoomModal, setShowCreateRoomModal] = useState(false);
    const [roomTitle, setRoomTitle] = useState('');
    const [roomDescription, setRoomDescription] = useState('');
    const [roomImage, setRoomImage] = useState(null);
     
    const slideAnim = useRef(new Animated.Value(height)).current;
    const overlayAnim = useRef(new Animated.Value(0)).current;
    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (user) {
            setUsername(user.displayName);
        } else {
            Alert.alert('Error', 'No user is currently logged in.');
        }
    }, [user]);

    useEffect(() => {
        const unsubscribe = firestore()
            .collection('rooms')
            .onSnapshot((snapshot) => {
                const roomsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setRooms(roomsData);
            });

        return () => unsubscribe();
    }, []);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(slideAnim, {
                toValue: showCreateRoomModal ? 0 : height,
                duration: 400,
                useNativeDriver: true,
            }).start(),
            Animated.timing(overlayAnim, {
                toValue: showCreateRoomModal ? 1 : 0,
                duration: 400,
                useNativeDriver: true,
            }).start(),
        ]);
    }, [showCreateRoomModal]);
    const createRoom = async () => {
        if (!roomTitle || !roomDescription) {
            Alert.alert('Error', 'Please provide both title and description.');
            return;
        }
        try {
            let imageUrl = null;
            if (roomImage) {
                imageUrl = await uploadImage(roomImage.uri); 
            }

            socket.emit('create-room', username);

            socket.on('room-created', ({ roomId }) => {
                firestore().collection('rooms').doc(roomId).set({
                    roomId,
                    createdBy: username,
                    title: roomTitle,
                    description: roomDescription,
                    imageUrl,
                }).catch(error => {
                    console.error('Error creating room:', error);
                });
            });

            setRoomTitle('');
            setRoomDescription('');
            setRoomImage(null);
            setShowCreateRoomModal(false);
        } catch (error) {
            Alert.alert('Error', 'Failed to create room.');
            console.error('Create room error:', error);
        }
    };
    

    const joinRoom = (roomId) => {
        console.log(roomId)
        socket.emit('join-room', { roomId, username });
        socket.emit('join-room', { roomId, username }, (response) => {
            console.log('Server response:', response);
            
            if (response.success) {
              navigation.navigate('Call', { roomId, username });
            } else {
              Alert('Room not found!');
            }
          });
    };

    const deleteRoom = (roomId) => {
        Alert.alert(
            'Delete Room',
            'Are you sure you want to delete this room?',
            [
                {
                    text: 'Cancel',
                    style: 'cancel',
                },
                {
                    text: 'Delete',
                    onPress: () => {
                        firestore()
                            .collection('rooms')
                            .doc(roomId)
                            .delete()
                            .then(() => {
                                console.log('Room deleted!');
                                setRooms((prevRooms) => prevRooms.filter(room => room.id !== roomId));
                            })
                            .catch((error) => {
                                console.error('Error deleting room:', error);
                            });
                    },
                },
            ],
            { cancelable: true }
        );
    };

    const selectImage = () => {
        launchImageLibrary({ mediaType: 'photo', quality: 1 }, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.error('Image picker error:', response.errorMessage);
            } else {
                if (response.assets && response.assets.length > 0) {
                    setRoomImage(response.assets[0]);
                }
            }
        });
    };

    return (
        <View style={{ flex: 1,backgroundColor:'##1E3A8A' }}>
        <View style={styles.Container}>
        <Text style={[styles.header]}>
        Explore Worlds
      </Text>
           
            <TouchableOpacity
                style={[styles.header]}
                onPress={() => setShowCreateRoomModal(true)}
            >
                <Ionicons name="add-outline" size={32} color="white" />
            </TouchableOpacity>
            
        </View>
        
        <Modal
transparent={true}
visible={showCreateRoomModal}
animationType="none"
onRequestClose={() => setShowCreateRoomModal(false)}
>
<Animated.View
    style={[
        styles.overlay,
        {
            opacity: overlayAnim,
        },
    ]}
>
    <TouchableOpacity style={{ flex: 1 }} onPress={() => setShowCreateRoomModal(false)} />
</Animated.View>

<Animated.View
    style={[
        styles.modalContent,
        { transform: [{ translateY: slideAnim }] },
    ]}
>
    <Text style={styles.modalTitle}>Create New Room</Text>

    <Text style={styles.label}>Room Title</Text>
    <TextInput
        style={styles.input}
        value={roomTitle}
        onChangeText={setRoomTitle}
        placeholder="Enter room title"
        placeholderTextColor="#999"
    />

    <Text style={styles.label}>Room Description</Text>
    <TextInput
        style={[styles.input, styles.textArea]}
        value={roomDescription}
        onChangeText={setRoomDescription}
        placeholder="Enter room description"
        placeholderTextColor="#999"
        multiline
        numberOfLines={4}
    />

    <TouchableOpacity style={styles.imageButton} onPress={selectImage}>
        <Text style={styles.imageButtonText}>Select Room Image </Text>
    </TouchableOpacity>

    {roomImage && (
        <Image
            source={{ uri: roomImage.uri }}
            style={styles.previewImage}
        />
    )}

    <View style={styles.buttonContainer}>
    <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCreateRoomModal(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.createButton} onPress={createRoom}>
            <Text style={styles.buttonText}>Create</Text>
        </TouchableOpacity>
        
    </View>
</Animated.View>
</Modal>

        {rooms.length === 0 ? (
            <Text style={{ textAlign: 'center', marginTop: 20 }}>No rooms here</Text>
        ) : (

            <View style={styles.MainContainer}>
            <Text style={styles.label}>Join Rooms</Text>
            <FlatList
                data={rooms}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TouchableOpacity onPress={() => joinRoom(item.roomId)}>
                        <View style={styles.roomContainer}>
                            <View style={styles.roomContent}>
                                <View style={styles.profileColumn}>
                                    {item.imageUrl && (
                                        <Image
                                            source={{ uri: item.imageUrl }}
                                            style={styles.image}
                                        />
                                    )}
                                    
                                </View>
                                <View style={styles.detailsColumn}>
                                    <Text style={styles.roomTitle}>{item.title}</Text>
                                    <Text>{item.description}</Text>
                                    <View style={styles.footerContainer}>
                                        <Text style={{ fontSize: 12 }}>Created by: {item.createdBy}</Text>
                                        {item.createdBy === username && (
                                            <TouchableOpacity
                                                style={styles.deleteButton}
                                                onPress={() => deleteRoom(item.id)}
                                            >
                                                <Ionicons name="trash-outline" size={24} color="red" />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            />
             </View>
        )}
       
    </View>
);
};

const styles = StyleSheet.create({
overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
},
modalContent: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
},
header: {
    fontSize: 24,
    fontWeight: 'bold',
    padding: 16,
    textAlign: 'center',
    color: 'white',
    elevation: 3,
  },
modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
},
label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
    color: '#333',
},
MainContainer:{
   padding: 20,
},
input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    color: '#333',
},
textArea: {
    height: 100,
    textAlignVertical: 'top',
},
imageButton: {
  
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
},
imageButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
},
previewImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    marginBottom: 15,
    alignSelf: 'center',
},
buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
},
createButton: {
    flex: 1,
    backgroundColor: '#1E3A8A',
    paddingVertical: 12,
    borderRadius: 8,
    marginLeft: 10,
    alignItems: 'center',
},
cancelButton: {
    flex: 1,
    backgroundColor: '#ff6347',
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 10,
    alignItems: 'center',
},
buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
},
image: {
    width: 80, 
    height: 80, 
    borderRadius: 8,
    marginBottom: 15,
},
roomContainer: {
    padding: 10,
    backgroundColor: '#fff',
    marginVertical: 5,
    borderRadius: 10,
    elevation: 3,
},
roomContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
},
profileColumn: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
},
detailsColumn: {
    flex: 1,
    marginLeft: 10,
},
roomTitle: {
    fontSize: 18,
    fontWeight: 'bold',
},
deleteButton: {
    marginLeft: 10,
},
footerContainer:{
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
},
Container: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    backgroundColor:"#1E3A8A",
    
    
},
});

export default ExploreScreen; 