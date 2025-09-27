import { Crud } from "@/libs/domain/GenericCrud/GenericCrud";
import { User } from "@/libs/domain/users/member/User";
import { createUserWithEmailAndPassword, sendEmailVerification } from "firebase/auth";
import { collection, doc, documentId, getDoc, getDocs, increment, query, updateDoc, where } from "firebase/firestore";
import { auth, db } from "./firebase";

const collectionName = 'users';

export async function createUser(entity: User) {
    try {

        const userCredential = await createUserWithEmailAndPassword(
            auth,
            entity.email,
            entity.getPassword()
        );

        const createdUser = userCredential.user;
        if (!createdUser) throw new Error("Erro ao criar usuário.");

        await sendEmailVerification(createdUser);

        const passwordHash = await entity.getPasswordHash();

        const saveData = await saveUserToDatabase(entity, createdUser.uid, passwordHash);
        await Crud.add(collectionName, saveData);

        return createdUser;
    } catch (error) {
        alert("Erro ao adicionar usuário: " + error);
        throw error;
    }
}

export function findAllUsers(): Promise<User[]> {
    return Crud.findAllSummary<User>(collectionName)
}

export async function findUserById(id: string): Promise<User | null> {
    try {
        const ref = doc(db, collectionName, id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as User;
    } catch (error) {
        alert('Erro ao buscar usuário: ' + error);
        throw error;
    }
}

export async function findAllUsersByIds(ids: string[]): Promise<User[]> {

    try {
        if (!ids || ids.length === 0) return [];

        const chunks = [];
        for (let i = 0; i < ids.length; i += 10) {
            chunks.push(ids.slice(i, i + 10));
        }

        const results: User[] = [];

        for (const chunk of chunks) {
            const q = query(
                collection(db, collectionName),
                where(documentId(), "in", chunk)
            );
            const snapshot = await getDocs(q);
            snapshot.forEach((doc) => {
                results.push({ id: doc.id, ...doc.data() } as User);
            });
        }

        return results;
    } catch (error) {
        alert("Erro ao listar cifras: " + error);
        throw error;
    }
}

export async function updateUser(id: string, data: Partial<User>): Promise<void> {
    try {
        const ref = doc(db, collectionName, id);
        await updateDoc(ref, data);
    } catch (error) {
        alert('Erro ao atualizar usuário: ' + error);
        throw error;
    }
}

export async function updateUserLikes(userId: string, incrementValue: number) {
    const userRef = doc(db, "users", userId);
    await updateDoc(userRef, {
        receivedLikes: increment(incrementValue)
    });
}

export async function emailExists(email: string) {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email));
    const snapshot = await getDocs(q);
    return !snapshot.empty;
}

async function saveUserToDatabase(entity: User, id: string, passwordHash: string) {
    const data = {
        id,
        name: entity.name,
        email: entity.email,
        phone: entity.phone,
        birthdate: entity.birthdate ? entity.birthdate.toJSON() : null,
        memberOfGroups: entity.memberOfGroups,
        isActive: entity.isActive,
        createdAt: entity.createdAt,
        passwordHash,
    };

    return await data;
}
