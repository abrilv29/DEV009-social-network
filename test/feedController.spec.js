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
  deleteDoc,
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
  deleteDoc: jest.fn().mockReturnValue({}),

}));

describe('guardarPost', () => {
  // Reinicia los mocks antes de cada prueba
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
        created_date: '16 agosto 2023',
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
      created_date: '17 agosto 2023',
      post: 'Hola',
      likes: [1234],
      counter: 1,
    };
    doc.mockImplementationOnce(() => documentoPost);
    const contador = await feedController.addLiked(userId, idPost, counter);
    expect(updateDoc).toHaveBeenCalledWith(documentoPost, { counter: contador, likes: [1234] });
    expect(arrayUnion).toHaveBeenCalledWith(userId);
    expect(contador).toBe(counter + 1);
  });
});

describe('removeLiked', () => {
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
      created_date: '18 agosto 2023',
      post: 'Hola',
      likes: [1234],
      counter: 1,
    };
    doc.mockImplementationOnce(() => documentoPost);
    const contador = await feedController.removeLiked(userId, idPost, counter);
    expect(updateDoc).toHaveBeenCalledWith(documentoPost, { counter: contador, likes: [] });
    expect(arrayRemove).toHaveBeenCalledWith(userId);
    expect(contador).toBe(counter - 1);
  });
});

describe('deletePost', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it('Deberia borrar un documento de la coleccion posts', async () => {
    const idPost = '0SUGLXfz';
    await feedController.deletePost(idPost);
    expect(doc).toHaveBeenCalledWith({}, 'posts', idPost);
    expect(deleteDoc).toHaveBeenCalledWith({});
  });
  it('deberia generar un error al borrar un documento de la coleccion posts', async () => {
    deleteDoc.mockImplementation(() => { throw new Error('¡No se borro el documento!'); });
    await feedController.deletePost();
  });
});
