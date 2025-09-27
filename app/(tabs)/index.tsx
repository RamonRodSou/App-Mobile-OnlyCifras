import { useAuth } from "@/context/AuthContext";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Alert, ScrollView, Text, TouchableOpacity, View } from "react-native";

type Props = {
    icon: any,
    title: string,
    subtitle: string,
    onPress: () => void,
}

const DashboardButton = ({ icon, title, subtitle, onPress }: Props) => (
    <TouchableOpacity
        onPress={onPress}
        className="bg-struct w-[150px] m-2 aspect-square flex-col justify-center items-center p-4 rounded-2xl shadow-md"
    >
        <Ionicons name={icon} size={40} color="#20f535" />
        <Text className="text-lg font-bold text-title mt-3 text-center">{title}</Text>
        <Text className="text-sm text-gray-400 text-center" numberOfLines={1}>{subtitle}</Text>
    </TouchableOpacity>
);

export default function DashboardScreen() {
    const router = useRouter();
    const { user, logout } = useAuth();

    async function handleSignOut() {
        Alert.alert(
            "Terminar Sessão",
            "Tem a certeza de que deseja sair da sua conta?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Sair",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await logout();
                            router.replace("/(auth)");
                        } catch (err) {
                            console.error("Erro ao sair:", err);
                        }
                    },
                },
            ]
        );
    }

    return (
        <ScrollView className="flex-1 bg-background p-6 pt-6">
            <View className="flex-row justify-between">
                <View className="mb-10">
                    <Text className="text-3xl font-bold text-title">
                        Olá, {user?.displayName?.split(' ').at(0) || "Músico"}!
                    </Text>
                    <Text className="text-lg text-gray-400">O que vamos fazer hoje?</Text>
                </View>
                <TouchableOpacity onPress={handleSignOut} className="p-2">
                    <Ionicons name="log-out-outline" size={32} color="#9ca3af" />
                </TouchableOpacity>
            </View>

            <View className="flex-row flex-wrap justify-center">
                <DashboardButton
                    title="Biblioteca"
                    subtitle="Suas músicas e cifras"
                    icon="musical-notes-outline"
                    onPress={() => router.push("./songsList")}
                />

                <DashboardButton
                    title="Grupos"
                    subtitle="Suas bandas e equipes"
                    icon="people-outline"
                    onPress={() => router.push("./(menu)/groupScreen")}
                />

                <DashboardButton
                    title="Cadastrar Musica"
                    subtitle="Nova Cifra"
                    icon="add-circle-outline"
                    onPress={() => router.push("./(menu)/chordDetails")}
                />

                <DashboardButton
                    title="Tutorial"
                    subtitle="Aprenda a Escrever Cifras"
                    icon="book-outline"
                    onPress={() => { }}
                />

                <DashboardButton
                    title="Meu Plano"
                    subtitle="Ver sua assinatura"
                    icon="ribbon"
                    onPress={() => { }}
                />

                <DashboardButton
                    title="Configurações"
                    subtitle="Ajustes do app"
                    icon="settings-outline"
                    onPress={() => { }}
                />
            </View>
        </ScrollView>
    );
}