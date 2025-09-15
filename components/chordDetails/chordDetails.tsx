import { StructSong } from "@/libs/domain/StructSong/StructSong";
import { useState } from "react";
import { Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";

export default function ChordDetails() {
    const [form, setForm] = useState<StructSong>(new StructSong());

    function handleChange(field: keyof StructSong, value: string) {
        setForm(prev => {
            const data = { ...prev, [field]: value };
            return StructSong.fromJson(data);
        });
    };

    function handleSubmit(): void {
    }

    return (
        <View className="p-4">
            <Text className="text-[2rem] text-title">
                Cadastrar Nova Cifra
            </Text>
            <TextInput
                label="Título"
                value={form?.title}
                onChangeText={(it) => handleChange('title', it)}
            />
            <TextInput
                label="Cantor"
                value={form?.singer}
                onChangeText={(it) => handleChange('singer', it)}
            />
            <Button mode="contained" onPress={handleSubmit}>
                Salvar
            </Button>
        </View>
    )
}