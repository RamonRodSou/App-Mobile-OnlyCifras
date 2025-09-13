
import { User } from "@/libs/domain/users/member/User";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { auth, db } from "./firebase";

export async function createUser(entity: User, passwordHash: string) {
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, entity.email, passwordHash);
        const createdUser = userCredential.user;

        if (!createdUser) throw new Error("Usuário não autenticado.");

        await setDoc(doc(db, 'users', createdUser.uid), {
            name: entity.name,
            birthdate: entity.birthdate,
            cpf: entity.cpf,
            email: entity.email,
            phone: entity.phone,
            isActive: entity.isActive,
            createdAt: new Date()
        });

    } catch (error) {
        alert('Erro ao registrar um novo adminstrador: ' + error);
        throw error;
    }
}

export async function findUserToById(id: string): Promise<User | null> {
    try {
        const ref = doc(db, 'users', id);
        const snapshot = await getDoc(ref);

        if (!snapshot.exists()) return null;

        return { id: snapshot.id, ...snapshot.data() } as User;
    } catch (error) {
        alert('Erro ao buscar usuário: ' + error);
        throw error;
    }
}

export async function findAllUsers(): Promise<User[]> {
    try {
        const user = auth.currentUser;
        if (!user) throw new Error("Usuário não autenticado.");

        const snapshot = await getDocs(collection(db, 'users'));
        return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() } as User));
    } catch (error) {
        alert('Erro ao listar usuário: ' + error);
        throw error;
    }
}

// export async function invited(user: User, url: string) {
//     const token = uuidv4();

//     const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

//     await setDoc(doc(db, 'invites', token), {
//         email: user.email,
//         permission: user.permission,
//         createdAt: new Date(),
//         expiresAt: expiresAt
//     });

//     return `${url}/gestor/new-user?token=${token}`;
// }