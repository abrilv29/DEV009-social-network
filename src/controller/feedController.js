import {
  getFirestore,
  collection,
  addDoc,
  getDocs,
  orderBy,
  query,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import { app } from '../lib/config-firebase';

// const auth = getAuth(); // Obtener la instancia de Firebase Authentication
const db = getFirestore(app);

export async function guardarPost(datos) {
  try {
    const documento = await addDoc(collection(db, 'posts'), datos);
    // console.log('Document written with ID: ', documento.id);
    return documento;
  } catch (e) {
    console.error('Error adding document: ', e);
  }
  return null;
}

export async function traerPost() {
  const todosLosPosts = query(collection(db, 'posts'), orderBy('created_date', 'desc'));
  const documentos = await getDocs(todosLosPosts);
  return documentos;
}

// Likes
export async function addLiked(userId, idPost, counter) {
  const documentoPosts = doc(db, 'posts', idPost);
  const contador = counter + 1;
  // Atomically add a new usuario to the "likes" array field.
  await updateDoc(documentoPosts, {
    likes: arrayUnion(userId),
    counter: contador,
  });
  return contador;
}

export async function removeLiked(userId, idPost, counter) {
  const documentoPosts = doc(db, 'posts', idPost);
  const contador = counter - 1;
  // Atomically remove a usuario from the "likes" array field.
  await updateDoc(documentoPosts, {
    likes: arrayRemove(userId),
    counter: contador,
  });
  return contador;
}
