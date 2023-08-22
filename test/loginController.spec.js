import {
  getAuth, signInWithEmailAndPassword,
} from 'firebase/auth';
import { loginUser } from '../src/controller/loginController.js';

// Configurar un mock para getAuth y signInWithEmailAndPassword
jest.mock('firebase/auth');
getAuth.mockReturnValue({
  signInWithEmailAndPassword: jest.fn(),
});

describe('loginUser', () => {
  it('debería iniciar sesión con el email y contraseña proporcionados', async () => {
    const email = 'test@example.com';
    const password = 'testpassword';
    const displayName = 'Usuario de Prueba';

    // Configurar el mock para signInWithEmailAndPassword
    signInWithEmailAndPassword.mockResolvedValue({
      user: {
        displayName,
        email,
        uid: 'userID',
        accessToken: 'accessToken',
      },
    });

    // Llamar a la función loginUser
    const result = await loginUser(email, password);

    // Verificar que signInWithEmailAndPassword haya sido llamada con los datos correctos
    expect(signInWithEmailAndPassword).toHaveBeenCalledWith(getAuth(), email, password);

    // Verificar que la función devuelva el nombre de usuario
    expect(result).toBe(displayName);
  });

  it('debería lanzar un error si falla el inicio de sesión', async () => {
    // Configurar el mock para signInWithEmailAndPassword que simula un error
    signInWithEmailAndPassword.mockRejectedValue(new Error('Error de inicio de sesión'));

    // Llamar a la función loginUser y verificar si lanza un error
    await expect(loginUser('test@example.com', 'testpassword')).rejects.toThrowError('Error de inicio de sesión');
  });
});
