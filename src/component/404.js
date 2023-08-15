export function errorView() {
  const titulo = document.createElement('h2');
  titulo.textContent = 'Página no encontrada';
  titulo.classList.add('error');
  return titulo;
}
