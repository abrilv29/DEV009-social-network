/* eslint-disable import/no-cycle */
import { createElement } from '../utils/utils';
import {
  guardarPost, traerpost, addLiked, removeLiked,
} from '../controller/feedController';
import { logout } from '../controller/loginController.js';

// Funcion crear publicaciones
function createPost(datos, index, publicaciones) {
  const sectionPublicaciones = document.querySelector('.section_publicaciones');
  const divPublicacion = createElement('div', 'container_publicacion', sectionPublicaciones);
  const name = createElement('p', 'name_user', divPublicacion);
  name.innerHTML = datos.author;
  const textarea = createElement('textarea', 'textarea_publicacion', divPublicacion);
  textarea.setAttribute('disabled', '');
  textarea.innerHTML = datos.post;
  const sectionInteracion = createElement('section', 'like_edit_delete', divPublicacion);
  // Verficamos si el autor de la publicacion es el mismo del Local Storage
  if (datos.userId === localStorage.getItem('userId')) {
    // Bonton edit
    const botonEdit = createElement('button', 'icono_edit', sectionInteracion);
    botonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
    // Boton delete
    const botonDelete = createElement('button', 'icono_delete', sectionInteracion);
    botonDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
  }
  const iconoLike = createElement('i', 'icono_like', sectionInteracion);
  iconoLike.classList.add('fa-heart');
  if (datos.likes.includes(localStorage.getItem('userId'))) {
    iconoLike.classList.add('fa-solid');
  } else {
    iconoLike.classList.add('fa-regular');
  }

  iconoLike.setAttribute('data-id', datos.id);
  const contador = createElement('p', 'contador_like', sectionInteracion);
  // index = indice de cada publicacion en el contador
  contador.innerHTML = publicaciones[index].counter;

  // Click al icono like
  iconoLike.addEventListener('click', async (e) => {
    const postLikes = publicaciones[index].likes;
    const idPost = e.target.dataset.id;

    if (postLikes.includes(localStorage.getItem('userId'))) {
      const contadorLikes = await removeLiked(localStorage.getItem('userId'), idPost, datos.counter);
      contador.innerHTML = contadorLikes;
      const likesFiltrados = postLikes.filter((likes) => likes !== localStorage.getItem('userId'));
      publicaciones[index].likes = likesFiltrados;
      publicaciones[index].counter = contadorLikes;
      iconoLike.classList.add('fa-regular');
      iconoLike.classList.remove('fa-solid');
    } else {
      const contadorLikes = await addLiked(localStorage.getItem('userId'), idPost, datos.counter);
      contador.innerHTML = contadorLikes;
      publicaciones[index].likes.push(localStorage.getItem('userId'));
      publicaciones[index].counter = contadorLikes;
      iconoLike.classList.remove('fa-regular');
      iconoLike.classList.add('fa-solid');
    }
  });
}

// Funcion dibujar posts
async function dibujarPosts() {
  const documentos = await traerpost();
  // Se crea un objeto nuevo con la informacion de cada publicacion
  // (se cambia el querySnapshot por un array mas simple)
  const publicaciones = documentos.docs.map(
    (documento) => ({ id: documento.id, ...documento.data() }),
  );
  publicaciones.forEach((doc, index) => {
    createPost(doc, index, publicaciones);
  });
}

export function feedView(userDisplayName) {
  // Seccion container feed
  const sectionFeed = createElement('section', 'container_feed', '');
  // Seccion header feed
  const sectionHeader = createElement('section', 'section_header', sectionFeed);
  const divLogo = createElement('div', 'div_feed_logo', sectionHeader);
  const imagenLogo = createElement('img', 'feed_logo', divLogo);
  imagenLogo.src = '../img/logo-feed.png';

  function menuToggle() {
    const toggleMenu = document.querySelector('.info-perfil');
    toggleMenu.classList.toggle('active');
  }

  // VENTANA DEL PERFIL DE   USUARIO

  const perfil = createElement('div', 'perfil', sectionHeader);
  const divImg = createElement('div', 'div-img', perfil);
  divImg.onclick = menuToggle;

  // Supongamos que obtienes la URL de la imagen en las siguientes situaciones
  const userImageUrlNormal = '../img/perfil-usuario.jpg';
  const imagenPerfil = createElement('img', 'imagen-perfil', divImg);

  // Obtén la imagen de perfil del LocalStorage (si existe)
  const userImageUrlGoogle = localStorage.getItem('userImage');
  if (userImageUrlGoogle) {
    imagenPerfil.src = userImageUrlGoogle;
  } else {
    imagenPerfil.src = userImageUrlNormal;
  }

  const infoPerfil = createElement('div', 'info-perfil', perfil);

  const nameGoogle = createElement('div', 'name_google', infoPerfil);
  nameGoogle.textContent = localStorage.getItem('userDisplayName');

  const emailGoogle = createElement('div', 'email_google', infoPerfil);
  emailGoogle.textContent = localStorage.getItem('userGmail');

  const cerrarSesion = createElement('div', 'cerrar_sesion', infoPerfil);
  cerrarSesion.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesion';

  // Agregar evento click al botón 'cerrarSesion'
  cerrarSesion.addEventListener('click', async () => {
    await logout(); // Llama a la función logout() para cerrar la sesión
    console.log('Botón de cerrar sesión clickeado');
    localStorage.clear();
    window.location.href = `${window.location.origin}/`;
  });

  // Seccion publicar post
  const sectionPost = createElement('section', 'section_post', sectionFeed);
  // Seccion mensaje de bienvenida
  const mensajeBienvenida = createElement('h2', 'mensaje_bienvenida', sectionPost);
  mensajeBienvenida.innerHTML = `Bienvenid@ ${userDisplayName}`;

  const divPost = createElement('div', 'post', sectionPost);
  const divInput = createElement('div', 'section_text', divPost);
  const inputPublicacion = createElement('input', 'feed_new_post', divInput);
  inputPublicacion.setAttribute('type', 'text');
  inputPublicacion.setAttribute('required', '');
  inputPublicacion.setAttribute('placeholder', 'Escribe algo...');
  const button = createElement('button', 'boton_camara', divInput);
  button.innerHTML = '<i class="fa-solid fa-camera"></i>';
  const divButtons = createElement('div', 'section_button', divPost);
  const buttonPublicar = createElement('button', 'button_publicar', divButtons);
  buttonPublicar.textContent = 'Publicar';
  buttonPublicar.setAttribute('type', 'button');

  createElement('section', 'section_publicaciones', sectionFeed);
  dibujarPosts();

  // Publicar post
  buttonPublicar.addEventListener('click', async () => {
    const valuePublicacion = inputPublicacion.value;
    if (valuePublicacion.trim().length === 0) {
      alert('Los campos no pueden estar vacíos');
    } else {
      const userDisplay = userDisplayName; // Utiliza el parámetro que se pasa a la función
      const userId = localStorage.getItem('userId');
      // Se crea un objeto nuevo con la informacion de cada publicacion
      const datos = {
        author: userDisplay,
        userId,
        created_date: new Date(),
        post: valuePublicacion,
        likes: [],
        counter: 0,
      };
      inputPublicacion.value = '';
      await guardarPost(datos);

      const sectionPublicaciones = document.querySelector('.section_publicaciones');
      sectionPublicaciones.innerHTML = '';
      dibujarPosts();
    }
  });
  return sectionFeed;
}
