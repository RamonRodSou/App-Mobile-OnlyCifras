import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

import FormDetailsModal from '@/components/formDetailsModal/formDetailsModal';
import { Group } from '@/libs/domain/Group/Group';
import { IErrors } from '@/libs/domain/Interfaces/IError';
import { PlayList } from '@/libs/domain/PlayList/PlayList';
import { PlaylistType } from "@/libs/enuns/PlayListType";
import { ColorUtils } from "@/libs/utils/ColorUtils";
import { StringUtils } from '@/libs/utils/StringUtils';
import { sanitize, validatePlayListForm } from '@/libs/utils/validate';
import { auth } from '@/service/firebase';
import { findMyGroupWithMembers } from '@/service/GroupService';
import { createGroupPlaylistOnClient, createPlayList, findUserPlaylists } from '@/service/PlayListService';

export default function PlayListTeam() {
    const [form, setForm] = useState<PlayList>(new PlayList());
    const [data, setData] = useState<PlayList[]>([]);
    const [errors, setErrors] = useState<IErrors>({});
    const [loading, setLoading] = useState<boolean>(true);
    const [modalVisible, setModalVisible] = useState<boolean>(false);
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

    const [group, setGroup] = useState<Group | null>(null);
    const [isUserAdmin, setIsUserAdmin] = useState(false);
    const [modalType, setModalType] = useState<PlaylistType>(PlaylistType.PERSONAL);

    function handleChange(field: keyof PlayList, value: any) {
        setForm(prev => PlayList.fromJson({ ...prev, [field]: value }));
    };

    async function handleSubmit(close: () => void) {
        const sanitizedName = sanitize(String(form.name ?? StringUtils.EMPTY));
        const validationErrors = validatePlayListForm(PlayList.fromJson({ name: sanitizedName }));

        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        setErrors({});

        try {
            // 2. Lógica específica baseada no tipo do modal
            if (modalType === PlaylistType.GROUP) {
                if (!group) throw new Error("Grupo não encontrado para criar a playlist.");
                await createGroupPlaylistOnClient(group.id, sanitizedName);
            } else { // 'PERSONAL'
                const newPlaylist = PlayList.fromJson({
                    ...form,
                    name: sanitizedName,
                    type: PlaylistType.PERSONAL,
                });
                await createPlayList(newPlaylist);
                setIsSubmitting(true)
            }

            Alert.alert("Sucesso!", "Playlist criada com sucesso.");
            setForm(new PlayList());
            close();
            await loadData();

        } catch (error: any) {
            console.error(`Erro ao criar playlist do tipo ${modalType}:`, error);
            Alert.alert("Erro", error.message || `Não foi possível criar a playlist.`);
        }
    }

    async function loadData() {
        setLoading(true);
        try {
            const [playLists, groupResult] = await Promise.all([
                findUserPlaylists(),
                findMyGroupWithMembers()
            ]);

            setData(playLists);

            if (groupResult) {
                setGroup(groupResult.group);
                const currentUserIsAdmin = groupResult.group.ownerId === auth.currentUser?.uid;
                setIsUserAdmin(currentUserIsAdmin);
            }
        } catch (error) {
            console.error("Erro ao carregar dados:", error);
            Alert.alert("Erro", "Não foi possível carregar os dados da página.");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadData();
    }, []);

    if (loading) {
        return <ActivityIndicator size="large" className="flex-1 bg-background" />;
    }

    return (
        <ScrollView className="flex-1 bg-background p-6">
            <View className="flex-row justify-between mb-1 space-x-2">
                <TouchableOpacity onPress={() => { setModalType(PlaylistType.PERSONAL); setModalVisible(true); }} className="bg-bg p-2 p-6 w-[45%] rounded-lg flex-row items-center">
                    <Ionicons name="add" size={18} color="white" />
                    <Text className="text-white font-bold ml-1">Nova Pessoal</Text>
                </TouchableOpacity>

                {isUserAdmin && (
                    <TouchableOpacity onPress={() => { setModalType(PlaylistType.GROUP); setModalVisible(true); }} className="bg-tone p-6  w-[45%] rounded-lg flex-row items-center">
                        <Ionicons name="people" size={18} color="white" />
                        <Text className="text-white font-bold ml-1">Nova do Grupo</Text>
                    </TouchableOpacity>
                )}
            </View>

            <FormDetailsModal
                onClose={() => { setModalVisible(false); setForm(new PlayList()); }}
                onOpen={() => setModalVisible(true)}
                visible={modalVisible}
                title={modalType === PlaylistType.PERSONAL ? "Nova Playlist Pessoal" : `Nova Playlist para ${group?.name}`}
                submit={handleSubmit}
                isLoading={isSubmitting}            >
                <TextInput
                    placeholder="Título da Playlist"
                    className="mb-4 w-full border border-gray-300 p-4 rounded-xl text-[1.375rem] bg-secondary text-primary"
                    value={form.name}
                    onChangeText={(it) => handleChange('name', it)}
                />
                {errors.name && <Text className="text-red-500 mb-2">{errors.name}</Text>}
            </FormDetailsModal>

            <View className="flex-col gap-4">
                {data.map((it) => (
                    <Link
                        href={{
                            pathname: "/favoriteList/[id]",
                            params: { id: it.id, type: it.type, groupId: it.groupId }
                        }}
                        key={it.id}
                    >
                        <View className="flex-row justify-between items-center bg-struct rounded-3xl p-5 shadow-md w-full">
                            <View className="flex-1 pr-4">
                                <Text className="text-2xl font-bold text-title mb-1" numberOfLines={1}>
                                    {it.name}
                                </Text>

                            </View>
                            <View className="flex-row items-center gap-4">
                                {it.type === 'GROUP' && (
                                    <View className="flex-row items-center bg-blue-500/20 self-start px-2 py-1 rounded-full mt-1">
                                        <Ionicons name="people" size={12} color={ColorUtils.TONES} />
                                        <Text className="text-xs text-tone font-bold ml-1">GRUPO</Text>
                                    </View>
                                )}

                                {it.type === 'PERSONAL' && (
                                    <View className="flex-row items-center bg-blue-500/20 self-start px-2 py-1 rounded-full mt-1">
                                        <Ionicons name="person" size={12} color={ColorUtils.SUB_TITLE} />
                                        <Text className="text-xs text-subTitle font-bold ml-1">PESSOAL</Text>
                                    </View>
                                )}
                                <Text className="text-sm text-default">
                                    {it.songId?.length || 0} músicas
                                </Text>
                            </View>
                        </View>
                    </Link>
                ))}
            </View>
        </ScrollView>
    );
}

