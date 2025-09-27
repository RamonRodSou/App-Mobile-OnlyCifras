import { Tabs } from 'expo-router';
import React from 'react';

import { HapticTab } from '@/components/haptic-tab';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
    const size = 28;

    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#20f535',
                tabBarInactiveTintColor: '#dcd7d7ff',
                headerShown: false,
                tabBarButton: HapticTab,
            }}>
            <Tabs.Screen
                name="index"
                options={{
                    title: 'House',
                    tabBarIcon: ({ color }) => <Ionicons size={size} name="home" color={color} />,
                }}
            />

            <Tabs.Screen
                name="songsList"
                options={{
                    title: 'Biblioteca',
                    tabBarIcon: ({ color }) => <Ionicons size={size} name="musical-notes" color={color} />,
                }}
            />

            <Tabs.Screen
                name="playListTeam"
                options={{
                    title: 'Playlist',
                    tabBarIcon: ({ color }) => <Ionicons size={size} name="list" color={color} />,
                }}
            />
        </Tabs>
    );
}
