let books = []; 
let selectedRow = null; 

const API_URL = 'https://apiweb2-production.up.railway.app/Controller/libros.php';

// Navegar entre pantallas
function navigate(url) {
    window.location.href = url;
}

// Función para cargar los registros desde la API
async function fetchBooks() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            books = await response.json();
            renderTable();
        } else {
            console.error(`Error al obtener los libros: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Función para agregar un registro
async function addRecord() {
    const Nombre = document.getElementById('bookName').value.trim();
    const Autor = document.getElementById('authorName').value.trim();
    const Anio = document.getElementById('year').value.trim();

    if (Nombre && Autor && Anio) {
        const newBook = { Nombre, Autor, Anio };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newBook),
            });

            if (response.ok) {
                await fetchBooks(); 
                clearFields();
            } else {
                console.error(`Error al agregar el libro: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }
    } else {
        alert('Todos los campos son obligatorios.');
    }
}

// Función para renderizar la tabla
function renderTable() {
    const bookTable = document.getElementById('bookTable');
    bookTable.innerHTML = books.map((book, index) => `
        <tr onclick="selectRow(${index})">
            <td>${book.idLibro}</td>
            <td>${book.Nombre}</td>
            <td>${book.Autor}</td>
            <td>${book.Anio}</td>
        </tr>
    `).join('');
}

// Función para limpiar los campos del formulario
function clearFields() {
    document.getElementById('bookForm').reset();
    selectedRow = null;
    toggleButtons(false); // Deshabilita botones de eliminar/editar, habilita agregar
}

// Función para seleccionar una fila en la tabla
function selectRow(index) {
    selectedRow = index;
    const book = books[index];
    document.getElementById('bookName').value = book.Nombre;
    document.getElementById('authorName').value = book.Autor;
    document.getElementById('year').value = book.Anio;

    toggleButtons(true); // Habilita botones de eliminar/editar, deshabilita agregar
}

// Función para editar un registro
async function editRecord() {
    if (selectedRow !== null) {
        const idLibro = books[selectedRow].idLibro;
        const Nombre = document.getElementById('bookName').value.trim();
        const Autor = document.getElementById('authorName').value.trim();
        const Anio = document.getElementById('year').value.trim();

        if (Nombre && Autor && Anio) {
            const bookToUpdate = { idLibro, Nombre, Autor, Anio };

            try {
                const response = await fetch(API_URL, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(bookToUpdate),
                });

                if (response.ok) {
                    await fetchBooks(); 
                    clearFields();
                } else {
                    console.error(`Error al editar el libro: ${response.status} - ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error de conexión:', error);
            }
        } else {
            alert('Todos los campos son obligatorios.');
        }
    }
}

// Función para eliminar un registro
async function deleteRecord() {
    if (selectedRow !== null) {
        const idLibro = books[selectedRow].idLibro;

        try {
            const response = await fetch(API_URL, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idLibro }),
            });

            if (response.ok) {
                await fetchBooks(); 
                clearFields();
            } else {
                console.error(`Error al eliminar el libro: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }
    }
}

// Función para habilitar/deshabilitar botones
function toggleButtons(isRowSelected) {
    document.getElementById('deleteBtn').disabled = !isRowSelected;
    document.getElementById('editBtn').disabled = !isRowSelected;
    document.getElementById('addBtn').disabled = isRowSelected;
}

// Escucha el evento de limpiar formulario
document.getElementById('clearBtn').addEventListener('click', clearFields);

// Cargar libros al inicio
fetchBooks();
