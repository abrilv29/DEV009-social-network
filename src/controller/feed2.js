/* eslint-disable no-console */
import {
  getFirestore, collection, addDoc, getDocs, orderBy, query,
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
    console.error('Error adding document:', e);
  }
  return null;
}
export async function traerpost() {
  const todosLosPosts = query(collection(db, 'posts'), orderBy('created_date', 'desc'));
  const querySnapshot = await getDocs(todosLosPosts);
  const postPorUsers = [];
  querySnapshot.forEach((doc) => {
    postPorUsers.push(doc.data());
  });
  return postPorUsers;
}
