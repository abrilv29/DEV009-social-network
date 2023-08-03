/* eslint-disable no-use-before-define */
import { createElement } from '../utils/utils';
import { guardarPost, traerpost } from '../controller/feedController';

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
  const mensajeBienvenidaElement = createElement('h2', 'mensaje_bienvenida', sectionPost);
  mensajeBienvenidaElement.innerHTML = 'Bienvenid@ ';
  mensajeBienvenidaElement.setAttribute('id', 'mensaje_bienvenida');
  mensajeBienvenidaElement.setAttribute('style', 'color: #ffffff;');

  const divPost = createElement('div', 'post', sectionPost);
  const divInput = createElement('div', 'section_text', divPost);
  const inputPublicacion = createElement('input', 'feed_new_post', divInput);
  inputPublicacion.setAttribute('type', 'text');
  inputPublicacion.setAttribute('placeholder', 'Escribe algo...');
  const button = createElement('button', 'boton_camara', divInput);
  button.innerHTML = '<i class="fa-solid fa-camera"></i>';
  const divButtons = createElement('div', 'section_button', divPost);
  const buttonPublicar = createElement('button', 'button_publicar', divButtons);
  buttonPublicar.textContent = 'Publicar';
  buttonPublicar.setAttribute('type', 'button');
  // buttonPublicar.setAttribute('id', 'boton_publicar');

  const sectionPublic = createElement('section', 'section_publicaciones', sectionFeed);
  sectionPublic.setAttribute('id', 'section_publicaciones');

  buttonPublicar.addEventListener('click', async () => {
    const valuePublicacion = inputPublicacion.value;

    if (valuePublicacion.length === 0) {
      alert('Los campos no pueden estar vacios');
    } else {
      const datos = {
        created_date: new Date(),
        post: valuePublicacion,
      };
      inputPublicacion.value = '';
      await guardarPost(datos);

      // Limpia el contenido de las publicaciones existentes
      const sectionPublicaciones = document.querySelector('.section_publicaciones');
      sectionPublicaciones.innerHTML = '';

    // Luego obtenemos los nuevos posts de todos los usuarios
    const nuevosPosts = await traerpost();

    // Y finalmente dibujamos todos los posts actualizados
    dibujarPosts(nuevosPosts);
    }
  }); // btnPublicar

  return sectionFeed;
}

// ...

// Funcion dibujar posts
function dibujarPosts(posts) {
  const sectionPublicaciones = document.querySelector('.section_publicaciones');
  if (!sectionPublicaciones) {
    // Si el elemento con la clase 'section_publicaciones' no existe, salimos de la función.
    return;
  }

  sectionPublicaciones.innerHTML = ''; // Limpiamos el contenido actual

  posts.forEach((datos) => {
    const divPublicacion = createElement('div', 'container_publicacion', sectionPublicaciones);
    const name = createElement('p', 'name_user', divPublicacion);
    // Obtener el nombre de usuario del localStorage
    // const userName = localStorage.getItem('userName');
    // Mostrar el nombre de usuario en el elemento 'name'
    name.textContent = datos.author ? `Publicado por: ${datos.author}` : 'Autor Desconocido';
    const textarea = createElement('textarea', 'textarea_publicacion', divPublicacion);
    textarea.setAttribute('disabled', '');
    // Verificar si el campo 'post' existe en la propiedad 'datos'
    if (datos.datos && datos.datos.datos) {
      textarea.value = datos.datos.datos; // Usar 'value' en lugar de 'innerHTML'
    } else if (datos.datos && datos.datos.post) {
      textarea.value = datos.datos.post; // Usar 'value' en lugar de 'innerHTML'
    } else {
      textarea.value = 'Contenido no encontrado'; // En caso de que no se encuentre el campo 'post'
    }
    const sectionInteracion = createElement('section', 'like_edit_delete', divPublicacion);
    const btnedit = createElement('button', 'icono_edit', sectionInteracion);
    btnedit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    const iconoDelete = createElement('button', 'icono_delete', sectionInteracion);
    iconoDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    const like = createElement('button', 'icono_like', sectionInteracion);
    like.innerHTML = '<i class="fa-regular fa-heart"></i>';
    const contador = createElement('label', 'contador_like', sectionInteracion);
    contador.innerHTML = '0';
  });
}

// ...

window.addEventListener('DOMContentLoaded', () => {
  const mensajeBienvenida = document.getElementById('mensaje_bienvenida');
  const userName = localStorage.getItem('userName');
  if (mensajeBienvenida) {
    mensajeBienvenida.textContent = `¡Bienvenido, ${userName}!`;
  }
  traerpost(dibujarPosts);
});
