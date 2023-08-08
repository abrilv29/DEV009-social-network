import { createElement } from '../utils/utils';
import {
  guardarPost, traerpost, addLiked, removeLiked,
} from '../controller/feedController';

// estas dos lineaas no irian ya seria desde el login guardar el uerId y el name
localStorage.setItem('userName', 'Juanito');
localStorage.setItem('userId', '12345');

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
  const botonLike = createElement('i', 'icono_like', sectionInteracion);
  botonLike.classList.add('fa-regular');
  botonLike.classList.add('fa-heart');
  botonLike.setAttribute('data-id', datos.id);
  const contador = createElement('p', 'contador_like', sectionInteracion);
  // index = indice de cada publicacion en el array de likes
  contador.innerHTML = publicaciones[index].likes.length;

  // Click al boton like
  botonLike.addEventListener('click', async (e) => {
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
  mensajeBienvenida.innerHTML = `Bienvenid@  ${localStorage.getItem('userName')}`;
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
    if (valuePublicacion.length === 0) {
      alert('Los campos no pueden estar vacios');
    } else {
      const datos = {
        author: localStorage.getItem('userName'),
        userId: localStorage.getItem('userId'),
        created_date: new Date(),
        // edited_date: "",
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
  return sectionFeed;
}
