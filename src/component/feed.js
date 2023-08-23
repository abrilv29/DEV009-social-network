/* eslint-disable no-undef */
/* eslint-disable no-inner-declarations */
import { createElement } from '../utils/utils';
import {
<<<<<<< HEAD
  guardarPost, traerPost, addLiked, removeLiked, editPost, saveEditedPost, deletePost,
=======
  guardarPost, traerPost, addLiked, removeLiked, editPost, saveEditedPost,
>>>>>>> a014d37b1c968cd70b93b3eae1bf1550e09b330b
} from '../controller/feedController';
import { uploadImg, getUrl } from '../controller/storageController';

// Funcion crear publicaciones
function createPost(datos, index, publicaciones) {
  const sectionPublicaciones = document.querySelector('.section_publicaciones');
  const divPublicacion = createElement('div', 'container_publicacion', sectionPublicaciones);

  // imagen
  // Mostrar la imagen si existe la URL de la imagen
  const imageContainer = createElement('div', 'image-container', divPublicacion);
  const uploadedImage = createElement('img', 'uploaded-image', imageContainer);
  uploadedImage.src = datos.imageUrl;
  // ocultar la imagen rota
  if (datos.imageUrl) {
    uploadedImage.src = datos.imageUrl;
    uploadedImage.style.display = 'block';
  } else {
    uploadedImage.style.display = 'none';
  }

  const name = createElement('p', 'name_user', divPublicacion);
  name.innerHTML = datos.author;
  const textContainer = createElement('div', 'text-container', divPublicacion);
  const textarea = createElement('textarea', 'textarea_publicacion', textContainer);
  textarea.value = datos.post;

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

    botonCancel.addEventListener('click', () => {
      // Restaurar el contenido original y desactivar la edición
      textarea.value = datos.post;
      textarea.setAttribute('disabled', '');
      botonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
      botonEdit.classList.remove('editing');
      botonCancel.style.display = 'none';
    });

    botonEdit.addEventListener('click', () => {
      if (botonEdit.classList.contains('editing')) {
        // Guardar los cambios
        const editedContent = textarea.value;
        saveEditedPost(datos.id, editedContent);
        // Actualizar la interfaz después de guardar
        textarea.innerHTML = editedContent;
        textarea.setAttribute('disabled', '');
        botonEdit.innerHTML = '<i class="fa-regular fa-pen-to-square"></i>';
        botonEdit.classList.remove('editing');
        botonCancel.style.display = 'none'; // Ocultar el botón Cancelar
      } else {
        // Activar modo de edición
        showEditField(textarea, datos.post);
        botonEdit.innerHTML = '<i class="fa-solid fa-floppy-disk"></i>';
        botonEdit.classList.add('editing');
        botonCancel.style.display = 'block'; // Mostrar el botón Cancelar
      }
    });

    // Boton delete
    const botonDelete = createElement('button', 'icono_delete', sectionInteracion);
    botonDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
<<<<<<< HEAD

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
=======
>>>>>>> a014d37b1c968cd70b93b3eae1bf1550e09b330b
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
async function dibujarPosts() {
  const documentos = await traerPost();
  // Se crea un objeto nuevo con la informacion de cada publicacion
  // (se cambia el querySnapshot por un array mas simple)
  const publicaciones = documentos.docs.map(
    (documento) => ({ id: documento.id, ...documento.data() }),
  );
  // Limpiar el contenedor de publicaciones antes de dibujar nuevas publicaciones
  const sectionPublicaciones = document.querySelector('.section_publicaciones');
  sectionPublicaciones.innerHTML = '';
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
  const btnCamara = createElement('button', 'boton_camara', divInput);
  btnCamara.innerHTML = '<i class="fa-solid fa-camera"></i>';
  const divButtons = createElement('div', 'section_button', divPost);
  const buttonPublicar = createElement('button', 'button_publicar', divButtons);
  buttonPublicar.textContent = 'Publicar';
  buttonPublicar.setAttribute('type', 'button');

  createElement('section', 'section_publicaciones', sectionFeed);
  dibujarPosts();

  /* --------------------- Seccion del modal imgenes ---------------------------------------------*/

  const sectionModal = createElement('section', 'modal', '');
  sectionModal.style.display = 'block';
  sectionModal.innerHTML = `
                      <div class="modal__container">
                      <h2 class="modal__title">¡Publicar Imagen!</h2>
                      <p class="modal__paragraph">Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                      Deleniti nobis nisi quibusdam doloremque expedita quae ipsam accusamus quisquam quas,
                       culpa tempora. Veniam consectetur deleniti maxime.</p>
                       <div class="modal__body">
                       <input class="modal__file" type="file" id="fileInput" accept="image/*">
                       <img class="uploaded-image" id="uploadedImage" src="" alt="" >
                       <button class="modal__upload" id="uploadButton">Publicar</button>
                       <button class="modal__close">Cerrar Modal</button>
                      </div>
                    </div>`;
  // boton cerrar modal
  const closeModal = sectionModal.querySelector('.modal__close');

  closeModal.addEventListener('click', (e) => {
    e.preventDefault();
    sectionModal.classList.remove('modal--show');
    sectionModal.style.display = 'none';
    console.log('cerrar modal');
  });

  function clearSelectedImage() {
    const fileInput = sectionModal.querySelector('.modal__file');
    const uploadedImage = sectionModal.querySelector('.uploaded-image');

    // Restaurar la entrada del archivo a su estado original
    fileInput.value = '';

    // Ocultar la imagen seleccionada
    uploadedImage.src = '';
    uploadedImage.style.display = 'none';
  }
  // eslint-disable-next-line no-unused-vars
  let selectedImageUrl = '';
  // boton cargar imagen
  const fileInput = sectionModal.querySelector('.modal__file');
  const uploadedImage = sectionModal.querySelector('.uploaded-image');
  const cargarImg = sectionModal.querySelector('.modal__upload');

  fileInput.addEventListener('change', () => {
    const selectedFile = fileInput.files[0];
    if (selectedFile) {
      const localImageUrl = URL.createObjectURL(selectedFile);

      uploadedImage.src = localImageUrl;
      uploadedImage.style.display = 'block';
    } else {
      uploadedImage.src = '';
      uploadedImage.style.display = 'none';
    }
  });
  function setSelectedImageUrl(url) {
    selectedImageUrl = url;
  }

  async function publicarConImagen(imageUrl, valuePublicacion) {
    const nuevaPublicacion = {
      author: userDisplayName,
      userId: localStorage.getItem('userId'),
      created_date: new Date(),
      post: valuePublicacion,
      likes: [],
      counter: 0,
      imageUrl: imageUrl || '',
    };

    inputPublicacion.value = '';
    clearSelectedImage();

    await guardarPost(nuevaPublicacion);
    await dibujarPosts();
  }

  // Modificar el evento del botón de cámara
  cargarImg.addEventListener('click', async () => {
    const valuePublicacion = inputPublicacion.value;
    const file = fileInput.files[0];
    if (file) {
      try {
        await uploadImg(file.name, file);
        const imageUrl = await getUrl(`${file.name}`);

        // Llama a la función para establecer la URL de la imagen seleccionada
        setSelectedImageUrl(imageUrl);

        // Publica la imagen con el contenido del campo de texto
        await publicarConImagen(imageUrl, valuePublicacion);

        // Cierra el modal después de publicar
        sectionModal.style.display = 'none';
        sectionModal.classList.remove('modal--show');
      } catch (error) {
        console.error('Error al subir la imagen', error);
      }
    }
  });

  /* -------------------------------Crear publicacion de la imagen -----------------------------*/
  // Boton camara para cargar imagenes
  btnCamara.addEventListener('click', (e) => {
    e.preventDefault();
    divInput.appendChild(sectionModal);
    sectionModal.style.display = 'block';
    sectionModal.classList.add('modal--show');
  });// Cargar

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
