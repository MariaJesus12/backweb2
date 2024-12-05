let rentals = []; 
let selectedRentalRow = null;

const clientsAPI = 'http://apiweb2-production.up.railway.app/Controller/clientes.php';
const booksAPI = 'http://apiweb2-production.up.railway.app/Controller/libros.php';
const rentalsAPI = 'http://apiweb2-production.up.railway.app/Controller/alquileres.php';

// Función para cargar datos desde la API
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error al cargar datos desde ${url}`);
        return await response.json();
    } catch (error) {
        console.error(error);
        return [];
    }
}

// Función para cargar opciones de libros y clientes en los select
async function populateSelects() {
    const books = await fetchData(booksAPI);
    const clients = await fetchData(clientsAPI);

    const rentalBookSelect = document.getElementById('rentalBook');
    const rentalClientSelect = document.getElementById('rentalClient');

    books.forEach(book => {
        const option = document.createElement('option');
        option.value = book.idLibro; 
        option.textContent = book.Nombre;
        rentalBookSelect.appendChild(option);
    });

    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.idCliente; 
        option.textContent = client.Nombre; 
        rentalClientSelect.appendChild(option);
    });
}

// Función para cargar alquileres desde la API
async function loadRentals() {
    rentals = await fetchData(rentalsAPI);
    renderRentalTable();
}

// Función para renderizar la tabla de alquileres
function renderRentalTable() {
    const rentalTable = document.getElementById('rentalTable');
    rentalTable.innerHTML = rentals.map((rental, index) => `
        <tr onclick="selectRentalRow(${index})">
            <td>${rental.idAlquiler}</td>
            <td>${rental.Libro}</td>
            <td>${rental.Cliente}</td>
            <td>${rental.FechaAlquiler}</td>
        </tr>
    `).join('');
}

// Función para agregar un alquiler
async function addRental() {
    const idLibro = document.getElementById('rentalBook').value;
    const idCliente = document.getElementById('rentalClient').value;
    const FechaAlquiler = document.getElementById('rentalDate').value;

    if (idLibro && idCliente && FechaAlquiler) {
        const newRental = { idLibro, idCliente, FechaAlquiler };

        try {
            const response = await fetch(rentalsAPI, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newRental)
            });

            if (!response.ok) throw new Error('Error al agregar el alquiler.');
            await loadRentals(); 
            clearRentalFields();
        } catch (error) {
            console.error(error);
            alert('No se pudo agregar el alquiler.');
        }
    } else {
        alert('Todos los campos son obligatorios.');
    }
}

// Función para seleccionar una fila en la tabla de alquileres
function selectRentalRow(index) {
    selectedRentalRow = index;
    const rental = rentals[index];

    document.getElementById('rentalBook').value = rental.idLibro;
    document.getElementById('rentalClient').value = rental.idCliente;
    document.getElementById('rentalDate').value = rental.FechaAlquiler;

    toggleRentalButtons(true);
}

// Función para editar un alquiler
async function editRental() {
    if (selectedRentalRow !== null) {
        const idLibro = document.getElementById('rentalBook').value;
        const idCliente = document.getElementById('rentalClient').value;
        const FechaAlquiler = document.getElementById('rentalDate').value;

        if (idLibro && idCliente && FechaAlquiler) {
            const updatedRental = {
                idAlquiler: rentals[selectedRentalRow].idAlquiler,
                idLibro,
                idCliente,
                FechaAlquiler
            };

            try {
                const response = await fetch(rentalsAPI, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedRental)
                });

                if (!response.ok) throw new Error('Error al actualizar el alquiler.');
                await loadRentals(); 
                clearRentalFields();
            } catch (error) {
                console.error(error);
                alert('No se pudo actualizar el alquiler.');
            }
        } else {
            alert('Todos los campos son obligatorios.');
        }
    }
}

// Función para eliminar un alquiler
async function deleteRental() {
    if (selectedRentalRow !== null) {
        const idAlquiler = rentals[selectedRentalRow].idAlquiler;

        try {
            const response = await fetch(rentalsAPI, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idAlquiler }), 
            });

            if (response.ok) {
                await loadRentals(); 
                clearRentalFields(); 
                alert('Alquiler eliminado con éxito.');
            } else {
                console.error(`Error al eliminar el alquiler: ${response.status} - ${response.statusText}`);
                alert('No se pudo eliminar el alquiler. Intente nuevamente.');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            alert('Ocurrió un error al conectar con el servidor.');
        }
    } else {
        alert('Seleccione un alquiler para eliminar.');
    }
}


// Función para limpiar los campos del formulario
function clearRentalFields() {
    document.getElementById('rentalForm').reset();
    selectedRentalRow = null;
    toggleRentalButtons(false);
}

// Función para habilitar/deshabilitar botones
function toggleRentalButtons(isRowSelected) {
    document.getElementById('deleteRentalBtn').disabled = !isRowSelected;
    document.getElementById('editRentalBtn').disabled = !isRowSelected;
    document.getElementById('addRentalBtn').disabled = isRowSelected;
}

// Inicializar la página
document.addEventListener('DOMContentLoaded', async () => {
    await populateSelects(); 
    await loadRentals(); 
});
// Función para navegar a otra página
function navigate(url) {
    window.location.href = url; // Cambia la URL de la página actual
}