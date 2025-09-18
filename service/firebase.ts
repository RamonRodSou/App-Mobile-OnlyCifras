import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth/web-extension";
import { getFirestore } from "firebase/firestore";

// const extra = Constants.expoConfig?.extra ?? {};

export const firebaseConfig = {
    //     apiKey: extra.firebaseApiKey,
    //     authDomain: extra.firebaseAuthDomain,
    //     databaseURL: extra.firebaseDatabaseUrl,
    //     projectId: extra.firebaseProjectId,
    //     storageBucket: extra.firebaseStorageBucket,
    //     messagingSenderId: extra.firebaseMessagingSenderId,
    //     appId: extra.firebaseAppId,
    //     measurementId: extra.firebaseMeasurementId,


    apiKey: "AIzaSyCfqJy9CeRG0u-4TKx6QGDFomYcyjmfQpA",
    authDomain: "cifra-3739d.firebaseapp.com",
    projectId: "cifra-3739d",
    storageBucket: "cifra-3739d.firebasestorage.app",
    messagingSenderId: "588504489368",
    appId: "1:588504489368:web:88d4c5760335dc788bdfed",
    measurementId: "G-VW4NHMQB78"
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
export const provider = new GoogleAuthProvider();