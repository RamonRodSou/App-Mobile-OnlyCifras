import { Ionicons } from "@expo/vector-icons";
import { useFocusEffect } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import { Stack } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from "react-native";

import FormDetailsModal from "@/components/formDetailsModal/formDetailsModal";
import Loading from "@/components/loading/loadgin";
import { Group } from '@/libs/domain/Group/Group';
import { User } from '@/libs/domain/users/member/User';
import { ColorUtils } from "@/libs/utils/ColorUtils";
import { StringUtils } from "@/libs/utils/StringUtils";
import { createGroupOnClient } from "@/service/createGroupOnClient";
import { findMyGroupWithMembers, joinGroupWithCode } from "@/service/GroupService";

export default function GroupScreen() {
    const [group, setGroup] = useState<Group | null>(null);
    const [members, setMembers] = useState<User[]>([]);

    const [loading, setLoading] = useState(true);
    const [createModalVisible, setCreateModalVisible] = useState(false);
    const [joinModalVisible, setJoinModalVisible] = useState(false);

    const [groupName, setGroupName] = useState(StringUtils.EMPTY);
    const [inviteCodeInput, setInviteCodeInput] = useState(StringUtils.EMPTY);
    const [isCreating, setIsCreating] = useState(false);
    const [isJoining, setIsJoining] = useState(false);

    useFocusEffect(
        useCallback(() => {
            async function loadGroupData() {
                setLoading(true);
                try {
                    const result = await findMyGroupWithMembers();
                    if (result) {
                        setGroup(result.group);
                        setMembers(result.members);
                    } else {
                        setGroup(null);
                        setMembers([]);
                    }
                } catch (err: any) {
                    Alert.alert("Erro", err.message || "Não foi possível carregar seu grupo.");
                } finally {
                    setLoading(false);
                }
            }
            loadGroupData();
            console.log(members)
        }, [])
    );

    async function handleCreate(close: () => void) {
        if (groupName.trim().length < 3) {
            Alert.alert("Aviso", "O nome do grupo precisa de no mínimo 3 caracteres.");
            return;
        }
        setIsCreating(true);
        try {
            await createGroupOnClient(groupName);
            Alert.alert("Sucesso!", `Grupo "${groupName}" criado!`);
            setGroupName(StringUtils.EMPTY);
            close();
        } catch (error: any) {
            Alert.alert("Erro ao Criar", error.message || "Falha ao criar grupo.");
        } finally {
            setIsCreating(false);
        }
    }

    async function handleJoin(close: () => void) {
        if (inviteCodeInput.trim().length < 6) {
            Alert.alert("Aviso", "O código de convite é inválido.");
            return;
        }
        setIsJoining(true);
        try {
            await joinGroupWithCode(inviteCodeInput.toUpperCase());
            Alert.alert("Sucesso!", "Você entrou no grupo!");
            setInviteCodeInput(StringUtils.EMPTY);
            close();
        } catch (error: any) {
            Alert.alert("Erro ao Entrar", error.message || "Não foi possível entrar no grupo.");
        } finally {
            setIsJoining(false);
        }
    }

    const copyToClipboard = async (code?: string) => {
        if (!code) return;
        await Clipboard.setStringAsync(code);
        Alert.alert("Copiado!", "O código de convite foi copiado.");
    };

    if (loading) {
        return <Loading />
    }

    return (
        <View className="flex-1 bg-primary p-6">
            <Stack.Screen options={{ title: group ? group.name : "Meu Grupo", headerStyle: { backgroundColor: '#111827' }, headerTintColor: '#FFF' }} />

            {group ? (
                <ScrollView showsVerticalScrollIndicator={false}>
                    <Text className="text-3xl font-bold text-white text-center">{group.name}</Text>

                    <View className="bg-gray-800 border border-gray-700 p-4 rounded-xl my-6">
                        <Text className="text-blue-400 font-semibold text-center mb-2">Código para Convidar</Text>
                        <View className="flex-row items-center justify-between bg-gray-900 p-2 rounded-lg">
                            <Text className="text-3xl font-bold tracking-[.25em] text-blue-400 pl-2">{group.inviteCode}</Text>
                            <TouchableOpacity onPress={() => copyToClipboard(group.inviteCode)} className="p-2 bg-gray-700 rounded-md">
                                <Ionicons name="copy-outline" size={24} color={ColorUtils.SUB_TITLE} />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Text className="text-xl font-bold text-gray-300 mb-3">Membros ({members.length})</Text>
                    <View>
                        {members.map((it, index) => (
                            <View key={index} className="flex-row items-center bg-gray-800 p-3 rounded-lg mb-2">
                                <Ionicons name="person-circle-outline" size={28} color="#9ca3af" className="mr-3" />
                                <Text className="text-base text-gray-200 font-medium">{it.name}</Text>
                            </View>
                        ))}
                    </View>

                </ScrollView>
            ) : (

                <View className="flex-1 justify-center items-center space-y-5">
                    <Text className="text-xl text-gray-400 text-center">Você ainda não faz parte de um grupo.</Text>

                    <TouchableOpacity onPress={() => setCreateModalVisible(true)} className="bg-blue-600 py-3 px-6 rounded-lg shadow-lg w-full items-center">
                        <Text className="text-white text-lg font-bold">Criar Meu Grupo</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => setJoinModalVisible(true)} className="bg-gray-700 py-3 px-6 rounded-lg w-full items-center">
                        <Text className="text-white text-lg font-bold">Entrar com Código</Text>
                    </TouchableOpacity>
                </View>
            )}

            <FormDetailsModal visible={createModalVisible} title="Criar Novo Grupo" onClose={() => setCreateModalVisible(false)} submit={handleCreate} onOpen={() => setJoinModalVisible(true)}>
                <TextInput placeholder="Nome da banda ou ministério" value={groupName} onChangeText={setGroupName} className="border border-gray-600 bg-gray-800 text-white p-4 rounded-xl text-lg w-full" placeholderTextColor="#9ca3af" />
            </FormDetailsModal>

            <FormDetailsModal visible={joinModalVisible} title="Entrar em um Grupo" onClose={() => setJoinModalVisible(false)} submit={handleJoin} onOpen={() => setJoinModalVisible(true)}>
                <TextInput placeholder="Código de Convite" value={inviteCodeInput} onChangeText={setInviteCodeInput} autoCapitalize="characters" maxLength={6} className="border border-gray-600 bg-gray-800 text-white p-4 rounded-xl text-lg w-full text-center tracking-[.25em]" placeholderTextColor="#9ca3af" />
            </FormDetailsModal>
        </View>
    );
}
