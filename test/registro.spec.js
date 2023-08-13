/* eslint-disable max-len */
import { registroView } from '../src/component/registro';
// import { conexionUser } from "../src/controller/registroController";

describe('registroView', () => {
  let container;

  beforeEach(() => {
    // Configuración previa a cada prueba
    container = registroView();
    document.body.appendChild(container);
  });

  afterEach(() => {
    // Limpiar el DOM después de cada prueba
    document.body.removeChild(container);
  });
  it('renders a container with logo and form', () => {
    // Aquí puedes realizar comprobaciones sobre la estructura y contenido del DOM generado por registroView()
    // Por ejemplo, verifica si el logo, el formulario y los elementos del formulario se crearon correctamente.
  });

  it('form submission with matching passwords', () => {
    // Simula el llenado del formulario con datos válidos y realiza la prueba de la funcionalidad del envío
    // Verifica que la función de conexión de usuario se llame correctamente
  });

  it('form submission with mismatching passwords', () => {
    // Simula el llenado del formulario con contraseñas que no coinciden y verifica si se muestra el mensaje de error correspondiente
  });

  it('form submission with invalid email', () => {
    // Simula el llenado del formulario con un correo electrónico inválido y verifica si se muestra el mensaje de error correspondiente
  });

  it('clicking return to login navigates to login page', () => {
    // Simula el clic en el enlace de regreso al inicio de sesión y verifica si se redirecciona correctamente
  });

  it('clicking Google button triggers loginWithGoogle', () => {
    // Simula el clic en el botón de Google y verifica si la función loginWithGoogle se llamó correctamente
  });
});
