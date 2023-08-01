import { conexionUser,newUser } from "../src/controller/registroController";
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';

//registro de usuarios
jest.mock('firebase/auth', () => ({

//getAut() test

}));