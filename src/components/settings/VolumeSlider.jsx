import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import VolumeManager from 'react-native-volume-manager';
import Slider from '@react-native-community/slider';

const VolumeSlider = () => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    // Get the current volume when the component mounts
    const getVolume = async () => {
      const currentVolume = await VolumeManager.getVolume();
      setVolume(currentVolume);
    };

    getVolume();
  }, []);

  const handleVolumeChange = async (value) => {
    setVolume(value);
    await VolumeManager.setVolume(value);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Volume Control</Text>
      <View style={styles.volume}>
      <Slider
        style={styles.slider}
        minimumValue={0}
        maximumValue={1}
        value={volume}
        onValueChange={handleVolumeChange}
        minimumTrackTintColor="#1EB1FC"
        maximumTrackTintColor="#FFFFFF"
        thumbTintColor="#1EB1FC"
      />
      <Text style={styles.volumeText}>Volume: {(volume * 100).toFixed(0)}%</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    marginVertical: 20,
  },
  title: {
    fontSize: 18,
    
    marginBottom: 10,
  },
  slider: {
    width: 130,
    height: 40,
  },
  volume:{
    flexDirection: 'column',
  },
  volumeText: {
    bottom: 10,
    fontSize: 12,
  },
});

export default VolumeSlider;
