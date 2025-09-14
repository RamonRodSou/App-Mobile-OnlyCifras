import { useDataStore } from '@/hooks/useData';
import { findAllSongs } from '@/service/SongsService';
import { Link } from 'expo-router';
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from 'react-native';

export default function SongsList() {
    const store = useDataStore();

    async function loadData() {
        await findAllSongs().then((it) => {
            store.setStructSong(it);
        })
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            {store.structSong?.map((it, index) => (
                <TouchableOpacity key={index} className='card'>
                    <Link href={`/_component/chord/${it.id}`}>
                        <View>
                            <Text className='title' >{it.title}</Text>
                            <Text className='subtitle'>{it.singer}</Text>
                        </View>
                    </Link>
                </TouchableOpacity >
            ))}

        </>

    )
}