import {
  getAuth,
  signInWithEmailAndPassword,

} from 'firebase/auth';
import { app } from '../lib/config-firebase.js';

//const conexioBD = getFirestore(app);

export const loginUser = (email, password) => {
  const auth = getAuth(app);
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
    // Signed in
      const user = userCredential.user;
      console.log(user);
      window.history.pushState({}, '', `${window.location.origin}/feed`);
      /* ----- Dispara manualmente el evento popstate para actualizar la ruta ----- */
      window.dispatchEvent(new PopStateEvent('popstate'));
      window.location.reload();
    // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorCode, errorMessage);
    });
};
