import {
  getFirestore, collection, addDoc, getDocs, orderBy, query,
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
  return null;
}

export async function traerpost() {
  console.log('Funcion traer');
  const todosLosPosts = query(collection(db, 'posts'), orderBy('created_date', 'desc'));
  const documentos = await getDocs(todosLosPosts);
  return documentos;
}
