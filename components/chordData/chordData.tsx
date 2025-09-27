import { Chord } from '@/libs/domain/Chord/Chord';
import { User } from '@/libs/domain/users/member/User';
import { Tones } from '@/libs/enuns/Tones';
import { semitoneDiff, transposeChord } from '@/libs/utils/ChordUtils';
import { ColorUtils } from '@/libs/utils/ColorUtils';
import { StringUtils } from '@/libs/utils/StringUtils';
import { checkUserLiked, toggleLikeChord } from '@/service/ChordService';
import { findUserById, updateUserLikes } from '@/service/UserService';
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
    const [producer, setProducer] = useState<User>();
    const [liked, setLiked] = useState<boolean>(false);
    const [likesCount, setLikesCount] = useState<number>(chord?.likesCount ?? 0);

    const isLikes = likesCount === 1 || likesCount === 0 ? 'Like' : 'Likes';

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

    async function loadUserProducer() {
        const user = await findUserById(String(chord?.userId));

        if (user) setProducer(user);
    }

    async function handleLike() {
        if (!chord) return;

        const res = await toggleLikeChord(chord.id, liked);

        setLiked(res.liked);
        setLikesCount((prev) => res.liked ? prev + 1 : prev - 1);

        if (chord.userId) {
            await updateUserLikes(
                chord.userId,
                res.liked ? 1 : -1
            );
        }
    }

    useEffect(() => {
        if (chord?.tone) {
            setSelectedTone(chord.tone);
            setLikesCount(chord.likesCount ?? 0);
            loadUserProducer();
        }
    }, [chord]);

    useEffect(() => {
        if (chord) checkUserLiked(chord.id).then(setLiked);
    }, [chord]);

    return (
        <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
        >
            {!processedStruct && <Loading visible={true} />}

            {chord && (
                <View className='flex-1 justify-between'>
                    <View>
                        <View className="flex-row justify-start items-center">
                            <Text className='text-[2rem] text-title font-bold text-center flex-1'>
                                {chord.title}
                            </Text>
                            <CustomButton handle={() => editChord(chord.id)} color={ColorUtils.DEFAULT} icon='note-edit' />
                        </View>

                        <View className='p-4'>
                            <View className='flex-1 flex-row justify-between items-start mb-4'>
                                <View className="flex-col items-start">
                                    <Text className='text-name text-[1.5rem] mt-3'>{chord.singer}</Text>

                                    <TouchableOpacity onPress={() => setModalVisible(true)}>
                                        <Text className='text-[1.5rem] font-semibold text-tone mt-[-3]'>{selectedTone}</Text>
                                    </TouchableOpacity>
                                </View>
                                <View className="flex-col items-center">
                                    <CustomButton
                                        handle={handleLike}
                                        color={liked ? 'red' : ColorUtils.DEFAULT}
                                        icon={liked ? 'heart' : 'heart-outline'}
                                    />
                                    <Text className="text-title font-bold p-0 mt-[-6px]">
                                        {likesCount} {isLikes}
                                    </Text>
                                </View>
                            </View>

                            <View>
                                {processedStruct.map((it, index) => (
                                    <View key={index} className='flex-col mb-6'>
                                        <Text className='text-[1.8rem] text-name'>{it?.section}</Text>
                                        <View className='flex-row flex-wrap'>
                                            {it.content.map((c: any, idx: any) => (
                                                c.isBreak ? (
                                                    <View key={idx} className="w-full h-0" />
                                                ) : (
                                                    <Text key={idx} className='text-[1.8rem] text-notes font-semibold'>
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
                    <View className="p-4 mb-6">
                        <Text className="text-title mt-6 text-start">
                            By: {producer?.name}
                        </Text>
                    </View>
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
