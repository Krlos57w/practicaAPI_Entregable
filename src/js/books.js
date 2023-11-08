document.addEventListener('DOMContentLoaded', async function () {//cuando se cargue el documento se ejecuta la funcion anonima async  
    await getBoooksResquest();//llamamos a la funcion de obtener libros para hacer la peticion al servidor

    const saveBookButton = document.getElementById('saveBookButton');//boton de guardar del modal
    saveBookButton.addEventListener('click', async function () {//evento de click al boton guardar
        const bookName = document.getElementById('name').value;//obtenemos el valor del input nombre del libro
        const bookAuthor = document.getElementById('autor').value;//obtenemos el valor del input autor del libro
        const bookGenre = document.getElementById('genre').value;//obtenemos el valor del input genero del libro
        const bookPrecio = document.getElementById('precio').value;//obtenemos el valor del input precio del libro
        const bookNumeroPaginas = document.getElementById('numeroPaginas').value;//obtenemos el valor del input numero de paginas del libro
        const bookEstado = document.getElementById('cbox1').checked;//obtenemos el valor del input estado del libro

        await saveBookRequest({bookName, bookAuthor, bookGenre, bookPrecio, bookNumeroPaginas, bookEstado});//llamamos a la funcion de guardar libro, pasamos los datos del libro a guardar como objeto, estos datos se pasan como parametros a la funcion saveBookRequest y son llevados al servidor 
        hideModal('createBook');//ocultamos el modal
        await getBoooksResquest();//llamamos a la funcion de obtener libros del servidor
    });

    const deleteBookButton = document.getElementById('deleteBookButton');//boton de eliminar
    deleteBookButton.addEventListener('click', async function () {//evento de click
        const bookId = document.getElementById('deleteBookID').innerHTML;//obtenemos el id del libro a eliminar, innerHTML se usa para obtener el valor del id
        await deleteBookRequest(bookId);//llamamos a la funcion de eliminar libro pasando el id del libro a eliminar como parametro al servidor
        hideModal('deleteBookModal');//ocultamos el modal
        await getBoooksResquest();//llamamos a la funcion de obtener libros
    });

    const updateBookButton = document.getElementById('updateBookButton');//boton de actualizar optenido por id del modal
    updateBookButton.addEventListener('click', async function () {//evento de click
        const bookID = document.getElementById('editBookID').innerHTML;//obtenemos el id del libro a actualizar
        const bookName = document.getElementById('editBookTitle').value;//obtenemos el valor del input nombre del libro, value se usa para obtener el valor del titulo,value a diferencia de innerHTML se usa para obtener el valor de un input
        const bookAuthor = document.getElementById('editBookAuthor').value;//obtenemos el valor del input autor del libro
        const bookGenre = document.getElementById('editBookGenre').value;//obtenemos el valor del input genero del libro
        await updateBookRequest({bookID, bookName, bookAuthor, bookGenre});//llamamos a la funcion de actualizar libro
        hideModal('editBookModal');//ocultamos el modal
        await getBoooksResquest();//llamamos a la funcion de obtener libros        
    });

    
    const showCardButton = document.getElementById('showCard');//boton de mostrar optenido por id del modal
    showCardButton.addEventListener('click', async function () {//evento de click
        const bookID = document.getElementById('ShowCardBookID').innerHTML;//obtenemos el id del libro a mostrar
        const bookTitle = document.getElementById('ShowCardBookTitle').innerHTML;//obtenemos el titulo del libro a mostrar
        await mostarLibro(bookID, bookTitle);//llamamos a la funcion de mostrar libro
        hideModal('exampleModal');//ocultamos el modal
        await getBoooksResquest();//llamamos a la funcion de obtener libros        
    });


});  


    
  function showBooks(books){//mostrar libros en la tabla books del archivo books.txt
    let arrayBooks = '';//variable para almacenar los libros
    if (!!books && books.length > 0) {//si hay libros
      books.forEach(book => {//recorremos los libros
        arrayBooks += `
        <tr>
            <td scope="row">${book.id}</td>
          <td>${book.title}</td>
          <td>${book.genre}</td>
          <td>${book.author}</td>
          

          
          <td>
            <button type="button" class="btn btn-primary" onclick="editBook('${book.id}','${book.title}','${book.genre}','${book.author}')">Editar<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-square" viewBox="0 0 16 16">
            <path d="M15.502 1.94a.5.5 0 0 1 0 .706L14.459 3.69l-2-2L13.502.646a.5.5 0 0 1 .707 0l1.293 1.293zm-1.75 2.456-2-2L4.939 9.21a.5.5 0 0 0-.121.196l-.805 2.414a.25.25 0 0 0 .316.316l2.414-.805a.5.5 0 0 0 .196-.12l6.813-6.814z"/>
            <path fill-rule="evenodd" d="M1 13.5A1.5 1.5 0 0 0 2.5 15h11a1.5 1.5 0 0 0 1.5-1.5v-6a.5.5 0 0 0-1 0v6a.5.5 0 0 1-.5.5h-11a.5.5 0 0 1-.5-.5v-11a.5.5 0 0 1 .5-.5H9a.5.5 0 0 0 0-1H2.5A1.5 1.5 0 0 0 1 2.5v11z"/>
          </svg></button>
          </td>

          <td>
            <button type="button" class="btn btn-danger" onclick="deleteBook('${book.id}','${book.title}')">Eliminar<i class="bi bi-trash"></i></button>
          </td>

          <td>
          <button id="showCard" onclick="mostrarBook('${book.id}',${book.title}) type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
          mostrar <i class="bi bi-eye"></i>
          </button>
          </td>

          <td>${book.precio}</td>
          <td>${book.numeroPaginas}</td>
          <td>${book.estado}</td>
        </tr>
        `;
      });
    } else {
      arrayBooks = `
      <tr class="table-warning">
        <td colspan="6" class="text-center">Sin libros para gestionar</td>
      </tr>
      `;
    }
    
    const tableBody = document.getElementById('tableBody');
    tableBody.innerHTML = arrayBooks;
}

