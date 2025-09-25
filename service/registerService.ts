import { httpsCallable } from "firebase/functions";
import { functions } from "./firebase";

export interface UserRegistrationData {
    email: string;
    password: string;
    name: string;
    birthdate: string;
    cpf: string;
    phone: string;
    activePlan: string;
}

export async function registerService(userData: UserRegistrationData) {
    try {
        const registerUserFunction = httpsCallable(functions, 'registerUser');

        await registerUserFunction(userData);

    } catch (error: any) {
        console.error("Erro ao chamar a função de registro:", error);
        throw new Error(error.message);
    }
}