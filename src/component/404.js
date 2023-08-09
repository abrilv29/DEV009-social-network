export function errorView() {
  const titulo = document.createElement('h2');
  titulo.classList.add('error');
  titulo.textContent = 'Page no found ';
  return titulo;
}
