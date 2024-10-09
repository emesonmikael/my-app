// src/components/VideoList.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import { parseM3U } from '../utils/parseM3U';
import { useNavigation } from '@react-navigation/native';

const VideoList = ({ route }) => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  
  // Recebe a URL da playlist a ser carregada; se não for fornecida, usa a URL padrão
  const { playlistUrl } = route.params || { playlistUrl: 'https://strimer-mutimidia.vercel.app/lista.m3u' };

  useEffect(() => {
    const loadM3U = async () => {
      const lista = await parseM3U(playlistUrl);
      console.log('Lista de vídeos carregada:', lista);
      setVideos(lista);
      setLoading(false);
    };
    loadM3U();
  }, [playlistUrl]);

  const handlePress = (item) => {
    const videoUrl = item.url.toLowerCase();
    if (videoUrl.endsWith('.m3u') || videoUrl.endsWith('.m3u8')) {
      // Se for um arquivo M3U ou M3U8, navega para a mesma tela com a nova playlist
      navigation.push('VideoList', { playlistUrl: item.url });
    } else if (videoUrl.endsWith('.mp4') || videoUrl.endsWith('.m3u8')) {
      // Se for um vídeo, navega para o reprodutor
      navigation.navigate('VideoPlayer', { videoUrl: item.url });
    } else {
      // Tipo desconhecido
      alert('Tipo de arquivo desconhecido.');
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={() => handlePress(item)}
    >
      {item['tvg-logo'] ? (
        <Image source={{ uri: item['tvg-logo'] }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.placeholder]}>
          <Text style={styles.placeholderText}>Sem Imagem</Text>
        </View>
      )}
      <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
    </TouchableOpacity>
  );

  const numColumns = 2; // Defina o número de colunas desejado
  const { width } = Dimensions.get('window');
  const itemWidth = (width - 30) / numColumns; // Ajuste o cálculo conforme necessário

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Carregando vídeos...</Text>
      </View>
    );
  }

  return (
    <FlatList 
      data={videos}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      numColumns={numColumns}
      contentContainerStyle={videos.length === 0 && styles.emptyContainer}
      ListEmptyComponent={<Text>Nenhum vídeo encontrado.</Text>}
      columnWrapperStyle={styles.row}
    />
  );
};

const styles = StyleSheet.create({
  row: {
    flex: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  itemContainer: { 
    flex: 1,
    margin: 5,
    alignItems: 'center',
    maxWidth: '48%', // Para evitar que as colunas excedam o espaço
  },
  thumbnail: { 
    width: '100%', 
    height: 150, 
    borderRadius: 5 
  },
  placeholder: { 
    backgroundColor: '#eee', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  placeholderText: { 
    color: '#888', 
    fontSize: 12 
  },
  title: { 
    marginTop: 5, 
    fontSize: 14, 
    fontWeight: 'bold', 
    textAlign: 'center' 
  },
  loaderContainer: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  emptyContainer: { 
    flexGrow: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
});

export default VideoList;