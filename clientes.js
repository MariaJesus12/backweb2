let clients = []; 
let selectedClientRow = null;
// Navegar entre pantallas
function navigate(url) {
    window.location.href = url;
}

const API_URL = 'http://localhost/Proyecto2/Controller/clientes.php';

// Función para cargar los clientes desde la API
async function fetchClients() {
    try {
        const response = await fetch(API_URL);
        if (response.ok) {
            clients = await response.json();
            renderClientTable();
        } else {
            console.error(`Error al obtener los clientes: ${response.status} - ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error de conexión:', error);
    }
}

// Función para agregar un cliente
async function addClient() {
    const clientName = document.getElementById('clientName').value.trim();
    const clientEmail = document.getElementById('clientEmail').value.trim();
    const clientPhone = document.getElementById('clientPhone').value.trim();

    if (clientName && clientEmail && clientPhone) {
        const newClient = { Nombre: clientName, Correo: clientEmail, Telefono: clientPhone };

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(newClient),
            });

            if (response.ok) {
                await fetchClients(); 
                clearClientFields();
            } else {
                console.error(`Error al agregar el cliente: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }
    } else {
        alert('Todos los campos son obligatorios.');
    }
}

// Función para renderizar la tabla de clientes
function renderClientTable() {
    const clientTable = document.getElementById('clientTable');
    clientTable.innerHTML = clients.map((client, index) => `
        <tr onclick="selectClientRow(${index})">
            <td>${client.idCliente}</td>
            <td>${client.Nombre}</td>
            <td>${client.Correo}</td>
            <td>${client.Telefono}</td>
        </tr>
    `).join('');
}

// Función para limpiar los campos del formulario
function clearClientFields() {
    document.getElementById('clientForm').reset();
    selectedClientRow = null;
    toggleClientButtons(false);
}

// Función para seleccionar una fila en la tabla de clientes
function selectClientRow(index) {
    selectedClientRow = index;
    const client = clients[index];
    document.getElementById('clientName').value = client.Nombre;
    document.getElementById('clientEmail').value = client.Correo;
    document.getElementById('clientPhone').value = client.Telefono;

    toggleClientButtons(true);
}

// Función para editar un cliente
async function editClient() {
    if (selectedClientRow !== null) {
        const idCliente = clients[selectedClientRow].idCliente;
        const clientName = document.getElementById('clientName').value.trim();
        const clientEmail = document.getElementById('clientEmail').value.trim();
        const clientPhone = document.getElementById('clientPhone').value.trim();

        if (clientName && clientEmail && clientPhone) {
            const updatedClient = { idCliente, Nombre: clientName, Correo: clientEmail, Telefono: clientPhone };

            try {
                const response = await fetch(API_URL, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updatedClient),
                });

                if (response.ok) {
                    await fetchClients();
                    clearClientFields();
                } else {
                    console.error(`Error al editar el cliente: ${response.status} - ${response.statusText}`);
                }
            } catch (error) {
                console.error('Error de conexión:', error);
            }
        } else {
            alert('Todos los campos son obligatorios.');
        }
    }
}

// Función para eliminar un cliente
async function deleteClient() {
    if (selectedClientRow !== null) {
        const idCliente = clients[selectedClientRow].idCliente;

        try {
            const response = await fetch(API_URL, {
                method: 'DELETE',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ idCliente }),
            });

            if (response.ok) {
                await fetchClients(); 
                clearClientFields();
            } else {
                console.error(`Error al eliminar el cliente: ${response.status} - ${response.statusText}`);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }
    }
}

// Función para habilitar/deshabilitar botones
function toggleClientButtons(isRowSelected) {
    document.getElementById('deleteClientBtn').disabled = !isRowSelected;
    document.getElementById('editClientBtn').disabled = !isRowSelected;
    document.getElementById('addClientBtn').disabled = isRowSelected;
}

// Escucha el evento de limpiar formulario
document.getElementById('clearClientBtn').addEventListener('click', () => {
    clearClientFields();
});

fetchClients();
