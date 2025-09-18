import React from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";

type ConfirmationModalProps = {
    title: string;
    message?: string;
    visible: boolean;
    onCancel: () => void;
    onConfirm: () => void;
};

export default function ConfirmationModal({
    title,
    message,
    visible,
    onCancel,
    onConfirm
}: ConfirmationModalProps) {

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <TouchableWithoutFeedback onPress={onCancel}>
                <View className="flex-1 bg-black/40" />
            </TouchableWithoutFeedback>

            <View className="absolute top-1/3 left-6 right-6 bg-white rounded-lg p-6 shadow-lg">
                <Text className="text-[1.75rem] font-bold text-primary mb-2">
                    {title}
                </Text>
                {message && (
                    <Text className="text-base text-gray-700 mb-4">
                        {message}
                    </Text>
                )}

                <View className="flex-row justify-center gap-4">
                    <TouchableOpacity
                        onPress={onCancel}
                        className="px-4 py-2 bg-gray-300 rounded-lg shadow-md"
                    >
                        <Text className="text-black font-bold">Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        onPress={onConfirm}
                        className="px-4 py-2 bg-tone shadow-md rounded-lg"
                    >
                        <Text className="text-white font-bold">Confirmar</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );
}
