/* eslint-disable no-inner-declarations */
import { createElement } from '../utils/utils';
import {
  guardarPost, traerpost, addLiked, removeLiked, editPost, saveEditedPost
} from '../controller/feedController';

// Funcion crear publicaciones
export function createPost(datos, index, publicaciones) {
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

    /* --------------------- Boton Editar Post ----------------*/
    // Bonton edit
    const botonEdit = createElement('button', 'icono_edit', sectionInteracion);
    botonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';

    // edit post
    function showEditField(textareaElement) {
      textareaElement.removeAttribute('disabled');
      textareaElement.focus(); // Enfocar automáticamente en el textarea para facilitar la edición
      textareaElement.addEventListener('input', async () => {
        const editedContent = textareaElement.value;
        await editPost(datos.id, editedContent);
        // No necesitas actualizar la interfaz ya que el contenido se actualiza en tiempo real
      });
      textareaElement.addEventListener('blur', () => {
        textareaElement.setAttribute('disabled', '');
        textareaElement.removeEventListener('input', null); // Eliminar el event listener para evitar fugas de memoria
      });
    }
    // Crear el botón de cancelar
    const botonCancel = createElement('button', 'icono_cancelar', sectionInteracion);
    botonCancel.innerHTML = '<i class="fa-solid fa-rectangle-xmark"></i>';
    botonCancel.style.display = 'none'; // Inicialmente oculto

    let originalContent = ''; // Variable para almacenar el contenido original

    botonCancel.addEventListener('click', () => {
      // Restaurar el contenido original y desactivar la edición
      textarea.value = originalContent;
      textarea.setAttribute('disabled', '');
      botonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
      botonEdit.classList.remove('editing');
      botonCancel.style.display = 'none';
    });

    botonEdit.addEventListener('click', () => {
      if (botonEdit.classList.contains('editing')) {
        // Guardar los cambios
        const editedContent = textarea.value;
        saveEditedPost(datos.id, editedContent)
          .then(() => {
            // Actualizar la interfaz después de guardar
            textarea.setAttribute('disabled', '');
            botonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
            botonEdit.classList.remove('editing');
            botonCancel.style.display = 'none'; // Ocultar el botón Cancelar
          })
          .catch((error) => {
            console.error('Error al guardar los cambios:', error);
          });
      } else {
        // Activar modo de edición
        originalContent = textarea.value; // Almacenar el contenido original
        showEditField(textarea, datos.post);
        botonEdit.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
        botonEdit.classList.add('editing');
        botonCancel.style.display = 'block'; // Mostrar el botón Cancelar
      }
    });
    // Boton delete
    const botonDelete = createElement('button', 'icono_delete', sectionInteracion);
    botonDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

    // Icono edit
    const iconoEdit = createElement('i', 'icono_edit', sectionInteracion);
    iconoEdit.classList.add('fa-regular');
    iconoEdit.classList.add('fa-pen-to-square');
    // Icono delete
    const iconoDelete = createElement('i', 'icono_delete', sectionInteracion);
    iconoDelete.classList.add('fa-solid');
    iconoDelete.classList.add('fa-trash-can');
    iconoDelete.setAttribute('data-id', datos.id);
    iconoDelete.addEventListener('click', async (e) => {
      const idPost = e.target.dataset.id;
      if (window.confirm('¿Estás seguro de borrar la publicación?')) {
        deletePost(idPost);
        window.location.reload();
      }
    });

  }
  /* ------------------------- Funcion de likes --------------------------------*/
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
export async function dibujarPosts() {
  const documentos = await traerPost();
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
    console.log('Botón de cerrar sesión clickeado');
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
  const btnCamara = createElement('button', 'boton_camara', divInput);
  btnCamara.innerHTML = '<i class="fa-solid fa-camera"></i>';
  const divButtons = createElement('div', 'section_button', divPost);
  const buttonPublicar = createElement('button', 'button_publicar', divButtons);
  buttonPublicar.textContent = 'Publicar';
  buttonPublicar.setAttribute('type', 'button');

  createElement('section', 'section_publicaciones', sectionFeed);
  dibujarPosts();

  /* --------------------------------Crear publicacion con texto ------------------------------*/
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
