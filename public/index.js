// URL base de la API (al estar en el mismo servidor, puede ser relativa)
const API_URL = "";

// NAVEGACIÓN
function showSection(sectionName) {
    const allSections = document.querySelectorAll(".formSection");
    allSections.forEach(section => section.classList.add("hidden"));

    const allNavBtns = document.querySelectorAll(".navBtn");
    allNavBtns.forEach(btn => btn.classList.remove("active"));

    const targetSection = document.querySelector(`#${sectionName}`);
    targetSection.classList.remove("hidden");

    const activeBtn = document.querySelector(`#btn${capitalize(sectionName)}`);
    activeBtn.classList.add("active");
}

function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// MENSAJES DE RESPUESTA
function showMsg(elementId, text, type) {
    const msgElement = document.querySelector(`#${elementId}`);
    msgElement.textContent = text;
    msgElement.className = `responseMsg ${type}`;

    setTimeout(() => {
        msgElement.textContent = "";
        msgElement.className = "responseMsg";
    }, 3000);
}


// VEHÍCULOS
async function cargarVehiculos() {
    try {
        const response = await fetch(`${API_URL}/vehiculos`);
        const vehiculos = await response.json();
        renderVehiculos(vehiculos);
    } catch (error) {
        showMsg("msgVehiculo", "Error al cargar vehículos", "error");
    }
}

function renderVehiculos(vehiculos) {
    const tbody = document.querySelector("#vehiculosBody");
    tbody.innerHTML = "";

    if (vehiculos.length === 0) {
        tbody.innerHTML = `<tr class="emptyRow"><td colspan="9">No hay vehículos registrados</td></tr>`;
        return;
    }

    vehiculos.forEach(v => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${v.id_vehiculo}</td>
            <td>${v.marca}</td>
            <td>${v.modelo}</td>
            <td>${v.ano}</td>
            <td>$${Number(v.precio).toLocaleString()}</td>
            <td>${v.color}</td>
            <td>${v.kilometraje.toLocaleString()} km</td>
            <td>${v.estado}</td>
            <td><button class="deleteBtn" onclick="eliminarVehiculo(${v.id_vehiculo})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

async function registrarVehiculo() {
    const marca = document.querySelector("#vehiculoMarca").value;
    const modelo = document.querySelector("#vehiculoModelo").value;
    const ano = document.querySelector("#vehiculoAno").value;
    const precio = document.querySelector("#vehiculoPrecio").value;
    const color = document.querySelector("#vehiculoColor").value;
    const kilometraje = document.querySelector("#vehiculoKilometraje").value;
    const estado = document.querySelector("#vehiculoEstado").value;

    if (!marca || !modelo || !ano || !precio || !color || !kilometraje || !estado) {
        showMsg("msgVehiculo", "Todos los campos son obligatorios", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/vehiculos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ marca, modelo, ano, precio, color, kilometraje, estado })
        });

        if (response.ok) {
            showMsg("msgVehiculo", "Vehículo registrado con éxito", "success");
            limpiarFormulario(["vehiculoMarca", "vehiculoModelo", "vehiculoAno", "vehiculoPrecio", "vehiculoColor", "vehiculoKilometraje", "vehiculoEstado"]);
            cargarVehiculos();
        } else {
            showMsg("msgVehiculo", "Error al registrar el vehículo", "error");
        }
    } catch (error) {
        showMsg("msgVehiculo", "Error de conexión con el servidor", "error");
    }
}

async function eliminarVehiculo(id) {
    if (!confirm("¿Seguro que deseas eliminar este vehículo?")) return;
    try {
        const response = await fetch(`${API_URL}/vehiculos/${id}`, { method: "DELETE" });
        if (response.ok) {
            showMsg("msgVehiculo", "Vehículo eliminado", "success");
            cargarVehiculos();
        }
    } catch (error) {
        showMsg("msgVehiculo", "Error al eliminar vehículo", "error");
    }
}


// CLIENTES
async function cargarClientes() {
    try {
        const response = await fetch(`${API_URL}/clientes`);
        const clientes = await response.json();
        renderClientes(clientes);
        poblarSelectClientes(clientes);
    } catch (error) {
        showMsg("msgCliente", "Error al cargar clientes", "error");
    }
}

function renderClientes(clientes) {
    const tbody = document.querySelector("#clientesBody");
    tbody.innerHTML = "";

    if (clientes.length === 0) {
        tbody.innerHTML = `<tr class="emptyRow"><td colspan="6">No hay clientes registrados</td></tr>`;
        return;
    }

    clientes.forEach(c => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${c.id_cliente}</td>
            <td>${c.nombre}</td>
            <td>${c.email}</td>
            <td>${c.telefono}</td>
            <td>${c.ciudad}</td>
            <td><button class="deleteBtn" onclick="eliminarCliente(${c.id_cliente})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

function poblarSelectClientes(clientes) {
    const select = document.querySelector("#reservaIdCliente");
    select.innerHTML = '<option value="">-- Seleccionar cliente --</option>';
    clientes.forEach(c => {
        select.innerHTML += `<option value="${c.id_cliente}">${c.nombre} (ID: ${c.id_cliente})</option>`;
    });
}

async function registrarCliente() {
    const nombre = document.querySelector("#clienteNombre").value;
    const email = document.querySelector("#clienteEmail").value;
    const telefono = document.querySelector("#clienteTelefono").value;
    const city = document.querySelector("#clienteCiudad").value; // 'ciudad' en DB

    if (!nombre || !email || !telefono || !city) {
        showMsg("msgCliente", "Todos los campos son obligatorios", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/clientes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ nombre, email, telefono, ciudad: city })
        });

        if (response.ok) {
            showMsg("msgCliente", "Cliente registrado con éxito", "success");
            limpiarFormulario(["clienteNombre", "clienteEmail", "clienteTelefono", "clienteCiudad"]);
            cargarClientes();
        } else {
            showMsg("msgCliente", "El email ya está registrado o datos inválidos", "error");
        }
    } catch (error) {
        showMsg("msgCliente", "Error de conexión con el servidor", "error");
    }
}

