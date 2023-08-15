import { showError } from '../src/utils/showError';

describe('showError', () => {
  it('debe establecer el mensaje de error y la clase', () => {
    // Configuración previa a la prueba
    const errorContainer = document.createElement('div');
    errorContainer.id = 'error-container';
    document.body.appendChild(errorContainer);

    const errorMessage = 'Este es un mensaje de error.';
    const errorClass = 'error-class';

    // Llama a la función
    showError(errorMessage, errorClass);

    // Verifica que el contenido y la clase se hayan configurado correctamente
    expect(errorContainer.innerHTML).toBe(errorMessage);
    expect(errorContainer.className).toBe(errorClass);
  });
});
