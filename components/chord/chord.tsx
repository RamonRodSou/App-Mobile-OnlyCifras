import { useDataStore } from '@/hooks/useData';
import { findBySongsId } from '@/service/SongsService';
import { useRouter } from 'expo-router';
import React, { useEffect } from 'react';
import { ScrollView, Text, View } from 'react-native';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';

type Props = {
    id: string | undefined;
}

export default function ChordData({ id }: Props) {
    const store = useDataStore();
    const router = useRouter();

    function isBreak(c: string) {
        return c.toLowerCase() === 'p';
    }

    async function loadChord() {
        if (!id) return;
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
            {/* <View className='flex-row items-center'> */}
            {/* <IconButton
                    icon="chevron-left"
                    size={28}
                    iconColor="#ffffff96"
                    onPress={handleBack}
                /> */}
            <Text className='text-[2rem] text-title font-bold text-center flex-1'>
                {store.chord.title}
            </Text>
            {/* </View> */}
            <View className='p-4'>
                <View className='flex mb-4'>
                    <View className='flex-row justify-between'>
                        <Text className='text-name text-[1.5rem]'>{store.chord.singer}</Text>
                        <Text className='text-[1.5rem] font-semibold text-tone'>{store.chord.tom}</Text>
                    </View>
                </View>
                <View>
                    {store.chord.Struct?.map((it, index) => (
                        <View key={index} className='flex-col mb-6'>
                            <Text className='text-[2rem] text-name'>{it?.section}</Text>
                            <View className='flex-row flex-wrap'>
                                {it.content.map((c, idx) => (
                                    isBreak(c) ? (
                                        <View key={idx} className="w-full h-0" />
                                    ) : (
                                        <Text key={idx} className='text-[2rem] text-notes font-semibold'>
                                            {c}{' '}
                                        </Text>
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
