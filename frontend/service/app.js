const API_USERS = "http://localhost:3001/users"
document.addEventListener("DOMContentLoaded", getUsers);

// ------------------ GET USERS ------------------
async function getUsers() {
    try {
        const users = await fetch(API_USERS);

        if (!users.ok) {
            const errBody = await res.json().catch(() => null);
            console.error('Error en GET:', res.status, errBody);
            return;
        }

        const data = await users.json();

        const user = document.getElementById("datos");
        user.innerHTML = "";

        data.forEach((u, i) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${i + 1}</td>
                <td>${u.name}</td>
                <td>${u.email}</td>
                <td>${u.address}</td>
                <td>${u.phone}</td>
                <td>${formatearFecha(u.created_at)}</td>
                <td>${formatearFecha(u.updated_at)}</td>
                <td>
                    <button class="btn btn-danger" onclick="deleteUser(${u.id})">Eliminar</button>
                    <button class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" onclick="putUser(${u.id})">Actualizar</button>
                </td>
            `;
            user.appendChild(row);
        });

    } catch (err) {
        console.error("Error en la petición:", err);
    }
}

// ------------------ POST: AGREGAR USUARIO ------------------
const addForm = document.getElementById("crud");
addForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const direccion = document.getElementById("direccion");
    const telefono = document.getElementById("telefono");

    if (nombre.value === "" || correo.value === "" || direccion.velue === "" || telefono.value === "") {
        Swal.fire({
            title: "Campos vacios!",
            icon: "warning",
            draggable: true,
            timer: 1500
        });
    } else {
        Swal.fire({
            title: "Usuario registrado",
            icon: "success",
            draggable: true,
            timer: 2000
        });

        // Map form fields to the API expected keys
        const nuevoUsuario = {
            name: nombre.value,
            email: correo.value,
            address: direccion.value,
            phone: telefono.value
        };

        try {
            const res = await fetch(API_USERS, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(nuevoUsuario)
            });

            if (!res.ok) {
                const errBody = await res.json().catch(() => null);
                console.error('Error en POST:', res.status, errBody);
                return;
            }

            const data = await res.json();
            e.target.reset();  // limpia el formulario
            getUsers();        // recarga la tabla

        } catch (err) {
            console.error("Error en la petición:", err);
        }
    }
});

//------------------ PUT: ACTULIZANDO USUSARIO ----------------
async function putUser(id) {
    const res = await fetch(`${API_USERS}/${id}`);
    const user = await res.json();

    document.getElementById("idEdit").value = user.id;
    const nombre = document.getElementById("nombreUpdate");
    const correo = document.getElementById("correoUpdate");
    const direccion = document.getElementById("direccionUpdate");
    const telefono = document.getElementById("telefonoUpdate");

    nombre.value = user.name;
    correo.value = user.email;
    direccion.value = user.address;
    telefono.value = user.phone;
}
const formUpdate = document.getElementById("crudUpdate");
formUpdate.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("idEdit").value;

    const ActulizarUsuario = {
        name: document.getElementById("nombreUpdate").value,
        email: document.getElementById("correoUpdate").value,
        address: document.getElementById("direccionUpdate").value,
        phone: document.getElementById("telefonoUpdate").value
    };

    try {
        const res = await fetch(`${API_USERS}/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(ActulizarUsuario)
        });

        if (!res.ok) {
            console.error("Error al actualizar:", res.status);
            return;
        }

        Swal.fire({
            title: "Usuario actualizado!",
            icon: "success",
            draggable: true,
            timer: 2000
        });

        // Cerrar modal Bootstrap
        const modal = bootstrap.Modal.getInstance(document.getElementById("exampleModal"));
        modal.hide();

        formUpdate.reset();
        getUsers();

    } catch (err) {
        console.error("Error en PUT:", err);
    }
});

// --------------- DELETE: ELIMINANDO USUARIO --------------------
async function deleteUser(id) {

    const result = await Swal.fire({
        title: "¿Seguro que deseas eliminar este usuario?",
        text: "Esta acción no se puede deshacer",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "eliminar",
        cancelButtonText: "Cancelar",
        reverseButtons: true
    });

    // Si el usuario cancela, no elimina nada
    if (!result.isConfirmed) {
        return;
    }

    try {
        const res = await fetch(`${API_USERS}/${id}`, {
            method: "DELETE",
        });

        if (!res.ok) {
            console.error("Error al eliminar:", res.status);
            return;
        }

        Swal.fire({
            title: "Eliminado!",
            text: "El usuario ha sido eliminado correctamente.",
            icon: "success",
            timer: 1500,
            showConfirmButton: false
        });

        getUsers(); // recargar tabla

    } catch (err) {
        console.error(err);
    }
}

//-------------- Cancelar registro ----------------------------
document.getElementById("btnCancel").addEventListener("click", (e) => {
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const direccion = document.getElementById("direccion");
    const telefono = document.getElementById("telefono");

    if (nombre.value === "" || correo.value === "" || direccion.velue === "" || telefono.value === "") {
        Swal.fire({
            title: "Campos vacios!",
            icon: "warning",
            draggable: true,
            timer: 1500
        });
    } else {
        Swal.fire({
            title: "Registro cancelado",
            icon: "warning",
            draggable: true,
            timer: 1500
        });
        document.getElementById("crud").reset();
    }
});

// ------------------ Formatear fecha -----------------
function formatearFecha(fechaISO) {
    const fecha = new Date(fechaISO);
    return fecha.toLocaleString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
    });
}

// ------------------ Search ------------------------
const buscar = document.getElementById('buscar');
buscar.addEventListener('input', () => {
    const filter = buscar.value.trim().toLowerCase();

    if (filter === "") {
        getUsers();
        return;
    }

    filtrarUsuarios(filter);
});

function filtrarUsuarios(texto) {
    const tabla = document.getElementById('datos');
    const filas = tabla.getElementsByTagName('tr');

    for (let fila of filas) {
        const contenido = fila.textContent.toLowerCase();
        fila.style.display = contenido.includes(texto) ? "" : "none";
    }
}