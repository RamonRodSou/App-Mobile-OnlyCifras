import { useDataStore } from '@/hooks/useData';
import { findBySongsId } from '@/service/SongsService';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ActivityIndicator, IconButton, MD2Colors } from 'react-native-paper';
import './styles.css';

export default function Chord() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const store = useDataStore();
    const router = useRouter();

    function isBreak(c: string) {
        return c.toLowerCase() === 'p';
    }

    async function loadChord() {
        await findBySongsId(id)
            .then((it) => store.setChord(it));
    }

    useEffect(() => {
        if (id) loadChord();
    }, [id]);

    if (!store.chord) {
        return (
            <ActivityIndicator animating={true} color={MD2Colors.red800} />
        );
    }

    function handleBack() {
        router.back();
    }

    return (
        <ScrollView>
            <View className='header'>
                <IconButton
                    icon="chevron-left"
                    size={28}
                    iconColor="#ffffff96"
                    onPress={handleBack}
                />
                <Text className='title font-bold text-center flex-1 mr-20'>
                    {store.chord.title}
                </Text>
            </View>
            <View className='container'>
                <View className='flex mb-4'>
                    <View className='data'>
                        <Text className='title'>{store.chord.singer}</Text>
                        <Text className='tone'>{store.chord.tom}</Text>
                    </View>
                </View>
                <View>
                    {store.chord.Struct?.map((it, index) => (
                        <View key={index} className='chords'>
                            <Text className='title'>{it?.section}</Text>
                            <View className='notes'>
                                {it?.content.map((c, i) => (
                                    isBreak(c) ? (
                                        <Text key={i} className='break' />
                                    ) : (
                                        <Text key={i} className='title'>{c}</Text>
                                    )
                                ))}
                            </View>
                        </View>
                    ))}
                </View>

            </View >
        </ScrollView>
    );
}
