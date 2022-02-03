import firebaseConfig from "./config";
import {initializeApp} from 'firebase/app';
import { getAuth,GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseApp = initializeApp(firebaseConfig);

const auth = getAuth(firebaseApp);
const googleAuthProvider = new GoogleAuthProvider();
const db = getFirestore(firebaseApp);

export {auth ,googleAuthProvider, db};