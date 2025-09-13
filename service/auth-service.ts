// import { auth } from "@service/firebase";
// import { browserLocalPersistence, setPersistence, signInWithEmailAndPassword } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";
// import { db } from "@service/firebase";
// import { AdminSummary } from "@domain/user";
// import { EMPTY } from "@domain/utils/string-utils";

// export class AuthService {
//     static async login(email: string, password: string): Promise<AdminSummary> {
//         try {
            
//             await setPersistence(auth, browserLocalPersistence);

//             const userCredential = await signInWithEmailAndPassword(auth, email, password);
            
//             const adminDoc = await getDoc(doc(db, "admins", userCredential.user.uid));
            
//             if (!adminDoc.exists()) {
//                 throw new Error("Usuário não encontrado na base de administradores");
//             }
            
//             return new AdminSummary(
//                 userCredential.user.uid,
//                 userCredential.user.email || EMPTY
//             );
            
//         } catch (error: any) {
//             console.error("Erro detalhado:", error);
            
//             let errorMessage = "Falha no login";
//             switch (error.code) {
//                 case "auth/invalid-email":
//                     errorMessage = "E-mail inválido";
//                     break;
//                 case "auth/user-disabled":
//                     errorMessage = "Usuário desativado";
//                     break;
//                 case "auth/user-not-found":
//                 case "auth/wrong-password":
//                     errorMessage = "E-mail ou senha incorretos";
//                     break;
//                 case "auth/too-many-requests":
//                     errorMessage = "Muitas tentativas. Tente mais tarde";
//                     break;
//             }
            
//             throw new Error(errorMessage);
//         }
//     }

//     static isAuthenticated(): boolean {
//         return auth.currentUser !== null;
//     }

//     static logout(): Promise<void> {
//         return auth.signOut();
//     }
// }