import { useDataStore } from '@/hooks/useData';
import { findAllChords } from "@/service/ChordsService";
import React, { useEffect } from "react";
import { Text, TouchableOpacity, View } from 'react-native';
import './styles.css';


export default function Chords() {
    const store = useDataStore();

    async function handleNav(id: string) {
        console.log(id)
    }

    async function loadData() {
        await findAllChords().then((it) => {
            store.setStructChords(it);
        })
    }

    useEffect(() => {
        loadData();
    }, []);

    return (
        <>
            {store.structChords?.map((it, index) => (
                <TouchableOpacity key={index} className='card' onPress={() => handleNav(it.id)}>
                    <View>
                        <Text className='title' >{it.title}</Text>
                        <Text className='subtitle'>{it.singer}</Text>
                    </View>
                </TouchableOpacity >
            ))}

        </>

    )
}


