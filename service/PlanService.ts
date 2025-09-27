import { Plan } from "@/libs/domain/Plan/Plan";
import { doc, getDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function findPlansById(id: string): Promise<Plan | null> {
    try {
        const ref = doc(db, "plans", id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as Plan;
    } catch (error) {
        alert('Erro ao buscar plano: ' + error);
        throw error;
    }
}
