// import React, { useState } from 'react';
// import AppNavigator from './src/navigation/Navigation';

// const App = () => {
//   const [isLoggedIn, setIsLoggedIn] = useState(true);
//   return <AppNavigator isLoggedIn={isLoggedIn} />;
// };

// export default App;
// import React, { useState, useEffect } from 'react';
// import { ActivityIndicator, View } from 'react-native';
// import auth from '@react-native-firebase/auth';
// import AppNavigator from './src/navigation/Navigation';

// const App = () => {
//   // Define the state to accept both boolean and null values
//   const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

//   useEffect(() => {
//     const unsubscribe = auth().onAuthStateChanged((user) => {
//       if (user) {
//         setIsLoggedIn(true);  // Now this won't cause a type error
//       } else {
//         setIsLoggedIn(false);
//       }
//     });

//     return () => unsubscribe(); // Clean up the subscription on unmount
//   }, []);

//   if (isLoggedIn === null) {
//     // Show a loading indicator while checking auth status
//     return (
//       <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
//         <ActivityIndicator size="large" color="#1E3A8A" />
//       </View>
//     );
//   }

//   return <AppNavigator isLoggedIn={isLoggedIn} />;
// };

// export default App;

import React, { useEffect, useRef, useState } from 'react';
import {
    SafeAreaView,
    View,
    TextInput,
    StyleSheet,
    Text,
    Dimensions,
    TouchableOpacity,
    Modal,
} from 'react-native';
import io from 'socket.io-client';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    mediaDevices,
    RTCView,
} from 'react-native-webrtc';

const socket = io('http://192.168.1.71:3000');

const pcConfig = {
    iceServers: [
        {
            urls: 'stun:stun.l.google.com:19302',
        },
    ],
};

const App = () => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [inCall, setInCall] = useState(false);
    const [roomId, setRoomId] = useState('');
    const [username, setUsername] = useState('');
    const [isJoinModalVisible, setJoinModalVisible] = useState(false);
    const pc = useRef(new RTCPeerConnection(pcConfig));

    useEffect(() => {
        const handleRoomCreated = ({ roomId, username }) => {
            setRoomId(roomId);
            startCall();  // Automatically start the call after room creation
        };

        const handleRoomNotFound = () => {
            alert('Room not found!');
        };

        const handleUserConnected = async ({ userId }) => {
            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(offer);
            socket.emit('offer', roomId, offer);
        };

        socket.on('room-created', handleRoomCreated);
        socket.on('room-not-found', handleRoomNotFound);
        socket.on('user-connected', handleUserConnected);

        return () => {
            socket.off('room-created', handleRoomCreated);
            socket.off('room-not-found', handleRoomNotFound);
            socket.off('user-connected', handleUserConnected);
        };
    }, [roomId]);

    useEffect(() => {
        if (inCall) {
            mediaDevices.getUserMedia({
                video: true,
                audio: true,
            })
                .then(stream => {
                    setLocalStream(stream);
                    stream.getTracks().forEach(track => pc.current.addTrack(track, stream));
                })
                .catch(error => {
                    console.error('Error accessing media devices:', error);
                });

            pc.current.onicecandidate = (event) => {
                if (event.candidate) {
                    socket.emit('ice-candidate', roomId, event.candidate);
                }
            };

            pc.current.ontrack = (event) => {
                setRemoteStream(event.streams[0]);
            };

            socket.on('offer', async (senderId, offer) => {
                await pc.current.setRemoteDescription(new RTCSessionDescription(offer));
                const answer = await pc.current.createAnswer();
                await pc.current.setLocalDescription(answer);
                socket.emit('answer', roomId, answer);
            });

            socket.on('answer', async (senderId, answer) => {
                await pc.current.setRemoteDescription(new RTCSessionDescription(answer));
            });

            socket.on('ice-candidate', async (senderId, candidate) => {
                try {
                    await pc.current.addIceCandidate(new RTCIceCandidate(candidate));
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            });

            return () => {
                pc.current.close();
                setLocalStream(null);
                setRemoteStream(null);
            };
        }
    }, [inCall]);

    const startCall = () => {
       
            setInCall(true);
            socket.emit('join-room', { roomId, username });
        
    };

    const endCall = () => {
        setInCall(false);
        pc.current.close();
        socket.emit('leave-room', roomId);
    };

    const createRoom = () => {
        if (username.trim() !== '') {
            socket.emit('create-room', username);
            console.log(roomId)
            socket.emit('join-room', roomId,username)
        } else {
            alert('Please enter a username');
        }
    };

    const openJoinModal = () => {
        setJoinModalVisible(true);
    };

    const closeJoinModal = () => {
        setJoinModalVisible(false);
    };

    return (
        <SafeAreaView style={styles.container}>
            {!inCall ? (
                <View style={styles.joinContainer}>
                    <Text style={styles.heading}>Video Call</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Enter Username"
                        value={username}
                        onChangeText={setUsername}
                    />
                    <TouchableOpacity style={styles.button} onPress={createRoom}>
                        <Text style={styles.buttonText}>Create Room</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.button} onPress={openJoinModal}>
                        <Text style={styles.buttonText}>Join Room</Text>
                    </TouchableOpacity>

                    {/* Modal for entering Room ID */}
                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={isJoinModalVisible}
                        onRequestClose={closeJoinModal}
                    >
                        <View style={styles.modalContainer}>
                            <View style={styles.modalContent}>
                                <Text style={styles.modalHeading}>Enter Room ID</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="Room ID"
                                    value={roomId}
                                    onChangeText={setRoomId}
                                />
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => {
                                        closeJoinModal();
                                        startCall();
                                    }}
                                >
                                    <Text style={styles.buttonText}>Join</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={closeJoinModal}
                                >
                                    <Text style={styles.buttonText}>Cancel</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            ) : (
                <View style={styles.videoContainer}>
                    <RTCView
                        streamURL={localStream?.toURL()}
                        style={styles.localVideo}
                    />
                    <RTCView
                        streamURL={remoteStream?.toURL()}
                        style={styles.remoteVideo}
                    />
                    <TouchableOpacity style={styles.button} onPress={endCall}>
                        <Text style={styles.buttonText}>End Call</Text>
                    </TouchableOpacity>
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
    },
    joinContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heading: {
        fontSize: 24,
        marginBottom: 20,
    },
    input: {
        width: 250,
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: 'blue',
        padding: 10,
        borderRadius: 5,
        marginTop: 10,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    videoContainer: {
        flex: 1,
        flexDirection: 'row',
    },
    localVideo: {
        width: 100,
        height: 150,
        position: 'absolute',
        top: 20,
        right: 20,
        zIndex: 1,
    },
    remoteVideo: {
        width: Dimensions.get('window').width,
        height: Dimensions.get('window').height,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalHeading: {
        fontSize: 20,
        marginBottom: 20,
    },
});

export default App;