//funcion para obtener libro con metodo get al servidor
async function obtenerLibro({id}) {//funcion para obtener libro
  try{
    let request = await fetch('http://localhost:3000/books', {//hacemos la peticion al servidor
    method: 'GET',//metodo get para obtener libro
    headers: {
        "Content-Type": 'application/json'//tipo de contenido que se envia
    },
    body: JSON.stringify({//convertimos los datos a json
        id: id,//obtenemos el id del libro
        title: bookName,//obtenemos el nombre del libro
    })
});
let data = await request.json();
if (data.ok) {//si se obtuvo el libro el servidor nos devuelve un ok
    alert('libro obtenido');//mostramos mensaje de libro obtenido
} else {  
  alert('Error al optener libros');
} 
  }catch (error) {  
    alert('Error');
  }
}
   



async function getBoooksResquest() {//funcion para obtener libros
    try {//try hace que se ejecute el codigo y si hay un error se ejecuta el catch
        let response = await fetch('http://localhost:3000/books');//hacemos la peticion al servidor y esperamos la respuesta con await, fetch devuelve una promesa y await espera la respuesta de la promesa, la promesa significa que se ejecuta el codigo y cuando se resuelva la promesa se ejecuta el codigo que esta despues del await
        let data = await response.json();// convertimos la respuesta a json, await espera la respuesta de la promesa, response.json() devuelve una promesa  
        showBooks(data);//llamamos a la funcion de mostrar libros, 
        } catch (error) {
        console.log(error);
        showBooks(null);//llamamos a la funcion de mostrar libros, pasamos null para que muestre el mensaje de que no hay libros
    }
}

