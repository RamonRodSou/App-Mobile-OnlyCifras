import { Chord } from '@/libs/domain/Chord/Chord';
import { Tones } from '@/libs/enuns/Tones';
import { semitoneDiff, transposeChord } from '@/libs/utils/ChordUtils';
import { ColorUtils } from '@/libs/utils/ColorUtils';
import { StringUtils } from '@/libs/utils/StringUtils';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '../customButton/customButton';
import Loading from '../loading/loadgin';

type Props = {
    chord: Chord | null,
}

export default function ChordData({ chord }: Props) {

    const router = useRouter();
    const [selectedTone, setSelectedTone] = useState<Tones | string>(chord?.tone || StringUtils.EMPTY);
    const [modalVisible, setModalVisible] = useState<boolean>(false);

    const editChord = useCallback(async (chordId: string) => {
        router.push({
            pathname: "/editChord/[id]",
            params: {
                id: chordId,
                chord: JSON.stringify(chord)
            }
        });
    }, [router, chord]);


    const diff = useMemo(() => {
        if (!selectedTone || !chord?.tone) return 0;
        return semitoneDiff(chord.tone, selectedTone);
    }, [selectedTone, chord]);

    const processedStruct = useMemo(() => {
        if (!chord?.struct) return [];

        return chord.struct.map((section) => ({
            section: section.section,
            content: section.content.map((c) => ({
                value: diff ? transposeChord(c, diff) : c,
                isBreak: c.toLowerCase() === 'p'
            }))
        }));
    }, [chord, diff]);

    useEffect(() => {
        if (chord?.tone) {
            setSelectedTone(chord.tone);
        }
    }, [chord]);

    return (
        <ScrollView>
            {!processedStruct && <Loading visible={true} />}

            {chord && (
                <View>
                    <View className="flex-row justify-between items-center">
                        <Text className='text-[2rem] text-title font-bold text-center flex-1'>
                            {chord.title}
                        </Text>
                        <CustomButton handle={() => editChord(chord.id)} color={ColorUtils.DEFAULT} icon='note-edit' />
                    </View>
                    <View className='p-4'>
                        <View className='flex mb-4'>
                            <View className='flex-row justify-between'>
                                <Text className='text-name text-[1.5rem]'>{chord.singer}</Text>

                                <TouchableOpacity onPress={() => setModalVisible(true)}>
                                    <Text className='text-[1.5rem] font-semibold text-tone'>{selectedTone}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View>
                            {processedStruct.map((it, index) => (
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
                    <Modal
                        visible={modalVisible}
                        transparent
                        animationType="slide"
                        onRequestClose={() => setModalVisible(false)}
                    >
                        <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setModalVisible(false)}
                            className="flex-1 bg-black/40"
                        />

                        <View className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6">
                            <View className="flex-row justify-between items-center mb-4">
                                <Text className="text-lg font-bold text-gray-800">Tom</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Text className="text-2xl text-gray-500">×</Text>
                                </TouchableOpacity>
                            </View>

                            <View className="flex-row flex-wrap justify-center">
                                {Object.values(Tones).map((tone) => {
                                    const isSelected = selectedTone === tone;

                                    return (
                                        <TouchableOpacity
                                            key={tone}
                                            onPress={() => {
                                                setSelectedTone(tone);
                                                setModalVisible(false);
                                            }}
                                            className={`m-2 w-20 h-20 rounded-full items-center justify-center ${isSelected ? 'bg-tone' : 'bg-gray-200'
                                                }`}
                                        >
                                            <Text
                                                className={`text-base font-semibold ${isSelected ? 'text-white' : 'text-gray-800'
                                                    }`}
                                            >
                                                {tone}
                                            </Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </View>

                        </View>
                    </Modal>

                </View>
            )}
        </ScrollView>
    );
}
