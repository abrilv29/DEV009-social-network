import {
  ref, uploadBytes, getDownloadURL, getStorage,
} from 'firebase/storage';
// cargar imagenes

const storage = getStorage();

export const uploadImg = (name, file) => {
  const fileName = `${name}`;
  const storageRef = ref(storage, fileName);
  return uploadBytes(storageRef, file);
};

// Obteniendo la url de la imagen desde la base de datos
export const getUrl = (name) => {
  const storageRef = ref(storage, name);
  return getDownloadURL(storageRef);
};