//peticiones al servidor
async function saveBookRequest({bookName, bookAuthor, bookGenre, bookPrecio, bookNumeroPaginas, bookEstado}) {//funcion para guardar libro
    try {
        let request = await fetch('http://localhost:3000/books', {//hacemos la peticion al servidor
            method: 'POST',//metodo post para crear libro, post para crear, get para obtener, put para actualizar, delete para eliminar 
            headers: {
                "Content-Type": 'application/json'//tipo de contenido que se envia
            },
            body: JSON.stringify({//convertimos los datos a json
                title: bookName,//obtenemos el nombre del libro
                genre: bookGenre,
                author: bookAuthor,
                precio: bookPrecio,
                numeroPaginas: bookNumeroPaginas,
                estado: bookEstado
            })
        });
        let data = await request.json();
        if (data.ok) {//si se creo el libro el servidor nos devuelve un ok
            alert('Book created successfully');//mostramos mensaje de libro creado
        } else {
          alert('Error creating book');
        }
            
        hideModal('createBook');//ocultamos el modal
        location.reload();//recargamos la pagina
    } catch (error) {
        //console.log(error);
    }
  }

  async function deleteBookRequest(id) {//funcion para eliminar libro
    try {
        let request = await fetch(`http://localhost:3000/books/${id}`, {//hacemos la peticion al servidor
            method: 'DELETE'//metodo delete para eliminar libro
        });
        let data = await request.json();
        if (data.ok) {//si se elimino el libro el servidor nos devuelve un ok
            alert('Book deleted successfully');//mostramos mensaje de libro eliminado
        } else {
          alert('Error deleting book');
        }
        hideModal('deleteBookModal');//ocultamos el modal
        location.reload();//recargamos la pagina
    } catch (error) {
        //console.log(error);
    }
  }

  async function updateBookRequest({bookID, bookName, bookAuthor, bookGenre}) {//funcion para actualizar libro
    try {
        let request = await fetch(`http://localhost:3000/books/${bookID}`, {//hacemos la peticion al servidor
            method: 'PUT',//metodo put para actualizar libro
            headers: {
                "Content-Type": 'application/json'//tipo de contenido que se envia
            },
            body: JSON.stringify({//convertimos los datos a json
                title: bookName,//obtenemos el nombre del libro
                author: bookAuthor,
                genre: bookGenre
            })
        });
        const data = await request.json();

        if (data.ok) {//si se actualizo el libro el servidor nos devuelve un ok
            alert('Book updated successfully');//mostramos mensaje de libro actualizado
        } else {
          alert('Error updating book');
        }

      } catch (error) {
        alert('Error');
      }
  }


  //funiones para mostrar y ocultar modal
  
  function showModal(idModal) {//mostrar modal con parametro idModal
    const myModal = new bootstrap.Modal(`#${idModal}`,{
        keyboard: false
    });
    myModal.show();
  }

  function hideModal(modalId) {
    const existingModal = document.getElementById(modalId);//obtenemos el modal
    const modal = bootstrap.Modal.getInstance(existingModal);//obtenemos la instancia del modal
    modal.hide();//ocultamos el modal
  }

  function deleteBook(id, title) {//funcion para eliminar libro
    document.getElementById('deleteBookID').innerHTML = id;//obtenemos el id del libro a eliminar
    document.getElementById('deleteBookTitle').innerHTML = title;//obtenemos el titulo del libro a eliminar
    showModal('deleteBookModal');//mostramos el modal
  }

  function editBook(id, title, genre, author) {//funcion para editar libro
    document.getElementById('editBookID').innerHTML = id;//obtenemos el id del libro a editar, innerHTML para obtener el valor del id
    document.getElementById('editBookTitle').value = title;//obtenemos el titulo del libro a editar, value para obtener el valor del titulo
    document.getElementById('editBookGenre').value = genre;//obtenemos el genero del libro a editar
    document.getElementById('editBookAuthor').value = author;//obtenemos el autor del libro a editar
    showModal('editBookModal');//mostramos el modal
  }

  function mostrarBook(id, title) {//funcion para mostrar libro
    document.getElementById('ShowCardBookID').innerHTML = id;//obtenemos el id del libro a mostrar
    document.getElementById('ShowCardBookTitle').innerHTML = title;//obtenemos el titulo del libro a mostrar
    showModal('exampleModal');//mostramos el modal
  }

  
 