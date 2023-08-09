import { createElement } from '../utils/utils';
import {
  guardarPost, traerpost, addLiked, removeLiked,
} from '../controller/feedController';

/* ----------------Formulario para hacer la publicacion -----------------------*/
export function feedView(userDisplayName) {
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
  // Seccion para cerrar la sesion
  const ventanaIcono = createElement('div', 'ventana_oculta', divIcono); // Agrega la clase 'ventana_oculta' para que esté oculto inicialmente
  ventanaIcono.id = 'ventana_icono';
  const cerrarSesion = createElement('div', 'cerrar_sesion', ventanaIcono);
  cerrarSesion.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Cerrar Sesion';

  // Seccion publicar post
  const sectionPost = createElement('section', 'section_post', sectionFeed);
  // mensaje de bienvenida
  const mensajeBienvenida = createElement('h2', 'mensaje_bienvenida', sectionPost);
  mensajeBienvenida.innerHTML = `Bienvenid@ ${userDisplayName}`;
  console.log('Nombre de usuario en feedView:', userDisplayName);

  // Seccion publicaciones
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

  // Cerrar la sesion del usuario
  // Agregar evento click al divIcono
  iconoPerfil.addEventListener('click', () => {
    if (ventanaIcono) {
      ventanaIcono.style.display = ventanaIcono.style.display === 'none' ? 'block' : 'none';
    }
  });

  // Agregar evento click al botón 'cerrarSesion'
  cerrarSesion.addEventListener('click', () => {
    window.history.pushState({}, '', `${window.location.origin}/`);
    window.dispatchEvent(new PopStateEvent('popstate'));
    window.location.reload();
  });

  // Publicar post
  buttonPublicar.addEventListener('click', async () => {
    const valuePublicacion = inputPublicacion.value;
    if (valuePublicacion.trim().length === 0) {
      alert('Los campos no pueden estar vacíos');
    } else {
      const userDisplay = userDisplayName; // Utiliza el parámetro que se pasa a la función
      const userId = localStorage.getItem('userId');

      if (!userDisplay || !userId) {
        console.log('No se han obtenido los datos del usuario correctamente.');
        return;
      }
      const datos = {
        author: userDisplay,
        userId,
        created_date: new Date(),
        post: valuePublicacion,
        likes: [],
      };
      inputPublicacion.value = '';
      await guardarPost(datos);

      const sectionPublicaciones = document.querySelector('.section_publicaciones');
      sectionPublicaciones.innerHTML = '';
      dibujarPosts();
    }
  });

  /* ----------------------------Seccion para crear el nuevo post -------------------------------*/
  // Funcion crear publicaciones
  function createPost(datos, index, publicaciones) {
    const sectionPublicaciones = document.querySelector('.section_publicaciones');
    const divPublicacion = createElement('div', 'container_publicacion', sectionPublicaciones);
    const name = createElement('p', 'name_user', divPublicacion);
    name.innerHTML = datos.author;
    const textarea = createElement('textarea', 'textarea_publicacion', divPublicacion);
    textarea.setAttribute('disabled', '');
    textarea.innerHTML = datos.post;
    // seccion para los botones edit,delete, like de las publicaciones
    const sectionInteracion = createElement('section', 'like_edit_delete', divPublicacion);

    const btnEdit = createElement('button', 'icono_edit', sectionInteracion);
    btnEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';

    const btnDelete = createElement('button', 'icono_delete', sectionInteracion);
    btnDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    const botonLike = createElement('button', 'icono_like', sectionInteracion);
    botonLike.innerHTML = '<i class="fa-regular fa-heart"></i>';
    botonLike.setAttribute('data-id', datos.id);
    // contador del boton  like
    const contador = createElement('p', 'contador_like', sectionInteracion);
    // index = indice de cada publicacion en el array de likes
    contador.innerHTML = publicaciones[index].likes.length;

    // Click al boton like
    botonLike.addEventListener('click', async (e) => {
      botonLike.querySelector('i').classList.remove('fa-regular');
      botonLike.querySelector('i').classList.add('fa-solid');

      const postLikes = publicaciones[index].likes;
      const idPost = e.target.dataset.id;
      if (postLikes.includes(localStorage.getItem('userId'))) {
        await removeLiked(localStorage.getItem('userId'), idPost);
        contador.innerHTML = postLikes.length - 1;
        const indexLike = postLikes.indexOf(localStorage.getItem('userId'));
        const spliceLikes = postLikes.slice(indexLike, indexLike);
        publicaciones[index].likes = spliceLikes;
      } else {
        await addLiked(localStorage.getItem('userId'), idPost);
        contador.innerHTML = postLikes.length + 1;
        publicaciones[index].likes.push(localStorage.getItem('userId'));
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
  return sectionFeed;
}
