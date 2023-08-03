import { createElement } from '../utils/utils';
import { guardarPost, traerpost } from '../controller/feedController';

// Funcion crear publicaciones
function createPost(datos) {
  // Seccion publicaciones
  // const sectionFeed = document.querySelector('.container_feed');
  // const sectionPublicaciones = createElement('section', 'section_publicaciones', sectionFeed);
  const sectionPublicaciones = document.querySelector('.section_publicaciones');
  const divPublicacion = createElement('div', 'container_publicacion', sectionPublicaciones);
  const name = createElement('p', 'name_user', divPublicacion);
  name.innerHTML = 'Pepito Perez';
  const textarea = createElement('textarea', 'textarea_publicacion', divPublicacion);
  textarea.setAttribute('disabled', '');
  textarea.innerHTML = datos.post;
  const sectionInteracion = createElement('section', 'like_edit_delete', divPublicacion);
  const edit = createElement('button', 'icono_edit', sectionInteracion);
  edit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
  const iconoDelete = createElement('button', 'icono_delete', sectionInteracion);
  iconoDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  const like = createElement('button', 'icono_like', sectionInteracion);
  like.innerHTML = '<i class="fa-regular fa-heart"></i>';
  const contador = createElement('label', 'contador_like', sectionInteracion);
  contador.innerHTML = '0';
}

// Funcion dibujar posts
async function dibujarPosts() {
  const documentos = await traerpost();

  documentos.forEach((doc) => {
    console.log(doc.data());
    createPost(doc.data());
  });
}

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
  iconoPerfil.innerHTML = '<i class="fa-solid fa-user" style="color: #FBD3E9;"></i>';

  // Seccion publicar post
  const sectionPost = createElement('section', 'section_post', sectionFeed);
  const mensajeBienvenida = createElement('h2', 'mensaje_bienvenida', sectionPost);
  mensajeBienvenida.innerHTML = 'Bienvenid@ Pepito Perez';
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

  createElement('section', 'section_publicaciones', sectionFeed);
  dibujarPosts();

  // Publicar post
  buttonPublicar.addEventListener('click', async () => {
    const valuePublicacion = inputPublicacion.value;
    if (valuePublicacion.length === 0) {
      alert('Los campos no pueden estar vacios');
    } else {
      const datos = {
        // user: "Pepito",
        // last: "Perez",
        created_date: new Date(),
        // edited_date: "",
        post: valuePublicacion,
        // likes: "",
      };
      inputPublicacion.value = '';
      await guardarPost(datos);

      const sectionPublicaciones = document.querySelector('.section_publicaciones');
      sectionPublicaciones.innerHTML = '';
      // createPost(datos);
      // traerpost();
      dibujarPosts();
    }
  });
  return sectionFeed;
}