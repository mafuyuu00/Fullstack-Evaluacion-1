import { comunasPorRegion } from "./regiones.js";

const formulario = document.getElementById("formulario");
const boton = document.getElementById("boton_registrar");
const inputRut = document.getElementById("run");
const inputNombre = document.getElementById("nombre");
const inputApellidos = document.getElementById("apellidos");
const inputCorreo = document.getElementById("correo");
const inputContrasena = document.getElementById("contrasena");
const inputConfirmar = document.getElementById("confirmar");
const inputFechaNacimiento = document.getElementById("fecha-nacimiento");
const inputTelefono = document.getElementById("telefono");
const inputRegion = document.getElementById("region");
const inputComuna = document.getElementById("comuna");
const inputDireccion = document.getElementById("direccion");

const DOMINIOS_PERMITIDOS = /^(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

function escribirRegiones() {
    for (const nombreRegion of Object.keys(comunasPorRegion)) {
        const opcion = document.createElement("option");
        opcion.value = nombreRegion;
        opcion.textContent = nombreRegion;
        inputRegion.appendChild(opcion);
    }
}

function escribirComunas(nombreRegion) {
    inputComuna.innerHTML = "";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "-- Seleccione la comuna --";
    inputComuna.appendChild(opcionInicial);

    const comunas = comunasPorRegion[nombreRegion] || [];
    for (const nombreComuna of comunas) {
        const opcion = document.createElement("option");
        opcion.value = nombreComuna;
        opcion.textContent = nombreComuna;
        inputComuna.appendChild(opcion);
    }
}

function mostrarError(input, mensaje) {
    const elemento = document.getElementById(`error-${input.id}`);
    if (!elemento) return;

    elemento.textContent = mensaje;
    elemento.hidden = !mensaje;
}

function validarRutValor(valor) {
    const rut = valor.trim().toUpperCase();
    if (!/^[0-9]{6,8}[0-9K]$/.test(rut)) return false;

    const cuerpo = rut.slice(0, -1);
    const digitoIngresado = rut.slice(-1);
    let multiplicador = 2;
    let suma = 0;

    for (let indice = cuerpo.length - 1; indice >= 0; indice -= 1) {
        suma += Number(cuerpo[indice]) * multiplicador;
        multiplicador = multiplicador === 7 ? 2 : multiplicador + 1;
    }

    const resto = 11 - (suma % 11);
    const digitoCalculado = resto === 11 ? "0" : resto === 10 ? "K" : String(resto);
    return digitoIngresado === digitoCalculado;
}

function validarRut() {
    inputRut.addEventListener("input", () => {
        const valor = inputRut.value.trim();
        let mensaje = "";

        if (!valor) mensaje = "El RUN es obligatorio.";
        else if (!/^[0-9Kk]+$/.test(valor)) mensaje = "El RUN debe ingresarse sin puntos ni guion.";
        else if (valor.length < 7 || valor.length > 9) mensaje = "El RUN debe tener entre 7 y 9 caracteres.";
        else if (!validarRutValor(valor)) mensaje = "El dígito verificador del RUN no es válido.";

        inputRut.value = inputRut.value.toUpperCase();
        mostrarError(inputRut, mensaje);
        inputRut.setCustomValidity(mensaje);
        actualizarBoton();
    });
}

function validarNombre() {
    inputNombre.addEventListener("input", () => {
        const valor = inputNombre.value.trim();
        const valido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/.test(valor);
        const mensaje = !valor
            ? "El nombre es obligatorio."
            : !valido
                ? "El nombre solo debe contener letras y espacios."
                : "";

        mostrarError(inputNombre, mensaje);
        inputNombre.setCustomValidity(mensaje);
        actualizarBoton();
    });
}

function validarApellidos() {
    inputApellidos.addEventListener("input", () => {
        const valor = inputApellidos.value.trim();
        const valido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/.test(valor);
        const mensaje = !valor
            ? "Los apellidos son obligatorios."
            : !valido
                ? "Los apellidos solo deben contener letras y espacios."
                : "";

        mostrarError(inputApellidos, mensaje);
        inputApellidos.setCustomValidity(mensaje);
        actualizarBoton();
    });
}

function correoValido(valor) {
    const partes = valor.trim().toLowerCase().split("@");
    return partes.length === 2 && partes[0].length > 0 && DOMINIOS_PERMITIDOS.test(partes[1]);
}

function validarCorreo() {
    inputCorreo.addEventListener("input", () => {
        const valor = inputCorreo.value.trim();
        // Cambio solicitado: mensaje exacto para dominios no permitidos.
        const mensaje = !valor
            ? "El correo es obligatorio."
            : !correoValido(valor)
                ? "The only allowed domains are: @duoc.cl, @profesor.duoc.cl, @gmail.com."
                : "";

        mostrarError(inputCorreo, mensaje);
        inputCorreo.setCustomValidity(mensaje);
        actualizarBoton();
    });
}

function validarContrasena() {
    function comprobarContrasenas() {
        const contrasena = inputContrasena.value;
        const confirmar = inputConfirmar.value;
        const mensajeContrasena = !contrasena
            ? "La contraseña es obligatoria."
            : contrasena.length < 4 || contrasena.length > 10
                ? "La contraseña debe tener entre 4 y 10 caracteres."
                : "";
        const mensajeConfirmar = !confirmar
            ? "La confirmación es obligatoria."
            : contrasena !== confirmar
                ? "Las contraseñas no coinciden."
                : "";

        mostrarError(inputContrasena, mensajeContrasena);
        mostrarError(inputConfirmar, mensajeConfirmar);
        inputContrasena.setCustomValidity(mensajeContrasena);
        inputConfirmar.setCustomValidity(mensajeConfirmar);
        actualizarBoton();
    }

    inputContrasena.addEventListener("input", comprobarContrasenas);
    inputConfirmar.addEventListener("input", comprobarContrasenas);
}

function validarFechaNacimiento() {
    inputFechaNacimiento.addEventListener("input", () => {
        const valor = inputFechaNacimiento.value;
        let mensaje = "";

        if (valor) {
            const fechaNacimiento = new Date(`${valor}T00:00:00`);
            const hoy = new Date();
            let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const mes = hoy.getMonth() - fechaNacimiento.getMonth();
            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) edad -= 1;
            if (edad < 18) mensaje = "Debes ser mayor de 18 años.";
        }

        mostrarError(inputFechaNacimiento, mensaje);
        inputFechaNacimiento.setCustomValidity(mensaje);
        actualizarBoton();
    });
}

