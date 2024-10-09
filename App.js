
import 'react-native-gesture-handler';
import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Button, StyleSheet, Text, View } from 'react-native';

import VideoList from './src/components/VideoList';
import VideoPlayer from './src/screens/VideoPlayer';
import { enableScreens } from 'react-native-screens';
enableScreens();

export default function App() {
  const Stack = createStackNavigator();

  return (
    <NavigationContainer>
    <Stack.Navigator initialRouteName="VideoList">
      <Stack.Screen 
        name="VideoList" 
        component={VideoList} 
        options={{ title: 'Lista de Vídeos' }} 
      />
      <Stack.Screen 
        name="VideoPlayer" 
        component={VideoPlayer} 
        options={{ title: 'Reprodutor' }} 
      />
    </Stack.Navigator>
  </NavigationContainer>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
