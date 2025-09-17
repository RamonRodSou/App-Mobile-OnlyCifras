import { StructSong } from '@/libs/domain/StructSong/StructSong';
import React, { useMemo } from 'react';
import { ScrollView, Text, View } from 'react-native';
import Loading from '../loading/loadgin';

type Props = {
    chord: StructSong | null,
}

export default function ChordData({ chord }: Props) {

    const processedStruct = useMemo(() => {
        if (!chord?.struct) return [];

        return chord.struct.map((section) => ({
            section: section.section,
            content: section.content.map((c) => ({
                value: c,
                isBreak: c.toLowerCase() === 'p'
            }))
        }));
    }, [chord]);

    return (
        <ScrollView>
            {!processedStruct && <Loading visible={true} />}

            {chord && (
                <View>
                    <Text className='text-[2rem] text-title font-bold text-center flex-1'>
                        {chord.title}
                    </Text>
                    <View className='p-4'>
                        <View className='flex mb-4'>
                            <View className='flex-row justify-between'>
                                <Text className='text-name text-[1.5rem]'>{chord.singer}</Text>
                                <Text className='text-[1.5rem] font-semibold text-tone'>{chord.tone}</Text>
                            </View>
                        </View>
                        <View>
                            {processedStruct?.map((it, index) => (
                                <View key={index} className='flex-col mb-6'>
                                    <Text className='text-[2rem] text-name'>{it?.section}</Text>
                                    <View className='flex-row flex-wrap'>
                                        {it.content.map((c: any, idx: any) => (
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
                </View>
            )}
        </ScrollView>
    );
}
