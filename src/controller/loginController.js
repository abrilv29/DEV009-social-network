import {
  getAuth,
  signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider,
} from 'firebase/auth';
import { app } from '../lib/config-firebase.js';

// const conexioBD = getFirestore(app);

export const loginUser = async (email, password) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);

    // Guardar la URL de la imagen de perfil en el LocalStorage (usar la URL predeterminada)
    const userImageUrl = '../img/perfil-usuario.jpg';
    localStorage.setItem('userImage', userImageUrl);
    // Almacenar el nombre de usuario en el localStorage
    localStorage.setItem('userDisplayName', userCredential.user.displayName);
    // Almacenar el correo electrónico del usuario en el localStorage
    localStorage.setItem('userGmail', userCredential.user.email);
    // Almacenar el id del usuario en el localStorage
    localStorage.setItem('userId', userCredential.user.uid);
    // Signed in
    const token = userCredential.user.accessToken;
    localStorage.setItem('accessToken', token);
    const emailToken = userCredential.user.email;
    localStorage.setItem('email', emailToken);
    const userName = userCredential.user.displayName;
    return userName; // Devolvemos el nombre de usuario
    // ...
  } catch (error) {
    throw error;
  }
};

/* -------------------------- Login con cuenta de Google ------------------------- */
export const loginWithGoogle = () => {
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const token = credential.accessToken;
      const user = result.user;
      // Guardar la información en el localStorage
      localStorage.setItem('userId', user.uid);
      localStorage.setItem('userImage', user.photoURL);
      localStorage.setItem('userDisplayName', user.displayName);
      localStorage.setItem('userGmail', user.email);

      window.location.href = `${window.location.origin}/feed`;
      console.log(token, user);
    })
    .catch((error) => {
      // Manejar errores
      console.log(error.code, error.message);
    });
};
