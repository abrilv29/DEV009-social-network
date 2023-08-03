import {
<<<<<<< HEAD
  getFirestore, collection, addDoc, getDocs, orderBy, query, updateDoc,
=======
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
>>>>>>> 23ca2f430915e1c073f31f01717880b57ebdecc2
} from 'firebase/firestore';
import { app } from '../lib/config-firebase';

const db = getFirestore(app);

export async function guardarPost(datos) {
  try {
    const documento = await addDoc(collection(db, 'posts'), datos);

    console.log(datos);
    console.log('Document written with ID: ', documento.id);
    return documento;
  } catch (e) {
    console.error('Error adding document: ', e);
  }
<<<<<<< HEAD
=======
  return null;
>>>>>>> 23ca2f430915e1c073f31f01717880b57ebdecc2
}

export async function traerpost() {
  console.log('Funcion traer');
  const todosLosPosts = query(collection(db, 'posts'), orderBy('created_date', 'desc'));
  const documentos = await getDocs(todosLosPosts);
  return documentos;
<<<<<<< HEAD
}

export async function updatePost(post) {
  try {
    const documento = await updateDoc(addDoc(db, 'posts', post.id), post);
    return documento;
  } catch (e) {
    console.error('Error updating document: ', e);
  }
=======
>>>>>>> 23ca2f430915e1c073f31f01717880b57ebdecc2
}
