import { StringUtils } from "@/libs/utils/StringUtils";
import { auth } from "@/service/firebase";
import { useRouter } from "expo-router";
import { sendPasswordResetEmail } from "firebase/auth";
import React, { useState } from "react";
import { Alert, Text, TextInput, TouchableOpacity, View } from "react-native";

export default function ForgotPasswordScreen() {
    const [email, setEmail] = useState(StringUtils.EMPTY);
    const router = useRouter();

    async function handleResetPassword() {
        if (!email.trim()) {
            Alert.alert("Atenção", "Digite seu e-mail.");
            return;
        }

        try {
            await sendPasswordResetEmail(auth, email.trim());
            Alert.alert(
                "E-mail enviado",
                "Verifique sua caixa de entrada (ou spam) para redefinir sua senha."
            );
            router.back();
            setEmail(StringUtils.EMPTY);

        } catch (error: any) {
            console.log(error);
            let message = "Erro ao enviar e-mail. Tente novamente.";
            if (error.code === "auth/user-not-found") {
                message = "Nenhuma conta encontrada com este e-mail.";
            } else if (error.code === "auth/invalid-email") {
                message = "E-mail inválido.";
            }
            Alert.alert("Erro", message);
        }
    }

    return (
        <View className="flex-1 justify-center p-4">
            <Text className="text-title mb-20 text-3xl font-bold text-center">
                Redefinir Senha
            </Text>

            <View className="w-full mb-4 flex-row items-center rounded-xl bg-gray-800">
                <TextInput
                    placeholder="Digite seu e-mail"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="w-full mb-1 p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 text-xl"
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <TouchableOpacity
                onPress={handleResetPassword}
                className="bg-blue-500 py-3 rounded-xl"
            >
                <Text className="text-white text-center text-lg font-semibold">Enviar E-mail</Text>
            </TouchableOpacity>
        </View>
    );
}
