import { useDataStore } from '@/hooks/useData';
import { findBySongsId } from '@/service/SongsService';
import React, { useEffect, useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Loading from '../loading/loadgin';

type Props = {
    id: string | undefined;
}

export default function ChordData({ id }: Props) {
    const store = useDataStore();

    const processedStruct = useMemo(() => {
        if (!store.chord?.struct) return [];

        return store.chord.struct.map((section) => ({
            section: section.section,
            content: section.content.map((c) => ({
                value: c,
                isBreak: c.toLowerCase() === 'p'
            }))
        }));
    }, [store.chord]);

    async function loadChord() {
        if (!id) return;
        store.setChord(null);
        const chord = await findBySongsId(id);
        store.setChord(chord);
    }

    useEffect(() => {
        if (id) loadChord();
    }, [id]);

    return (
        <ScrollView>
            {!processedStruct && <Loading visible={true} />}

            {store.chord && (
                <>
                    <Text className='text-[2rem] text-title font-bold text-center flex-1'>
                        {store.chord.title}
                    </Text>
                    <View className='p-4'>
                        <View className='flex mb-4'>
                            <View className='flex-row justify-between'>
                                <Text className='text-name text-[1.5rem]'>{store.chord.singer}</Text>
                                <Text className='text-[1.5rem] font-semibold text-tone'>{store.chord.tone}</Text>
                            </View>
                        </View>
                        <View>
                            {processedStruct?.map((it, index) => (
                                <View key={index} className='flex-col mb-6'>
                                    <Text className='text-[2rem] text-name'>{it?.section}</Text>
                                    <View className='flex-row flex-wrap'>
                                        {it.content.map((c, idx) => (
                                            c.isBreak ? (
                                                <View key={idx} className="w-full h-0" />
                                            ) : (
                                                <Text key={idx} className='text-[2rem] text-notes font-semibold'>
                                                    {c.value}{' '}
                                                </Text>
                                            )
                                        ))}
                                    </View>
                                </View>
                            ))}
                        </View>
                    </View >
                </>
            )}
        </ScrollView>
    );
}
