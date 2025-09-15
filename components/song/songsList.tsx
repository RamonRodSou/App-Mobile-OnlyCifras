import { useDataStore } from '@/hooks/useData';
import { StructSong } from '@/libs/domain/StructSong/StructSong';
import { findAllSongs } from '@/service/SongsService';
import { Link } from 'expo-router';
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from 'react-native';
import { IconButton } from 'react-native-paper';

export default function SongsList() {
    const store = useDataStore();

    async function handleAddList(it: StructSong) {
        store.setIsFavorite(true);
    }

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
                <TouchableOpacity key={index} className='p-2 mb-2 rounded-md flex-row justify-between items-center'>
                    <Link href={`./chord/${it.id}`}>
                        <View>
                            <Text className='text-title text-xl' >{it.title}</Text>
                            <Text className='text-yellow-400 text-base'>{it.singer}</Text>
                        </View>
                    </Link>
                    {store.isFavorite
                        ? (
                            <TouchableOpacity>
                                <IconButton
                                    icon="cards-heart-outline"
                                    size={28}
                                    iconColor="#ffffff96"
                                    onPress={() => handleAddList(it)}
                                />
                            </TouchableOpacity>
                        ) :
                        (
                            <TouchableOpacity>
                                <IconButton
                                    icon="cards-heart"
                                    size={28}
                                    iconColor="#e60b0b96"
                                    onPress={() => handleAddList(it)}
                                />
                            </TouchableOpacity>

                        )
                    }
                </TouchableOpacity >
            ))}

        </>

    )
}