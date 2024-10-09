// src/screens/VideoPlayer.js
import React, { useRef, useState } from 'react';
import { View, StyleSheet, ActivityIndicator, Dimensions, Text } from 'react-native';
import { Video } from 'expo-av';

const VideoPlayer = ({ route }) => {
  const { videoUrl } = route.params;
  const video = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  return (
    <View style={styles.container}>
      {isLoading && (
        <ActivityIndicator size="large" color="#ffffff" style={styles.loader} />
      )}
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Erro ao carregar o vídeo.</Text>
        </View>
      )}
      <Video
        ref={video}
        source={{ uri: videoUrl }}
        rate={1.0}
        volume={1.0}
        isMuted={false}
        resizeMode="contain"
        shouldPlay
        useNativeControls
        style={styles.video}
        onLoadStart={() => {
          console.log('Iniciando o carregamento do vídeo...');
          setIsLoading(true);
          setError(null);
        }}
        onLoad={() => {
          console.log('Vídeo carregado com sucesso.');
          setIsLoading(false);
        }}
        onError={(error) => {
          console.error('Erro ao carregar o vídeo:', error);
          setIsLoading(false);
          setError('Erro ao carregar o vídeo.');
        }}
      />
    </View>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: 'black', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  video: { 
    width: width * 0.95, 
    height: height * 0.5 
  },
  loader: { 
    position: 'absolute', 
    zIndex: 1 
  },
  errorContainer: { 
    position: 'absolute', 
    zIndex: 2, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  errorText: { 
    color: 'red', 
    fontSize: 16 
  },
});

export default VideoPlayer;