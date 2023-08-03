import {
  getAuth,
  signInWithEmailAndPassword,

} from 'firebase/auth';
import { app } from '../lib/config-firebase.js';

// const conexioBD = getFirestore(app);

export const loginUser = async (email, password) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Signed in
    const token = userCredential.user.accessToken;
    localStorage.setItem('accessToken', token);
    console.log(token);
    const mail = userCredential.user.email;
    localStorage.setItem('email', mail);
    console.log(mail);
    const userName = userCredential.user.displayName;
    return userName; // Devolvemos el nombre de usuario
    // ...
  } catch (error) {
    throw error;
  }
};
