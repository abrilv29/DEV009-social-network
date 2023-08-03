import {
  getFirestore, collection, addDoc, getDocs, orderBy, query, updateDoc,
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
}

export async function traerpost() {
  console.log('Funcion traer');
  const todosLosPosts = query(collection(db, 'posts'), orderBy('created_date', 'desc'));
  const documentos = await getDocs(todosLosPosts);
  return documentos;
}

export async function updatePost(post) {
  try {
    const documento = await updateDoc(addDoc(db, 'posts', post.id), post);
    return documento;
  } catch (e) {
    console.error('Error updating document: ', e);
  }
}