async function eliminarCliente(id) {
    if (!confirm("¿Seguro que deseas eliminar este cliente?")) return;
    try {
        const response = await fetch(`${API_URL}/clientes/${id}`, { method: "DELETE" });
        if (response.ok) {
            showMsg("msgCliente", "Cliente eliminado", "success");
            cargarClientes();
        }
    } catch (error) {
        showMsg("msgCliente", "Error al eliminar cliente", "error");
    }
}


// RESERVAS
async function cargarReservas() {
    try {
        const response = await fetch(`${API_URL}/reservas`);
        const reservas = await response.json();
        renderReservas(reservas);
    } catch (error) {
        showMsg("msgReserva", "Error al cargar reservas", "error");
    }
}

function renderReservas(reservas) {
    const tbody = document.querySelector("#reservasBody");
    tbody.innerHTML = "";

    if (reservas.length === 0) {
        tbody.innerHTML = `<tr class="emptyRow"><td colspan="6">No hay reservas registradas</td></tr>`;
        return;
    }

    reservas.forEach(r => {
        // Formatear fecha de la DB (YYYY-MM-DD)
        const fecha = new Date(r.fecha_reserva).toISOString().split('T')[0];
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${r.id_reserva}</td>
            <td>${fecha}</td>
            <td>${r.tipo_transaccion}</td>
            <td>${r.nombre_cliente}</td>
            <td>${r.marca} ${r.modelo}</td>
            <td><button class="deleteBtn" onclick="eliminarReserva(${r.id_reserva})">Eliminar</button></td>
        `;
        tbody.appendChild(tr);
    });
}

async function poblarSelectVehiculos() {
    try {
        const response = await fetch(`${API_URL}/vehiculos`);
        const vehiculos = await response.json();
        const select = document.querySelector("#reservaIdVehiculo");
        select.innerHTML = '<option value="">-- Seleccionar vehículo --</option>';
        vehiculos.forEach(v => {
            select.innerHTML += `<option value="${v.id_vehiculo}">${v.marca} ${v.modelo} - $${Number(v.precio).toLocaleString()} (${v.estado})</option>`;
        });
    } catch (error) {
        console.error("Error al poblar vehículos para reservas", error);
    }
}

async function registrarReserva() {
    const fecha_reserva = document.querySelector("#reservaFecha").value;
    const tipo_transaccion = document.querySelector("#reservaTipo").value;
    const id_cliente = document.querySelector("#reservaIdCliente").value;
    const id_vehiculo = document.querySelector("#reservaIdVehiculo").value;

    if (!fecha_reserva || !tipo_transaccion || !id_cliente || !id_vehiculo) {
        showMsg("msgReserva", "Todos los campos son obligatorios", "error");
        return;
    }

    try {
        const response = await fetch(`${API_URL}/reservas`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fecha_reserva, tipo_transaccion, id_cliente, id_vehiculo })
        });

        if (response.ok) {
            showMsg("msgReserva", "Reserva guardada con éxito", "success");
            limpiarFormulario(["reservaFecha", "reservaTipo", "reservaIdCliente", "reservaIdVehiculo"]);
            cargarReservas();
        } else {
            showMsg("msgReserva", "Error al crear la reserva", "error");
        }
    } catch (error) {
        showMsg("msgReserva", "Error de conexión con el servidor", "error");
    }
}

async function eliminarReserva(id) {
    if (!confirm("¿Seguro que deseas eliminar esta reserva?")) return;
    try {
        const response = await fetch(`${API_URL}/reservas/${id}`, { method: "DELETE" });
        if (response.ok) {
            showMsg("msgReserva", "Reserva eliminada con éxito", "success");
            cargarReservas();
        }
    } catch (error) {
        showMsg("msgReserva", "Error al eliminar la reserva", "error");
    }
}


// UTILIDADES
function limpiarFormulario(campoIds) {
    campoIds.forEach(id => {
        const campo = document.querySelector(`#${id}`);
        campo.value = "";
    });
}

// EVENT LISTENERS
document.querySelector("#btnRegistrarVehiculo").addEventListener("click", registrarVehiculo);
document.querySelector("#btnCargarVehiculos").addEventListener("click", cargarVehiculos);

document.querySelector("#btnRegistrarCliente").addEventListener("click", registrarCliente);
document.querySelector("#btnCargarClientes").addEventListener("click", cargarClientes);

document.querySelector("#btnRegistrarReserva").addEventListener("click", registrarReserva);
document.querySelector("#btnCargarReservas").addEventListener("click", cargarReservas);

document.querySelector("#btnReservas").addEventListener("click", () => {
    cargarClientes();
    poblarSelectVehiculos();
    cargarReservas();
});

// Carga inicial
cargarVehiculos();