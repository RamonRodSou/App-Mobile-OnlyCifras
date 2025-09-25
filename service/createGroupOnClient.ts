import { httpsCallable } from "firebase/functions";
import { auth, functions } from "./firebase";

export async function createGroupOnClient(groupName: string) {

    if (!auth.currentUser) {
        const errorMessage = "Você precisa estar logado para criar um grupo.";
        alert(errorMessage);
        throw new Error(errorMessage);
    }

    try {
        const callCreateGroup = httpsCallable(functions, 'createGroup');

        const result = await callCreateGroup({ groupName: groupName });

        const { groupId } = result.data as { groupId: string };
        return groupId;

    } catch (error) {

        console.error("Erro detalhado da Cloud Function:", error);
        alert("Erro ao criar grupo: ");

        throw error;
    }
}