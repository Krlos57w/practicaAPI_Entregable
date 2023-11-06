document.addEventListener('DOMContentLoaded', async function () {//cuando se cargue el documento se ejecuta la funcion anonima async  
    await getBoooksResquest();//llamamos a la funcion de obtener libros 

    const saveBookButton = document.getElementById('saveBookButton');//boton de guardar
    saveBookButton.addEventListener('click', async function () {//evento de click
        const bookName = document.getElementById('name').value;//obtenemos el valor del input nombre del libro
        const bookAuthor = document.getElementById('autor').value;//obtenemos el valor del input autor del libro
        const bookGenre = document.getElementById('genre').value;//obtenemos el valor del input genero del libro

        await saveBookRequest({bookName, bookAuthor, bookGenre});//llamamos a la funcion de guardar libro
        hideModal('createBook');//ocultamos el modal
        await getBoooksResquest();//llamamos a la funcion de obtener libros
    });

    const deleteBookButton = document.getElementById('deleteBookButton');//boton de eliminar
    deleteBookButton.addEventListener('click', async function () {//evento de click
        const bookId = document.getElementById('deleteBookID').innerHTML;//obtenemos el id del libro a eliminar
        await deleteBookRequest(bookId);//llamamos a la funcion de eliminar libro
        hideModal('deleteBookModal');//ocultamos el modal
        await getBoooksResquest();//llamamos a la funcion de obtener libros
    });

    const updateBookButton = document.getElementById('updateBookButton');//boton de actualizar optenido por id del modal
    updateBookButton.addEventListener('click', async function () {//evento de click
        const bookID = document.getElementById('editBookID').innerHTML;//obtenemos el id del libro a actualizar
        const bookName = document.getElementById('editBookTitle').value;//obtenemos el valor del input nombre del libro
        const bookAuthor = document.getElementById('editBookAuthor').value;//obtenemos el valor del input autor del libro
        const bookGenre = document.getElementById('editBookGenre').value;//obtenemos el valor del input genero del libro
        await updateBookRequest({bookID, bookName, bookAuthor, bookGenre});//llamamos a la funcion de actualizar libro
        hideModal('editBookModal');//ocultamos el modal
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

async function getBoooksResquest() {//funcion para obtener libros
    try {
        let response = await fetch('http://localhost:3000/books');//hacemos la peticion al servidor
        let data = await response.json();
        showBooks(data);
        } catch (error) {
        console.log(error);
        showBooks(null);
    }
}

//peticiones al servidor
async function saveBookRequest({bookName, bookAuthor, bookGenre}) {//funcion para guardar libro
    try {
        let request = await fetch('http://localhost:3000/books', {//hacemos la peticion al servidor
            method: 'POST',//metodo post para crear libro 
            headers: {
                "Content-Type": 'application/json'//tipo de contenido que se envia
            },
            body: JSON.stringify({//convertimos los datos a json
                title: bookName,//obtenemos el nombre del libro
                genre: bookGenre,
                author: bookAuthor
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


  //funiones 
  function showModal(idModal) {//mostrar modal
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


