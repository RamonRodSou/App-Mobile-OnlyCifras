import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";

const extra = Constants.expoConfig?.extra ?? {};

export const firebaseConfig = {
    apiKey: extra.firebaseApiKey,
    authDomain: extra.firebaseAuthDomain,
    databaseURL: extra.firebaseDatabaseUrl,
    projectId: extra.firebaseProjectId,
    storageBucket: extra.firebaseStorageBucket,
    messagingSenderId: extra.firebaseMessagingSenderId,
    appId: extra.firebaseAppId,
    measurementId: extra.firebaseMeasurementId,

};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();