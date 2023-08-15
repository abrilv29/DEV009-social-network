import { getFirestore, collection, addDoc } from 'firebase/firestore';// Asegúrese de importar correctamente
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import * as userConexion from '../src/controller/registroController'; // Ajuste la ruta según su estructura
import { showError } from '../src/utils/showError';

// Mockear getFirestore
jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  addDoc: jest.fn(),
  getFirestore: jest.fn(),
}));
jest.mock('firebase/auth', () => ({
  getAuth: jest.fn(),
  createUserWithEmailAndPassword: jest.fn(),
  updateProfile: jest.fn(),
}));
jest.mock('../src/utils/showError', () => ({
  showError: jest.fn(),
}));

describe('addUser', () => {
  // Reinicie los mocks antes de cada prueba
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // funcion addUser
  it('deberia agregar un nuevo usuario a la coleccion userRegistre', async () => {
    // userRegistre mocks
    const mockColletion = jest.fn();
    const mockAddDoc = jest.fn();
    getFirestore.mockReturnValue(mockColletion);
    collection.mockReturnValue(mockColletion);
    addDoc.mockReturnValue(mockAddDoc);

    // Llamada a addUser
    await userConexion.addUser('John Doe', 'johndoe@example.com');
    // Verifica que las funciones hayan sido llamadas con los argumentos correctos
    expect(collection).toHaveBeenCalledWith(userConexion.mockColletion, 'userRegistre');
    expect(addDoc).toHaveBeenCalledWith(mockColletion, {
      name: 'John Doe',
      email: 'johndoe@example.com',
    });
  });
});
// test de createUserWithEmailAndPassword

describe('conexionUser', () => {
  beforeEach(() => {
    const errorContainer = document.createElement('div');
    errorContainer.id = 'error-container';
    document.body.appendChild(errorContainer);
  });

  it('deberia registrar al usuario y redireccionar a la pagina de login', async () => {
    // configurar mocks
    const mockAuth = { createUserWithEmailAndPassword: jest.fn() };
    const mockUserCredencial = {
      user: {
        updateProfile: jest.fn(),
      },
    };

    const mockUpdate = jest.fn();

    getAuth.mockReturnValue(mockAuth);
    createUserWithEmailAndPassword.mockReturnValue(mockUserCredencial);
    mockUserCredencial.user.updateProfile.mockReturnValue(mockUpdate);

    await userConexion.conexionUser('John', 'john@example.com', 'password123');

    // Obtener el usuario y el nombre
    // const user = mockUserCredencial.user;
    // const userName = 'John'; // Aquí debes proporcionar el nombre que esperas

    // Llamada a la función updateProfile
    //  await updateProfile(user, { displayName: userName });

    expect(getAuth).toHaveBeenCalledWith();
    expect(createUserWithEmailAndPassword).toHaveBeenCalledWith(mockAuth, 'john@example.com', 'password123');
    // expect(mockUpdate).toHaveBeenCalledWith({ displayName: 'John' });
    // redireccionamento al login
    expect(window.location.href).toBe(`${window.location.origin}/`);
  }); //
  it('debería mostrar mensaje el correo se encuentra registrado', async () => {
    const mockAuth = { createUserWithEmailAndPassword: jest.fn() };
    getAuth.mockReturnValue(mockAuth);
    createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/email-already-in-use' });

    // Llama a la función conexionUser mostrar mensajes el correo se encuentra registrado
    await userConexion.conexionUser('John Doe', 'johndoe@example.com', 'password');

    // Verifica que la función de mostrar error haya sido llamada con el mensaje correcto
    expect(showError).toHaveBeenCalledWith('El correo se encuentra registrado', 'repeat-email');
  }); //
  it('debería mostrar mensaje de error, si no coloca 6 caracteres en la contraña', async () => {
    const mockAuth = { createUserWithEmailAndPassword: jest.fn() };
    getAuth.mockReturnValue(mockAuth);
    createUserWithEmailAndPassword.mockRejectedValue({ code: 'auth/weak-password' });

    // Llama a la función conexionUser con contraseña débil para provocar un error
    await userConexion.conexionUser('John Doe', 'johndoe@example.com', 'password');

    // Verifica que la función de mostrar error haya sido llamada con el mensaje correcto
    expect(showError).toHaveBeenCalledWith('La contraseña debe contener al menos 6 caracteres', '6-letters');
  }); //
  it('debería mostrar mensaje de error para contraseña débil', async () => {
    const mockAuth = { createUserWithEmailAndPassword: jest.fn() };
    getAuth.mockReturnValue(mockAuth);

    // Simula un error débil de contraseña
    const weakPasswordError = new Error();
    weakPasswordError.code = 'auth/weak-password';
    createUserWithEmailAndPassword.mockRejectedValue(weakPasswordError);

    // Llama a la función conexionUser con contraseña débil para provocar un error
    await userConexion.conexionUser('John Doe', 'johndoe@example.com', 'password');

    // Verifica que la función de mostrar error haya sido llamada con el mensaje correcto
    expect(showError).toHaveBeenCalledWith('La contraseña debe contener al menos 6 caracteres', '6-letters');
  });
  it('debería mostrar mensaje de error genérico para otros errores', async () => {
    const mockAuth = { createUserWithEmailAndPassword: jest.fn() };
    getAuth.mockReturnValue(mockAuth);

    // Simula un error genérico
    const genericError = new Error();
    createUserWithEmailAndPassword.mockRejectedValue(genericError);

    // Llama a la función conexionUser para provocar un error
    await userConexion.conexionUser('John Doe', 'johndoe@example.com', 'password');

    // Verifica que la función de mostrar error haya sido llamada con el mensaje correcto
    expect(showError).toHaveBeenCalledWith('Correo o contraseña inválidos', '7-letters');
  });
});// test de createUserWithEmail
