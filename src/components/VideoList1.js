// src/components/VideoList.js
import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Image, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { parseM3U } from '../utils/parseM3U';
import { useNavigation } from '@react-navigation/native';

const VideoList = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true); // Estado de carregamento
  const navigation = useNavigation();
  const [items, setItems] = useState([]);
  const [currentUrl, setCurrentUrl] = useState(null);

  useEffect(() => {
    const loadM3U = async () => {
      const lista = await parseM3U ('https://strimer-mutimidia.vercel.app/filmes.m3u');//('https://strimer-mutimidia.vercel.app/AmaonPrimer.m3u'); // Substitua pela URL correta
      console.log('Lista de vídeos carregada:', lista); // Verificação de depuração
      setVideos(lista);
      setLoading(false);
      loadM3UFromUrl(lista);
    };
    loadM3U();
  }, []);
  const loadM3UFromUrl = async (url) => {
    const parsedItems = await parseM3UFileFromUrl(url);
    setVideos(parsedItems);
    setLoading(false);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity 
      style={styles.itemContainer}
      onPress={()  => 
     {if(item.url.endsWith('.m3u') || item.url.endsWith('.m3u8')){loadM3UFromUrl(item.url)} else if (item.url.endsWith('.mp4')) {
     
      navigation.navigate('VideoPlayer', { videoUrl: item.url })
    } }
       

      }
    >
      {item['tvg-logo'] ? (
        <Image source={{ uri: item['tvg-logo'] }} style={styles.thumbnail} />
      ) : (
        <View style={[styles.thumbnail, styles.placeholder]}>
          <Text style={styles.placeholderText}>Sem Imagem</Text>
        </View>
      )}
      <View style={styles.info}>
        <Text style={styles.title}>{item.title}</Text>
        {/* Você pode adicionar mais informações aqui, se necessário */}
      </View>
    </TouchableOpacity>
  );

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
      contentContainerStyle={videos.length === 0 && styles.emptyContainer}
      ListEmptyComponent={<Text>Nenhum vídeo encontrado.</Text>}
    />
  );
};

const styles = StyleSheet.create({
  itemContainer: { flexDirection: 'row', padding: 10, borderBottomWidth: 1, borderColor: '#ccc' },
  thumbnail: { width: 100, height: 60, marginRight: 10, borderRadius: 5 },
  placeholder: { backgroundColor: '#eee', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { color: '#888', fontSize: 12 },
  info: { flex: 1, justifyContent: 'center' },
  title: { fontSize: 16, fontWeight: 'bold' },
  loaderContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyContainer: { flexGrow: 1, justifyContent: 'center', alignItems: 'center' },
});

export default VideoList;