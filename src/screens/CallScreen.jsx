import React, { useEffect, useRef, useState,useContext } from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Modal,
    FlatList,  
} from 'react-native';
import { Restart } from 'react-native-restart';
import { RTCPeerConnection, RTCSessionDescription, mediaDevices, RTCView, RTCIceCandidate } from 'react-native-webrtc';
import io from 'socket.io-client';
import RecordScreen, { RecordingResult } from 'react-native-record-screen';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SOCKET_URL, pcConfig } from '../utils/config/config';
import { ThemeContext } from '../contexts/theme/ThemeProvider';
import { Colors } from '../constants/constants';
import RatingComponent from '../components/modal/RatingModal';

const socket = io(SOCKET_URL);

const CallScreen = ({ route, navigation }) => {
    const { roomId, username, isAudioOff, isVideoOff } = route.params;
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [inCall, setInCall] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(!isAudioOff);
    const [videoEnabled, setVideoEnabled] = useState(!isVideoOff);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [showRating, setShowRating] = useState(false);
    const [participants, setParticipants] = useState([]); 
    const { isDarkTheme } = useContext(ThemeContext);
    const pc = useRef(new RTCPeerConnection(pcConfig));
    const localStreamRef = useRef(null);
    const screenStreamRef = useRef(null);
    const currentColors = isDarkTheme ? Colors.dark : Colors.light;

    useEffect(() => {
        startCall();

        const handleRoomNotFound = () => {
            alert('Room not found!');
        };

        const handleUserConnected = async ({ userId, userName }) => {
            // Add new participant
            setParticipants(prev => [...prev, { userId, userName }]);

            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(offer);
            socket.emit('offer', roomId, offer);
        };

        const handleUserDisconnected = ({ userId }) => {
            // Remove participant who disconnected
            setParticipants(prev => prev.filter(p => p.userId !== userId));
        };

        socket.on('room-not-found', handleRoomNotFound);
        socket.on('user-connected', handleUserConnected);
        socket.on('user-disconnected', handleUserDisconnected);

        return () => {
            socket.off('room-not-found', handleRoomNotFound);
            socket.off('user-connected', handleUserConnected);
            socket.off('user-disconnected', handleUserDisconnected);
        };
    }, [roomId]);

    useEffect(() => {
        if (inCall) {
            mediaDevices.getUserMedia({
                video: videoEnabled,
                audio: audioEnabled,
            })
                .then(stream => {
                    setLocalStream(stream);
                    localStreamRef.current = stream;
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
                    const iceCandidate = new RTCIceCandidate(candidate);
                    await pc.current.addIceCandidate(iceCandidate);
                } catch (e) {
                    console.error('Error adding received ice candidate', e);
                }
            });

            return () => {
                pc.current.close();
                setLocalStream(null);
                setRemoteStream(null);
                if (screenStreamRef.current) {
                    screenStreamRef.current.getTracks().forEach(track => track.stop());
                }
            };
        }
    }, [inCall]);

    useEffect(() => {
        if (localStreamRef.current) {
            localStreamRef.current.getAudioTracks().forEach(track => {
                track.enabled = audioEnabled;
            });
            localStreamRef.current.getVideoTracks().forEach(track => {
                track.enabled = videoEnabled;
            });
        }
    }, [audioEnabled, videoEnabled]);

    useFocusEffect(
        React.useCallback(() => {
            return () => {
                if (inCall) {
                    endCall();
                }
            };
        }, [inCall])
    );

    const startCall = () => {
        socket.emit('join-room', { roomId, username });
        setInCall(true);
    };

    const endCall = () => {
                setInCall(false);
                pc.current.close();
                socket.emit('leave-room', roomId);
                
                setTimeout(() => {
                    navigation.navigate('Home'); 
                }, 2500);
                setShowRating(true)
            };
        
            const handleRating = (rating) => {
               
                setShowRating(false); 
                
               
            };
        

    const toggleAudio = () => {
        setAudioEnabled(prevState => !prevState);
    };

    const toggleVideo = () => {
        setVideoEnabled(prevState => !prevState);
    };

    const toggleScreenShare = async () => {
        if (!isScreenSharing) {
            try {
                const res = await RecordScreen.startRecording({
                    mic: false,
                    bitrate: 1024000,
                    fps: 24,
                });
                if (res === RecordingResult.PermissionError) {
                    console.error('Permission error');
                    return;
                }

                const screenStream = await mediaDevices.getUserMedia({
                    video: {
                        mandatory: {
                            minFrameRate: 24,
                        },
                        optional: [],
                    },
                });
                setIsScreenSharing(true);
                screenStreamRef.current = screenStream;
                screenStream.getTracks().forEach(track => pc.current.addTrack(track, screenStream));
            } catch (error) {
                console.error('Error starting screen recording:', error);
            }
        } else {
            stopScreenShare();
        }
    };

    const stopScreenShare = async () => {
        if (isScreenSharing) {
            try {
                await RecordScreen.stopRecording();
                screenStreamRef.current.getTracks().forEach(track => track.stop());
                setIsScreenSharing(false);
            } catch (error) {
                console.warn('Error stopping screen recording:', error);
            }
        }
    };

  
    const renderInitialCircle = (nameInitial) => (
                <View style={styles.initialCircle}>
                    <Text style={styles.initialText}>{nameInitial}</Text>
                </View>
            );
         
        

    return (
        <SafeAreaView style={styles.container} backgroundColor={currentColors.background}>
            <View style={styles.topBar}>
                <Text style={styles.meetingInfo}>Lobby ID: {roomId}</Text>
               
            </View>
            <View style={styles.videoContainer}>
                {videoEnabled ? (
                    <RTCView
                        streamURL={localStream?.toURL()}
                        style={styles.localVideo}
                    />
                ) : (
                    renderInitialCircle(username.charAt(0).toUpperCase())
                )}
                <RTCView
                    streamURL={remoteStream?.toURL()}
                    style={styles.remoteVideo}
                />
            </View>
            <View style={styles.controlBar}>
                <TouchableOpacity style={styles.controlButton} onPress={toggleAudio}>
                    <Ionicons name={audioEnabled ? "mic" : "mic-off"} size={29} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={toggleVideo}>
                    <Ionicons name={videoEnabled ? "videocam" : "videocam-off"} size={29} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={toggleScreenShare}>
                    <Ionicons name={isScreenSharing ? "stop-circle" : "play-circle"} size={29} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={endCall}>
                    <Ionicons name="call" size={29} color="#ff6347" />
                </TouchableOpacity>
            </View>
            <Modal
                transparent={true}
                animationType="slide"
                visible={showRating}
                onRequestClose={() => setShowRating(false)}
            >
                <RatingComponent onRate={handleRating} />
            </Modal>
           
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.light.background,
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#1E3A8A',
        alignItems: 'center',
        shadowColor: '#fff',
        color: '#fff',
        shadowOpacity: 0,
        shadowRadius: 3.8,
        elevation: 5,
        borderRadius: 10,
    },
    meetingInfo: {
        color: '#fff',
        fontSize: 18,
    },
    exitButton: {
        padding: 8,
    },
    videoContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    localVideo: {
        width: '50%',
        height: '100%',
    },
    remoteVideo: {
        width: '50%',
        height: '100%',
    },
    controlBar: {
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        padding: 5,
        borderRadius: 90,
        backgroundColor: '#1E3A8A',
        elevation: 2,
        bottom:20,
        left: 19,
        width: '90%',
    },
    controlButton: {
        padding: 8,
    },
    initialCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        top: 140,
        backgroundColor: '#d2e0fb',
        justifyContent: 'center',
        alignItems: 'center',
    },
    initialText: {
        fontSize: 40,
        color: '#fff',
    },
    participantContainer: {
        padding: 16,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    participantName: {
        fontSize: 18,
        color: '#000',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
});

export default CallScreen;
