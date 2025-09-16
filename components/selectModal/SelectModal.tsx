import { StringUtils } from "@/libs/utils/StringUtils";
import { Ionicons } from "@expo/vector-icons";
import React, { useMemo, useState } from "react";
import {
    FlatList,
    Modal,
    TextInput as RNTextInput,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";

type Option = { label: string; value: string };

type Props = {
    label?: string;
    value?: string;
    placeholder?: string;
    options: Option[];
    onChange: (val: string) => void;
};

export default function SelectModal({
    value,
    options,
    onChange,
}: Props) {
    const [visible, setVisible] = useState(false);
    const [query, setQuery] = useState(StringUtils.EMPTY);

    const filtered = useMemo(
        () =>
            options.filter((o) =>
                o.label.toLowerCase().includes(query.trim().toLowerCase())
            ),
        [options, query]
    );

    return (
        <View>
            <View className="flex-row justify-start mt-2">
                <TouchableOpacity
                >
                    <Text className="text-white font-bold">Mais</Text>
                </TouchableOpacity>
            </View>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => setVisible(true)}
            >
                <View className="flex-row items-center justify-between h-16 px-3 bg-gray-100 border border-gray-300 rounded-[3px]">
                    <Text
                        numberOfLines={1}
                        className={`text-[1.375rem] ${value ? "text-gray-900" : "text-gray-400"}`}
                    >
                        {value}
                    </Text>
                    <Ionicons
                        name={visible ? "chevron-up" : "chevron-down"}
                        size={25}
                        color="#555"
                    />
                </View>
            </TouchableOpacity>

            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View className="flex-1 bg-black/40" />
                </TouchableWithoutFeedback>

                <View className="absolute bottom-0 left-0 right-0 max-h-[60%] bg-white rounded-t-xl items-center pb-2">
                    <View className="w-12 h-1.5 bg-gray-300 rounded-full mt-2 mb-2" />

                    <View className="w-full px-3 mb-2">
                        <RNTextInput
                            placeholder="Pesquisar..."
                            value={query}
                            onChangeText={setQuery}
                            returnKeyType="done"
                            className="h-11 px-3 rounded-lg border border-gray-200 bg-gray-50 text-base"
                        />
                    </View>

                    <FlatList
                        data={filtered.length ? filtered : options}
                        keyExtractor={(item) => item.value}
                        keyboardShouldPersistTaps="handled"
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                className="w-full px-4 py-3"
                                onPress={() => {
                                    onChange(item.value);
                                    setQuery(StringUtils.EMPTY);
                                    setVisible(false);
                                }}
                            >
                                <Text className="text-lg text-gray-800">{item.label}</Text>
                            </TouchableOpacity>
                        )}
                        ItemSeparatorComponent={() => (
                            <View className="h-px bg-gray-100" />
                        )}
                        className="w-full"
                    />
                </View>
            </Modal>
        </View>
    );
}
