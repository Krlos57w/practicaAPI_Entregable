/*logica para la cards de todos los libros */
//------------------------------MOSTRAR LIBRO CUARDADO EN LA API-----------------------------------
//escuchador de eventos
document.addEventListener('DOMContentLoaded', getLibros);//cuando se cargue la pagina se ejecuta la funcion

// traer los datos que se encuentran en la api
function getLibros() {//funcion para traer los datos de la api
    fetch('http://localhost:3000/books')//fetch se usa para hacer peticiones http
        .then(Response => Response.json())//se convierte la respuesta en json
        .then(data => mostrarLibros(data))// 
        .catch(
            function (error) {
                console.log(error);
            });
}

//ingresar datos en el card y mostrarlos en html
function mostrarLibros(listLibros) {
    let datosLibrosFila = document.getElementById("cardBooks");
    let libros = "";
    for (var cont = 0; cont < listLibros.length; cont++) {

        if (listLibros[cont].estado == true) {//si el estado es true se muestra en la tabla

            let datosFila = `<div class="card mb-3 bg-dark-subtle border border-2 border-dark" style="max-width: 540px;">
                            <div class="row g-0">
                                <div class="col-md-4">
                                <img src="src/pages/libro.jpg" class="card-img-top" alt="libro">

                                </div>
                                <div class="col-md-8">
                                    <div class="card-body">
                                        <h6 class="card-title"> TITULO: ${listLibros[cont].title} </h6>
                                        <p class="card-text"> AUTOR:  ${listLibros[cont].author} </p>
                                        <p class="card-text"> GENERO:  ${listLibros[cont].genre} </p>
                                        <p class="card-text"> ID:  ${listLibros[cont].id} </p>
                                    </div>
                                </div>
                            </div>
                        </div>`;


            // funcion para insertar la tabla en archivo html de acuardo al id
            libros += datosFila;
        }
    }
    datosLibrosFila.innerHTML = libros
}