import { User } from "@/libs/domain/users/member/User";
import { StringUtils } from "@/libs/utils/StringUtils";
import {
    browserLocalPersistence,
    setPersistence,
    signInWithEmailAndPassword,
} from "firebase/auth";
import {
    doc,
    getDoc,
    serverTimestamp,
    updateDoc,
} from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { auth, db } from "./firebase";

const SESSION_TIMEOUT_MINUTES = 5;

export class AuthService {

    static async login(email: string, password: string): Promise<User> {
        try {
            await setPersistence(auth, browserLocalPersistence);

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const userRef = doc(db, "users", userCredential.user.uid);
            const userSnap = await getDoc(userRef);

            if (!userSnap.exists()) {
                await auth.signOut();
                throw new Error("Usuário não encontrado na base");
            }

            const userData = userSnap.data();
            const now = Date.now();

            if (userData.sessionId && userData.lastSeen?.toMillis) {
                const lastSeenMs = userData.lastSeen.toMillis();
                const diffMin = (now - lastSeenMs) / 60000;
                if (diffMin < SESSION_TIMEOUT_MINUTES) {
                    await auth.signOut();
                    throw new Error(
                        "Este usuário já está logado em outro dispositivo ou sessão ativa."
                    );
                }
            }

            const sessionId = uuidv4();
            await updateDoc(userRef, {
                isLoggedIn: true,
                sessionId,
                lastSeen: serverTimestamp(),
            });

            return new User(
                userCredential.user.uid,
                userCredential.user.email || StringUtils.EMPTY
            );
        } catch (error: any) {
            console.error("Erro detalhado:", error);

            let errorMessage = "Falha no login";
            if (error.code) {
                switch (error.code) {
                    case "auth/invalid-email":
                        errorMessage = "E-mail inválido";
                        break;
                    case "auth/user-disabled":
                        errorMessage = "Usuário desativado";
                        break;
                    case "auth/user-not-found":
                    case "auth/wrong-password":
                        errorMessage = "E-mail ou senha incorretos";
                        break;
                    case "auth/too-many-requests":
                        errorMessage = "Muitas tentativas. Tente mais tarde";
                        break;
                }
            }
            throw new Error(errorMessage);
        }
    }

    static isAuthenticated(): boolean {
        return auth.currentUser !== null;
    }

    static async logout(): Promise<void> {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, {
                isLoggedIn: false,
                sessionId: null,
                lastSeen: serverTimestamp(),
            });
        }
        return auth.signOut();
    }

    static async refreshSession(): Promise<void> {
        const currentUser = auth.currentUser;
        if (currentUser) {
            const userRef = doc(db, "users", currentUser.uid);
            await updateDoc(userRef, { lastSeen: serverTimestamp() });
        }
    }
}
