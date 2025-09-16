import { collection, deleteField, doc, getDocs, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export async function migrateCifras() {
    const cifrasRef = collection(db, "cifras");
    const snapshot = await getDocs(cifrasRef);

    if (snapshot.empty) {
        console.log("Nenhum documento encontrado na coleção cifras.");
        return;
    }

    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const updatedData: any = {};

        if ("tom" in data) {
            updatedData.tone = data.tom;
            updatedData.tom = deleteField();;
        }

        if ("Struct" in data) {
            updatedData.struct = data.Struct;
            updatedData.Struct = deleteField();;
        }

        if (Object.keys(updatedData).length > 0) {
            const docRef = doc(db, "cifras", docSnap.id);
            await updateDoc(docRef, updatedData);
            console.log(`Documento ${docSnap.id} atualizado.`);
        }
    }

    console.log("Migração concluída com sucesso!");
}

export async function cleanNullFields() {
    const cifrasRef = collection(db, "cifras");
    const snapshot = await getDocs(cifrasRef);

    if (snapshot.empty) {
        console.log("Nenhum documento encontrado na coleção cifras.");
        return;
    }

    for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const updates: any = {};

        Object.entries(data).forEach(([key, value]) => {
            if (value === null) {
                updates[key] = deleteField();
            }
        });

        if (Object.keys(updates).length > 0) {
            const docRef = doc(db, "cifras", docSnap.id);
            await updateDoc(docRef, updates);
            console.log(`Campos null removidos do documento ${docSnap.id}`);
        }
    }

    console.log("Limpeza de campos null concluída!");
}

cleanNullFields();