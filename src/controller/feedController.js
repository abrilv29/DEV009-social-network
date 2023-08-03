import {
  getFirestore, collection, addDoc, onSnapshot, orderBy, query,
} from 'firebase/firestore';
import { app } from '../lib/config-firebase';

// const auth = getAuth();
const db = getFirestore(app);

export async function guardarPost(datos) {
  try {
    const documento = await addDoc(collection(db, 'posts'), {
      datos,
      created_date: Date.now(),
      author: localStorage.getItem('userName'),
      likes: 0,
    });
    console.log(datos);
    console.log('Document written with ID: ', documento.id);
    return documento;
  } catch (e) {
    console.error('Error adding document: ', e);
  }
  return null;
}

/*export async function traerpost(callback) {
  const userName = localStorage.getItem('userName');

  if (!userName) {
    // Si no se encuentra el nombre de usuario en el Local Storage, no hacemos nada.
    return;
  }
  console.log('Funcion traer post en tiempo real');
  const todosLosPosts = query(collection(db, 'posts'), orderBy('created_date', 'desc'));
  const newPost = onSnapshot(todosLosPosts, (querySnapshot) => {
    const postPorUsers = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().author === userName) {
        postPorUsers.push(doc.data());
      }// cierra el if
    });// cierra el forEach
    callback(postPorUsers); //
  });
  // eslint-disable-next-line consistent-return
  return newPost;
}*/
/*export async function traerpost(callback) {
  const userName = localStorage.getItem('userName');

  if (!userName) {
    // Si no se encuentra el nombre de usuario en el Local Storage, no hacemos nada.
    return;
  }
  console.log('Funcion traer post en tiempo real');
  const todosLosPosts = query(collection(db, 'posts'), orderBy('created_date', 'desc'));
  const newPost = onSnapshot(todosLosPosts, (querySnapshot) => {
    const postPorUsers = [];
    querySnapshot.forEach((doc) => {
      if (doc.data().author === userName) {
        postPorUsers.push(doc.data());
      }// cierra el if
    });// cierra el forEach
    console.log('Datos recibidos:', postPorUsers); // Agrega este log para verificar los datos recibidos
    callback(postPorUsers); //
  });
  // eslint-disable-next-line consistent-return
  return newPost;
}*/
export async function traerpost(callback) {
  const todosLosPosts = query(collection(db, 'posts'), orderBy('created_date', 'desc'));
  const newPost = onSnapshot(todosLosPosts, (querySnapshot) => {
    const postPorUsers = [];
    querySnapshot.forEach((doc) => {
      postPorUsers.push(doc.data());
    });
    console.log('Datos recibidos:', postPorUsers);
    callback(postPorUsers);
  });
  return newPost;
}