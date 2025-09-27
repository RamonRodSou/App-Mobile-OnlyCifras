import { StringUtils } from "@/libs/utils/StringUtils";
import { auth } from "@/service/firebase";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Login() {
    const [email, setEmail] = useState<string>(StringUtils.EMPTY);
    const [password, setPassword] = useState<string>(StringUtils.EMPTY);
    const [error, setError] = useState<string>(StringUtils.EMPTY);
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();

    async function handleLogin() {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            if (userCredential.user.uid) {
                router.replace(`./(tabs)`);
            }

        } catch (err: any) {
            setError("E-mail ou senha inválidos");
            console.error(err);
        }
    }

    return (
        <View className="flex-1 bg-primary justify-center px-6">
            <Text className="text-5xl font-bold text-white text-center mb-8">Login</Text>

            <View className="w-full mb-4 flex-row items-center rounded-xl bg-gray-800">
                <TextInput
                    placeholder="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    className="w-full mb-1 p-4 rounded-xl bg-gray-800 text-white placeholder-gray-400 text-xl"
                    placeholderTextColor="#9ca3af"
                />
            </View>

            <View className="w-full mb-4 flex-row items-center rounded-xl bg-gray-800 justify-center">
                <TextInput
                    placeholder="Senha"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry={!showPassword}
                    className="flex-1 mb-1 p-4 text-white placeholder-gray-400 text-xl"
                    placeholderTextColor="#9ca3af"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} className="p-3">
                    <Ionicons
                        name={showPassword ? "eye-off" : "eye"}
                        size={22}
                        color="#9ca3af"
                    />
                </TouchableOpacity>
            </View>

            {error ? <Text className="text-red-500 text-center mb-3">{error}</Text> : null}

            <TouchableOpacity
                onPress={handleLogin}
                className="bg-blue-500 py-3 rounded-xl"
            >
                <Text className="text-white text-center text-lg font-semibold">Entrar</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push("/register")}
                className="mt-8 items-center text-gray-500"
            >
                <View className="flex-row gap-4 w-full">
                    <Text className="text-secondary">Não tem uma conta</Text>
                    <Text className="text-tone font-bold">Cadastre-se</Text>
                </View>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={() => router.push("/forgotPassWord")}
                className="mt-10 items-center text-gray-500">
                <Text className="text-default font-bold">Esqueci a senha</Text>
            </TouchableOpacity>
        </View>
    );
}