function validarTelefono() {
    inputTelefono.addEventListener("input", () => {
        const valor = inputTelefono.value.replace(/[^0-9+]/g, "");
        inputTelefono.value = valor;
        const mensaje = valor && !/^\+569[0-9]{8}$/.test(valor)
            ? "Ingrese un teléfono válido, por ejemplo +56912345678."
            : "";

        mostrarError(inputTelefono, mensaje);
        inputTelefono.setCustomValidity(mensaje);
        actualizarBoton();
    });
}

function validarDireccion() {
    inputDireccion.addEventListener("input", () => {
        const valor = inputDireccion.value.trim();
        const mensaje = !valor
            ? "La dirección es obligatoria."
            : !/^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,#-]+$/.test(valor)
                ? "La dirección contiene caracteres no válidos."
                : "";

        mostrarError(inputDireccion, mensaje);
        inputDireccion.setCustomValidity(mensaje);
        actualizarBoton();
    });
}

function cargarRegionesYComunas() {
    escribirRegiones();
    inputRegion.addEventListener("change", () => {
        escribirComunas(inputRegion.value);
        actualizarBoton();
    });
}

function actualizarBoton() {
    boton.disabled = !formulario.checkValidity();
}

function validarTodosAlCambiar() {
    const campos = [
        inputRut, inputNombre, inputApellidos, inputCorreo, inputContrasena,
        inputConfirmar, inputFechaNacimiento, inputTelefono, inputRegion,
        inputComuna, inputDireccion
    ];

    for (const campo of campos) {
        campo.addEventListener("input", actualizarBoton);
        campo.addEventListener("change", actualizarBoton);
    }
}

cargarRegionesYComunas();
validarRut();
validarNombre();
validarApellidos();
validarCorreo();
validarContrasena();
validarFechaNacimiento();
validarTelefono();
validarDireccion();
validarTodosAlCambiar();
actualizarBoton();

formulario.addEventListener("submit", event => {
    event.preventDefault();

    if (!formulario.checkValidity()) {
        formulario.reportValidity();
        return;
    }

    let mensaje = document.getElementById("mensaje-registro");
    if (!mensaje) {
        mensaje = document.createElement("p");
        mensaje.id = "mensaje-registro";
        mensaje.className = "exito";
        mensaje.setAttribute("role", "status");
        formulario.prepend(mensaje);
    }
    mensaje.textContent = "Registro validado correctamente. El alta requiere un backend.";
    mensaje.hidden = false;
});
