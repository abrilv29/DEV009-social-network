import {
  collection,
  getFirestore,
  addDoc,
  query,
  orderBy,
  getDocs,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from 'firebase/firestore';
import * as feedController from '../src/controller/feedController';

// Mockea los valores por funciones vacias
jest.mock('firebase/firestore', () => ({
  collection: jest.fn().mockReturnValue({}),
  getFirestore: jest.fn().mockReturnValue({}),
  addDoc: jest.fn((_collection, datos) => (datos)),
  query: jest.fn().mockReturnValue({}),
  orderBy: jest.fn().mockReturnValue('created_date'),
  getDocs: jest.fn().mockReturnValue({}),
  doc: jest.fn().mockReturnValue({}),
  updateDoc: jest.fn().mockReturnValue({}),
  arrayUnion: jest.fn().mockReturnValue([1234]),
  arrayRemove: jest.fn().mockReturnValue([]),
}));

describe('guardarPost', () => {
  // Reinicie los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debería guardar un documento a la coleccion posts', async () => {
    const datos = {
      author: 'Manuela',
      userId: '1234',
      created_date: '14 agosto 2023',
      post: 'Hola',
      likes: '[1234]',
      counter: 0,
    };
    const document = await feedController.guardarPost(datos);
    expect(collection).toHaveBeenCalledWith(getFirestore(), 'posts');
    expect(addDoc).toHaveBeenCalledWith({}, datos);
    expect(document).toBe(datos);
  });
  it('deberia generar un error al guardar un documento a la coleccion posts', async () => {
    addDoc.mockImplementation(() => { throw new Error('¡No se guardo el documento!'); });
    const document = await feedController.guardarPost();
    expect(document).toBe(null);
  });
});

describe('traerPost', () => {
  // Reinicie los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('Debería traer todos los documentos de la coleccion posts', async () => {
    const datos = [
      {
        author: 'Fiorella',
        userId: '123456',
        created_date: '15 agosto 2023',
        post: 'Hola2',
        likes: '[123456]',
        counter: 0,
      },
      {
        author: 'Manuela',
        userId: '1234',
        created_date: '14 agosto 2023',
        post: 'Hola',
        likes: '[1234]',
        counter: 0,
      },
    ];
    getDocs.mockImplementation(() => datos);
    const documents = await feedController.traerPost();
    expect(collection).toHaveBeenCalledWith(getFirestore(), 'posts');
    expect(orderBy).toHaveBeenCalledWith('created_date', 'desc');
    expect(query).toHaveBeenCalledWith({}, 'created_date');
    expect(documents).toBe(datos);
  });
});

describe('addLiked', () => {
  // Reinicie los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Deberia agregar el userId al array likes y sumar el contador', async () => {
    const userId = '1234';
    const idPost = '0SUGLXfz';
    const counter = 1;
    const documentoPost = {
      author: 'Manuela',
      userId: '1234',
      created_date: '14 agosto 2023',
      post: 'Hola',
      likes: [1234],
      counter: 1,
    };
    doc.mockImplementation(() => documentoPost);
    const contador = await feedController.addLiked(userId, idPost, counter);
    expect(updateDoc).toHaveBeenCalledWith(documentoPost, { counter: contador, likes: [1234] });
    expect(arrayUnion).toHaveBeenCalledWith(userId);
    expect(contador).toBe(counter + 1);
  });
});

describe('removeLiked', () => {
  // Reinicie los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Deberia remover el userId al array likes y sumar el contador', async () => {
    const userId = '1234';
    const idPost = '0SUGLXfz';
    const counter = 1;
    const documentoPost = {
      author: 'Manuela',
      userId: '1234',
      created_date: '14 agosto 2023',
      post: 'Hola',
      likes: [1234],
      counter: 1,
    };
    doc.mockImplementation(() => documentoPost);
    const contador = await feedController.removeLiked(userId, idPost, counter);
    expect(updateDoc).toHaveBeenCalledWith(documentoPost, { counter: contador, likes: [] });
    expect(arrayRemove).toHaveBeenCalledWith(userId);
    expect(contador).toBe(counter - 1);
  });
});
