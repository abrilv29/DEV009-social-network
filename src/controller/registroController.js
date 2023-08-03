import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { getFirestore, collection, addDoc } from 'firebase/firestore';
import { showError } from '../utils/showError.js';
import { app } from '../lib/config-firebase.js';

/* ---------------------Funcion para Registrar Usuarios Nuevos----------------------------- */
// Inicializar Cloud Firestore y obtener una referencia al servicio de Base de datos
// Perfil del la vista post, usando la cuenta de google
const conexioBD = getFirestore(app);

export const addUser = (nombre, email) => {
  addDoc(collection(conexioBD, 'Users'), {
    name: nombre,
    email,
  });
  console.log(addUser);
};
/* ---------------------Registro de Usuarios Nuevos----------------------------- */
// Registro de usuarios usando el formulario de registro

export const conexionUser = (nombre, email, password) => {
  const auth = getAuth(app);
  return createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      addUser(nombre, email);
      // Signed in
      const user = userCredential.user;
      const userName = nombre; // Usamos el nombre proporcionado en el formulario
      updateProfile(user, { displayName: userName });
      // Resto del código, no es necesario redirigir o disparar eventos aquí
      return userCredential; // Devolvemos el objeto userCredential después del registro exitoso
    })
    .catch((error) => {
      // Manejo de errores, no es necesario redirigir o disparar eventos aquí
      throw error;
    });
};
