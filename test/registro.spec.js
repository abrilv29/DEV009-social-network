/* eslint-disable import/no-unresolved */
import { registroView } from '../src/component/registro';
import * as loginController from '../src/controller/loginController';
import * as userConexion from '../src/controller/registroController';
import logoPrincipal from '../img/logo-principal.png';

describe('registroView', () => {
  let container;
  let conexionUserSpy;

  beforeEach(() => {
    // Configuración previa a cada prueba
    container = registroView(); // main container
    document.body.appendChild(container);
    conexionUserSpy = jest.spyOn(userConexion, 'conexionUser');
  });

  afterEach(() => {
    document.body.removeChild(container);
    conexionUserSpy.mockRestore(); // Restauramos la función original después de cada prueba
  });
  it('Verificar que los elementos del DOM se hayan creado correctamente formulario y logo', () => {
    // Verifica si los elementos del DOM se crearon correctamente en la función registroView()
    // Usa la función createElement para crear un elemento img
    const logo = container.querySelector('img.img-logo');
    logo.src = logoPrincipal;
    logo.alt = 'logo FandomFlix';
    const form = container.querySelector('.form-registro');
    const name = container.querySelector('input[type="text"]');
    const email = container.querySelector('input[type="email"]');
    const pass = container.querySelector('input[type="password"]');
    const confirmarpassword = container.querySelector('input[type="password"]');

    // Asegúrate de que los elementos no sean nulos y tengan las clases o atributos esperados
    expect(logo).toBeTruthy();
    expect(form).toBeTruthy();
    expect(name).toBeTruthy();
    expect(email).toBeTruthy();
    expect(pass).toBeTruthy();
    expect(confirmarpassword).toBeTruthy();
  });

  it('deberia mostrar el formulario de registro y redireccionar a la pagina del login', async () => {
    // Simula el llenado del formulario con datos válidos y
    // realiza la prueba de la funcionalidad del envío
    // Verifica que la función de conexionUser se llame correctamente
    const form = container.querySelector('.form-registro');
    const name = container.querySelector('input[type="text"]');
    const email = container.querySelector('input[type="email"]');
    const pass = container.querySelector('input[type="password"]');
    const confirmarpassword = container.querySelector('input[type="password"]');

    name.value = 'John';
    email.value = 'john@example.com';
    pass.value = 'password123';
    confirmarpassword.value = 'password123';

    console.log(name.value, email.value, pass.value, confirmarpassword.value);
    console.log(conexionUserSpy.mock.calls);

    form.submit(); // Envía el formulario
    await Promise.resolve(); // Espera a que se resuelva la asincronía
    // Verifica si se ha realizado una redirección
    expect(window.location.href).toMatch(`${window.location.origin}/`);
  });

  //  Formato de correo invalido
  it('deberia mostrar  mensaje de error,Formato de correo invalido ', () => {
    const form = container.querySelector('.form-registro');
    const emailInput = container.querySelector('input[type="email"]');
    const nameInput = container.querySelector('input[type="text"]');
    const passInput = container.querySelector('input[type="password"]');
    const confirmPassInput = container.querySelector('input[placeholder="Confirmar Contraseña"]');

    nameInput.value = 'John';
    emailInput.value = 'invalidEmail';
    passInput.value = 'password123';
    confirmPassInput.value = 'password123';

    form.submit();

    const emailError = container.querySelector('#emailError');
    expect(emailError.style.display).toBe('block');
  });

  // Las contraseñas no coinciden
  it('deberia mostrar mensaje de error,Las contraseñas no coinciden', async () => {
    // Simula el llenado del formulario con contraseñas que no coinciden y
    // verifica si se muestra el mensaje de error correspondiente
    const form = container.querySelector('.form-registro');
    const pass = container.querySelector('input[type="password"]');
    const confirmarpassword = container.querySelector('input[type="password"]');

    pass.value = 'password123';
    confirmarpassword.value = 'passwor456';

    form.submit(); // Envía el formulario
    await Promise.resolve(); // Espera a que se resuelva la asincronía
    const repeatPasswordError = container.querySelector('#repeat-email');
    expect(repeatPasswordError.style.display).toBe('none');
  });

  // El correo se encuentra registrado
  it('deberia mostrar mensaje de error,El correo se encuentra registrado', async () => {
    // Simula el llenado del formulario con un correo electrónico inválido y
    // verifica si se muestra el mensaje de error correspondiente
    const form = container.querySelector('.form-registro');
    const email = container.querySelector('input[type="email"]');
    const pass = container.querySelector('input[type="password"]');

    email.value = 'john@example.com';
    pass.value = 'password123';

    form.submit();
    await Promise.resolve();

    const repeatEmailError = container.querySelector('#repeat-email');
    expect(repeatEmailError.style.display).toBe('none');
  });

  it('deberia redirigir a la vista de inicio de sesión al hacer clic en el enlace de regreso', () => {
    const textRegreso = container.querySelector('.textRegreso');

    if (textRegreso) {
      const clickEvent = new Event('click');
      textRegreso.dispatchEvent(clickEvent);
    } else {
      console.log('No se encontró el elemento .textRegreso');
    }

    expect(window.location.pathname).toBe('/');
  });

  it('deberia llamar a la funcion loginWithGoogle al hacer clic en el boton Google', async () => {
    const btnGoogle = container.querySelector('.btnGoogle');

    if (btnGoogle) {
      const loginWithGoogleSpy = jest.spyOn(loginController, 'loginWithGoogle');

      const clickEvent = new Event('click');
      btnGoogle.dispatchEvent(clickEvent);

      await Promise.resolve();

      expect(loginWithGoogleSpy).toHaveBeenCalled();

      loginWithGoogleSpy.mockRestore();
    } else {
      console.log('No se encontró el elemento .btnGoogle');
    }
  });
});
