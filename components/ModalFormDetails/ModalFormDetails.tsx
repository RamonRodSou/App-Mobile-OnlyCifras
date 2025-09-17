import React, { ReactNode, useState } from "react";
import {
    Modal,
    Text,
    TouchableOpacity,
    TouchableWithoutFeedback,
    View
} from "react-native";

type Props = {
    title: string;
    children: ReactNode;
    labelBtn?: string;
    submit: (close: () => void) => void;
};

export default function ModalFormDetails({
    title,
    children,
    labelBtn,
    submit
}: Props) {
    const [visible, setVisible] = useState(false);

    return (
        <View className="mb-5">
            <View className="flex-row justify-end mt-2">
                <TouchableOpacity
                    onPress={() => setVisible(true)}
                >
                    <Text className="text-white font-bold text-[1.5rem]">{labelBtn}</Text>
                </TouchableOpacity>
            </View>
            <Modal
                visible={visible}
                transparent
                animationType="fade"
                onRequestClose={() => setVisible(false)}
            >
                <TouchableWithoutFeedback onPress={() => setVisible(false)}>
                    <View className="flex-1 bg-black/40" />
                </TouchableWithoutFeedback>

                <View className="absolute top-20 left-0 right-0 bg-white rounded-lg justify-center items-center p-4">
                    <Text className="text-[2rem] text-primary mb-3">
                        {title}
                    </Text>

                    {children}

                    <TouchableOpacity
                        onPress={() => submit(() => setVisible(false))}
                        className="bg-tone w-full h-16 mt-[2rem] rounded-lg justify-center items-center shadow-md">
                        <Text className="text-title font-bold text-2xl">
                            Salvar
                        </Text>
                    </TouchableOpacity>
                </View>
            </Modal>
        </View>
    );
}
