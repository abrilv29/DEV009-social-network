import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  setPersistence,
  browserLocalPersistence,
  onAuthStateChanged,
  signOut,
  onIdTokenChanged,
} from 'firebase/auth';
import { app } from '../lib/config-firebase.js';

// const conexioBD = getFirestore(app);

export const logout = async () => {
  try {
    const auth = getAuth(); // Obtener la instancia de autenticación
    await signOut(auth); // Cerrar la sesión

    // Eliminar datos de la sesión en localStorage
    localStorage.clear();

    // Redirigir a la página de inicio de sesión
    window.location.href = `${window.location.origin}/`;
  } catch (error) {
    console.error('Error durante el cierre de sesión:', error);
    throw new Error('Error during logout:');
  }
};

// Función para manejar el cambio en el token de ID (para expiración del token)
const handleTokenChange = (user) => {
  if (!user) {
    console.log('Token expirado o usuario no autenticado. Cerrando sesión...');
    logout();
  }
};

export const checkAndRedirect = () => {
  const auth = getAuth(); // Obtener la instancia de autenticación
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log('Usuario autenticado. Redireccionando...');
      // Escuchar cambios en el token de ID
      onIdTokenChanged(auth, handleTokenChange);
      window.location.href = `${window.location.origin}/feed`;
    } else {
      console.log('Usuario no autenticado. Manteniendo la página actual...');
    }
  });
};

export const loginUser = async (email, password) => {
  // eslint-disable-next-line no-useless-catch
  try {
    const auth = getAuth(app);
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    // Configura la persistencia de sesión en "Sesión Permanente"
    await setPersistence(auth, browserLocalPersistence);
    // Almacenar el nombre de usuario en el localStorage
    // Guardar la URL de la imagen de perfil en el LocalStorage (usar la URL predeterminada)
    const userImageUrl = '../img/perfil-usuario.jpg';
    localStorage.setItem('userImage', userImageUrl);
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
    // cierre de session
    const tokenSession = userCredential.user.accessToken;
    sessionStorage.setItem('userToken', tokenSession);
    console.log(tokenSession);
    const userName = userCredential.user.displayName;
    checkAndRedirect();
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

  // Configura la persistencia de sesión en "Sesión Permanente"
  setPersistence(auth, browserLocalPersistence)
    .then(() => {
      console.log('Persistencia de sesión configurada');

      // Iniciar sesión con cuenta de Google
      signInWithPopup(auth, provider)
        .then((result) => {
          const user = result.user;

          // Guardar la información en el localStorage
          localStorage.setItem('userId', user.uid);
          localStorage.setItem('userImage', user.photoURL);
          localStorage.setItem('userDisplayName', user.displayName);
          localStorage.setItem('userGmail', user.email);

          // cierre de session
          const tokenSession = user.getIdToken();
          sessionStorage.setItem('userToken', tokenSession);
          console.log('Redireccionando a la página de feed');

          // Redirigir a la página de feed
          window.location.href = `${window.location.origin}/feed`;

          // Verificar y redirigir automáticamente si el usuario ya inició sesión
          checkAndRedirect(); // Llamada a la función de redirección
        })
        .catch((error) => {
          // Manejar errores
          console.log(error.code, error.message);
        });
    })
    .catch((error) => {
      console.error('Error al configurar persistencia de sesión:', error);
    });
};
