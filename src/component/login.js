import { createElement } from '../utils/utils';
import { loginUser, loginWithGoogle } from '../controller/loginController.js';

export function loginView() {
  const content = document.createElement('main');
  content.classList.add('mimain');

  // Crear el elemento <section> con la clase "section-img"
  const sectionImgElement = createElement('section', 'section-img', content);

  // Crear el elemento <img> y configurar sus atributos src y alt
  const imgElement = createElement('img', 'img-logo1', sectionImgElement);
  imgElement.src = 'img/logo-principal.png';
  imgElement.alt = 'logo FandomFlix';

  // Crear el elemento <form> con el identificador "formRegistro1"
  const formElement = createElement('form', '', content);
  formElement.id = 'formRegistro1';

  // crear un titulo a mi form
  const title = createElement('p', 'title1', formElement);
  title.innerHTML = 'Signin';

  // input text email
  const emailDiv = createElement('div', 'input-iconos', formElement);
  const emailIcono = createElement('p', 'estilos-icono', emailDiv);
  emailIcono.innerHTML = '<i class="fa-solid fa-envelope"></i>';
  const emailText = createElement('input', 'estilos-input', emailDiv);
  emailText.setAttribute('type', 'email');
  emailText.setAttribute('name', 'email');
  emailText.setAttribute('required', ''); // campo es obligatorio
  emailText.placeholder = 'Correo Electronico';

  // input text password
  const passDiv = createElement('div', 'input-iconos', formElement);
  const passIcono = createElement('p', 'estilos-icono', passDiv);
  passIcono.innerHTML = '<i class="fa-solid fa-lock"></i>';
  const passText = createElement('input', 'estilos-input', passDiv);
  passText.setAttribute('type', 'password');
  passText.setAttribute('name', 'password');
  passText.setAttribute('required', ''); // campo es obligatorio
  passText.placeholder = 'Contraseña';

  // boton de iniciar sesion
  const btnLogin = createElement('button', 'btnLogin', formElement);
  btnLogin.setAttribute('type', 'submit');
  btnLogin.innerHTML = 'Iniciar Seción <i class="fa-solid fa-right-to-bracket"></i>';

  // recuperar contraseña
  const mensajeOlvidasteContraseña = createElement('p', 'mensajeOlvidasteContraseña', formElement);
  mensajeOlvidasteContraseña.textContent = '¿Olvidaste tu contraseña?';

  const recuperala = createElement('a', 'recuperala', mensajeOlvidasteContraseña);
  recuperala.textContent = 'Recupérala';

  // seccion del boton de registro cuenta de Google
  const btnGoogle = createElement('button', 'btnGoogle', formElement);
  btnGoogle.id = 'btnGoogle';
  btnGoogle.innerHTML = '<img src="/img/google.png" alt="cuenta gmail">Google';
  const welcomeMessageElement = createElement('div', '', formElement);
  welcomeMessageElement.id = 'welcomeMessage';

  // navegacion a la pagina de registro
  const mensajeNoTienesCuenta = createElement('p', 'mensajeNoTienesCuenta', formElement);
  mensajeNoTienesCuenta.textContent = 'Si no tienes cuenta';

  const registrate = createElement('span', 'Registrate', mensajeNoTienesCuenta);
  registrate.textContent = 'Registrate';

  /* -------------------------------Navegacion vista registro--------------------------------- */
  registrate.addEventListener('click', () => {
    window.history.pushState({}, '', `${window.location.origin}/registro`);
    /* ----- Dispara manualmente el evento popstate para actualizar la ruta ----- */
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.location.reload();
  });
  /* -------------------------------Login Formulario--------------------------------- */
  formElement.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailText.value;
    const password = passText.value;

    try {
      const user = await loginUser(email, password);
      localStorage.setItem('userDisplayName', user); // Almacenar el nombre de usuario en el LocalStorage
      window.location.href = `${window.location.origin}/feed`; // Redireccionar a la página del feed;
    } catch (error) {
      console.log(error);
      // Manejo de errores
    }
  });

  /** ---------------------Google------------------------------- */
  // Aquí modificamos el evento click del botón btnGoogle
  btnGoogle.addEventListener('click', () => {
    loginWithGoogle();
  });
  return content;
}// loginView
