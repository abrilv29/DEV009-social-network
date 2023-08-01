import {
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from 'firebase/firestore';

import {
  getAuth,
  signInWithEmailAndPassword,

} from 'firebase/auth';
import { app } from '../lib/config-firebase.js';

// login por usuario y contraseña desde el formulario
export const loginUser = (email, password) => {
  const auth = getAuth(app);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in
      const tokenuser = userCredential.user.accessToken;
      console.log(tokenuser);
      localStorage.setItem('accessToken', tokenuser);
      const emailtoken = userCredential.user.email;
      console.log(emailtoken);
      localStorage.setItem('email', emailtoken);
      return true;
    // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};
// Validamos que el usuario exista mediante el password
const db = getFirestore(app);
export const getUserByEmail = (email) => {
  const queryUser = query(collection(db, 'usuarios'), where('email', '==', email));
  return getDocs(queryUser)
    .then((arrayConsulta) => arrayConsulta)
    .catch((error) => {
      throw error;
    });
};
