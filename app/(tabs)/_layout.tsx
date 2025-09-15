import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const size = 28;

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#20f535',
        tabBarInactiveTintColor: '#999999',
        headerShown: false,
        tabBarButton: HapticTab,
      }}>
      <Tabs.Screen
        name="newChord"
        options={{
          title: 'Cadastro',
          tabBarIcon: ({ color }) => <Ionicons size={size} name="add-circle-outline" color={color} />,
        }}
      />

      <Tabs.Screen
        name="index"
        options={{
          title: 'Biblioteca',
          tabBarIcon: ({ color }) => <Ionicons size={size} name="musical-notes" color={color} />,
        }}
      />

      <Tabs.Screen
        name="playList"
        options={{
          title: 'Playlist',
          tabBarIcon: ({ color }) => <Ionicons size={size} name="list" color={color} />,
        }}
      />
    </Tabs>


  );
}
