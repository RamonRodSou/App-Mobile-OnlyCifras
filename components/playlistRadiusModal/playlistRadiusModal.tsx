import { PlayList } from "@/libs/domain/PlayList/PlayList";
import React, { useEffect, useState } from "react";
import { Modal, ScrollView, Text, TouchableOpacity, View } from "react-native";

type PlaylistModalProps = {
    visible: boolean;
    onClose: () => void;
    playList: PlayList[];
    onSubmit: (selectedIds: string[]) => void;
    preSelected?: string[];
};

export default function PlaylistRadiusModal({ visible, onClose, playList, onSubmit, preSelected = [] }: PlaylistModalProps) {
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const toggleSelection = (id: string) => {
        if (selectedIds.includes(id)) {
            setSelectedIds(selectedIds.filter((i) => i !== id));
        } else {
            setSelectedIds([...selectedIds, id]);
        }
    };

    useEffect(() => {
        setSelectedIds(preSelected);
    }, [preSelected]);

    return (
        <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
            <TouchableOpacity
                activeOpacity={1}
                className="flex-1 bg-black/40 justify-center items-center"
                onPress={onClose}
            >
                <TouchableOpacity
                    activeOpacity={1}
                    className="bg-white rounded-lg p-6 w-11/12 max-h-[80%]"
                >
                    <Text className="text-xl font-bold mb-4">Escolha as Playlists</Text>
                    <ScrollView className="mb-4">
                        {playList.map((it) => (
                            <TouchableOpacity
                                key={it.id}
                                onPress={() => toggleSelection(it.id)}
                                className="flex-row items-center justify-between px-4 py-3 mb-2 rounded-lg bg-gray-100"
                            >
                                <Text className="text-base">{it.name}</Text>
                                <View className="w-6 h-6 mr-4 rounded-full border border-gray-500 flex items-center justify-center">
                                    {selectedIds.includes(it.id) && (
                                        <View className="w-3 h-3 rounded-full bg-blue-500" />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        onPress={() => {
                            onSubmit(selectedIds);
                            onClose();
                        }}
                        className="bg-blue-500 py-3 rounded-lg items-center"
                    >
                        <Text className="text-white font-bold">Adicionar Música</Text>
                    </TouchableOpacity>
                </TouchableOpacity>
            </TouchableOpacity>
        </Modal>
    );
}
