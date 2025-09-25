import { formatDateBR } from "@/libs/utils/formatDateBr";
import { StringUtils } from "@/libs/utils/StringUtils";
import { registerService, UserRegistrationData } from "@/service/registerService";
import { emailExists } from "@/service/UserService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
    ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
    ScrollView,
    Text,
    TextInput, TouchableOpacity, View
} from "react-native";

export default function RegisterScreen() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [emailError, setEmailError] = useState(StringUtils.EMPTY);

    const [formData, setFormData] = useState({
        name: StringUtils.EMPTY,
        cpf: StringUtils.EMPTY,
        phone: StringUtils.EMPTY,
        birthdate: StringUtils.EMPTY,
        email: StringUtils.EMPTY,
        activePlan: "free",
        password: StringUtils.EMPTY,
        confirmPassword: StringUtils.EMPTY,
    });

    const handleInputChange = (field: keyof typeof formData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    async function handleRegister() {
        const { password, confirmPassword, ...profileData } = formData;

        if (Object.values(formData).some(v => v === StringUtils.EMPTY)) {
            Alert.alert("Atenção", "Por favor, preencha todos os campos.");
            return;
        }
        if (password !== confirmPassword) {
            Alert.alert("Erro", "As senhas não coincidem.");
            return;
        }

        setIsLoading(true);
        setEmailError(StringUtils.EMPTY);

        try {
            const exists = await emailExists(formData.email.trim().toLowerCase());
            if (exists) {
                setEmailError("Este e-mail já está cadastrado.");
                setIsLoading(false);
                return;
            }

            const userData: UserRegistrationData = { password, ...profileData };
            await registerService(userData);

            Alert.alert("Sucesso!", "Sua conta foi criada. Faça o login para continuar.");
            router.replace("/");
        } catch (error: any) {
            Alert.alert("Erro ao Cadastrar", error.message);
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            className="flex-1 bg-primary"
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}
                className="p-6"
                showsVerticalScrollIndicator={false}
            >
                <View className="items-center mb-8">
                    <Ionicons name="person-add-outline" size={60} color="#ffffffff" />
                    <Text className="text-3xl font-bold text-secondary mt-4">Criar Nova Conta</Text>
                    <Text className="text-base text-gray-500 mt-2">Vamos começar sua jornada.</Text>
                </View>

                <View className="space-y-4">
                    <View className="w-full mb-4 flex-row items-center rounded-xl bg-gray-800">
                        <TextInput
                            placeholder="Nome Completo"
                            value={formData.name}
                            onChangeText={(text) => handleInputChange("name", text)}
                            className="w-full mb-1 p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 text-xl"
                            placeholderTextColor="#9ca3af"
                        />
                    </View>

                    <View className="w-full mb-4 flex-row items-center rounded-xl bg-gray-800">
                        <TextInput
                            placeholder="Telefone"
                            value={formData.phone}
                            onChangeText={(text) => handleInputChange("phone", text)}
                            keyboardType="numeric"
                            className="w-full mb-1 p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 text-xl"
                            placeholderTextColor="#9ca3af" />
                    </View>

                    <View className="w-full mb-4 flex-row items-center rounded-xl bg-gray-800">
                        <TextInput
                            placeholder="CPF (apenas números)"
                            value={formData.cpf}
                            onChangeText={(text) => handleInputChange("cpf", text)}
                            keyboardType="numeric"
                            className="w-full mb-1 p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 text-xl"
                            placeholderTextColor="#9ca3af" />
                    </View>

                    <View className="w-full mb-4 flex-row items-center rounded-xl bg-gray-800">
                        <TextInput
                            placeholder="Data de Nascimento - DD/MM/AAAA"
                            value={formData.birthdate}
                            onChangeText={(text) => {
                                handleInputChange("birthdate", formatDateBR(text));
                            }}
                            maxLength={10}
                            keyboardType="numeric"
                            className="w-full mb-1 p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 text-xl"
                            placeholderTextColor="#9ca3af" />
                    </View>

                    <View className="w-full mb-4 flex-row items-center rounded-xl bg-gray-800">
                        <TextInput
                            placeholder="Seu melhor e-mail"
                            value={formData.email}
                            onChangeText={(text) => handleInputChange("email", text)}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            className="w-full mb-1 p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 text-xl"
                            placeholderTextColor="#9ca3af" />
                    </View>

                    <View className="w-full mb-4 flex-row items-center rounded-xl bg-gray-800">
                        <TextInput
                            placeholder="Crie uma senha forte"
                            value={formData.password}
                            onChangeText={(text) => handleInputChange("password", text)}
                            secureTextEntry
                            className="w-full mb-1 p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 text-xl"
                            placeholderTextColor="#9ca3af" />
                    </View>

                    <View className="w-full mb-4 flex-row items-center rounded-xl bg-gray-800">
                        <TextInput
                            placeholder="Confirme sua senha"
                            value={formData.confirmPassword}
                            onChangeText={(text) => handleInputChange("confirmPassword", text)}
                            secureTextEntry
                            className="w-full mb-1 p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 text-xl"
                            placeholderTextColor="#9ca3af" />
                    </View>
                </View>

                {emailError ? (
                    <Text className="text-red-400 mb-2">{emailError}</Text>
                ) : null}

                <TouchableOpacity
                    onPress={handleRegister}
                    disabled={isLoading}
                    className="bg-blue-500 p-4 mt-6 rounded-xl items-center justify-center shadow-md"
                >
                    {isLoading
                        ? <ActivityIndicator size="small" color="#FFF" />
                        : <Text className="text-white text-lg font-bold">Cadastrar</Text>
                    }
                </TouchableOpacity>

                <TouchableOpacity onPress={() => router.back()} className="mt-8 items-center">
                    <View className="flex-row gap-4 w-full">
                        <Text className="text-secondary">Já tem uma conta?</Text>
                        <Text className="text-tone font-bold">Faça o login</Text>
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView >
    );
}