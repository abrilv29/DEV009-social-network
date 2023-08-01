import { createElement } from '../utils/utils';

export function feedView() {
  // Seccion container feed
  const sectionFeed = createElement('section', 'container_feed', '');
  // Seccion header feed
  const sectionHeader = createElement('section', 'section_header', sectionFeed);
  const divLogo = createElement('div', 'div_feed_logo', sectionHeader);
  const imagenLogo = createElement('img', 'feed_logo', divLogo);
  imagenLogo.src = '../img/logo-feed.png';
  const divIcono = createElement('div', 'div_icono', sectionHeader);
  const iconoPerfil = createElement('button', 'icono_perfil', divIcono);
  iconoPerfil.innerHTML = '<i class="fa-solid fa-user" style="color: #ffffff;"></i>';

  // Seccion publicar post
  const sectionPost = createElement('section', 'section_post', sectionFeed);
  const mensajeBienvenida = createElement('h2', 'mensaje_bienvenida', sectionPost);
  mensajeBienvenida.innerHTML = 'Bienvenid@ Pepito Perez';
  const divPost = createElement('div', 'post', sectionPost);
  const divInput = createElement('div', 'section_text', divPost);
  const input = createElement('input', 'feed_new_post', divInput);
  input.setAttribute('type', 'text');
  input.setAttribute('placeholder', 'Escribe algo...');
  const button = createElement('button', 'boton_camara', divInput);
  button.innerHTML = '<i class="fa-solid fa-camera"></i>';
  const divButtons = createElement('div', 'section_buttons', divPost);
  const buttonPublicar = createElement('button', 'button_publicar', divButtons);
  buttonPublicar.textContent = 'Publicar';

  // Seccion publicaciones
  const sectionPublicaciones = createElement('section', 'section_publicaciones', sectionFeed);
  const divPublicacion = createElement('div', 'container_publicacion', sectionPublicaciones);
  const name = createElement('p', 'name_user', divPublicacion);
  name.innerHTML = 'Pepito Perez';
  const textarea = createElement('textarea', 'textarea_publicacion', divPublicacion);
  textarea.setAttribute('disabled', '');
  textarea.innerHTML = 'Acabo de ver x/y película y me encantó';
  const sectionInteracion = createElement('section', 'like_edit_delete', divPublicacion);
  const edit = createElement('button', 'icono_edit', sectionInteracion);
  edit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
  const iconoDelete = createElement('button', 'icono_delete', sectionInteracion);
  iconoDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  const like = createElement('button', 'icono_like', sectionInteracion);
  like.innerHTML = '<i class="fa-regular fa-heart"></i>';
  const contador = createElement('label', 'contador_like', sectionInteracion);
  contador.innerHTML = '0';

  return sectionFeed;
}
