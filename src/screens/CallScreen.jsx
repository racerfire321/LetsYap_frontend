import React, { useEffect, useRef, useState } from 'react';
import {
    SafeAreaView,
    View,
    TouchableOpacity,
    Text,
    StyleSheet,
    Modal,
    Button,
} from 'react-native';
import { RTCPeerConnection, RTCSessionDescription, mediaDevices, RTCView } from 'react-native-webrtc';
import io from 'socket.io-client';
import { RTCIceCandidate } from 'react-native-webrtc';
import { useFocusEffect } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { SOCKET_URL, pcConfig } from '../utils/config/config';
import RatingComponent from '../components/modal/RatingModal'; // Import the RatingComponent

const socket = io(SOCKET_URL);

const CallScreen = ({ route, navigation }) => {
    const { roomId, username, isAudioOff, isVideoOff } = route.params;
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [inCall, setInCall] = useState(false);
    const [audioEnabled, setAudioEnabled] = useState(!isAudioOff);
    const [videoEnabled, setVideoEnabled] = useState(!isVideoOff);
    const [showRating, setShowRating] = useState(false); // State to control rating visibility

    const pc = useRef(new RTCPeerConnection(pcConfig));
    const localStreamRef = useRef(null);

    useEffect(() => {
        startCall();

        const handleRoomNotFound = () => {
            alert('Room not found!');
        };

        const handleUserConnected = async ({ userId }) => {
            const offer = await pc.current.createOffer();
            await pc.current.setLocalDescription(offer);
            socket.emit('offer', roomId, offer);
        };

        socket.on('room-not-found', handleRoomNotFound);
        socket.on('user-connected', handleUserConnected);

        return () => {
            socket.off('room-not-found', handleRoomNotFound);
            socket.off('user-connected', handleUserConnected);
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
                    const iceCandidate = new RTCIceCandidate(candidate); // Ensure RTCIceCandidate is defined
                    await pc.current.addIceCandidate(iceCandidate);
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
                // Cleanup when navigating away
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
        setShowRating(true); // Show rating component after ending the call
    };

    const handleRating = (rating) => {
        console.log(`User rated: ${rating}`);
        setShowRating(false); // Hide rating component after rating
        navigation.navigate('Home'); // Navigate back to home or another screen
    };

    const toggleAudio = () => {
        setAudioEnabled(prevState => !prevState);
    };

    const toggleVideo = () => {
        setVideoEnabled(prevState => !prevState);
    };

    const renderInitialCircle = (nameInitial) => (
        <View style={styles.initialCircle}>
            <Text style={styles.initialText}>{nameInitial}</Text>
        </View>
    );

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.meetingInfo}>Lobby ID: {roomId}</Text>
                <TouchableOpacity style={styles.exitButton} onPress={endCall}>
                    <Ionicons name="exit-outline" size={24} color="#000" />
                </TouchableOpacity>
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
                    <Ionicons name={audioEnabled ? "mic" : "mic-off"} size={27} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton} onPress={toggleVideo}>
                    <Ionicons name={videoEnabled ? "videocam" : "videocam-off"} size={27} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="share-outline" size={27} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity style={styles.controlButton}>
                    <Ionicons name="people-outline" size={27} color="#fff" />
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
        backgroundColor: '#f5f5f5',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 16,
        backgroundColor: '#d2e0fb',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0,
        shadowRadius: 3.8,
        elevation: 5,
        borderRadius: 10,
    },
    meetingInfo: {
        color: '#000',
        fontSize: 16,
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
        padding: 16,
        borderRadius: 90,
        backgroundColor: '#1E3A8A',
        elevation: 5,
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
});

export default CallScreen;
