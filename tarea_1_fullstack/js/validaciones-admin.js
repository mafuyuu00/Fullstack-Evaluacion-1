import { comunasPorRegion } from "./regiones.js";

// I left these validations reusable across the four admin forms.

/* ---------- Campos del mantenedor de productos ---------- */
const inputCodigo = document.getElementById("codigo");
const inputNombreProducto = document.getElementById("nombre");
const inputDescripcion = document.getElementById("descripcion");
const inputPrecio = document.getElementById("precio");
const inputStock = document.getElementById("stock");
const inputStockCritico = document.getElementById("stock-critico");
const inputCategoria = document.getElementById("categoria");

/* ---------- Campos del mantenedor de usuarios ---------- */
const inputRun = document.getElementById("run");
const inputApellidos = document.getElementById("apellidos");
const inputCorreo = document.getElementById("correo");
const inputTipoUsuario = document.getElementById("tipo-usuario");
const inputRegion = document.getElementById("region");
const inputComuna = document.getElementById("comuna");
const inputDireccion = document.getElementById("direccion");
const inputContrasena = document.getElementById("contrasena");
const inputConfirmar = document.getElementById("confirmar");

/* Dominios de correo aceptados por el cliente */
const dominiosValidos = ["@duoc.cl", "@profesor.duoc.cl", "@gmail.com"];


// I left this helper to show validation messages beside each field.
function mostrarError(inputTarget, mensaje) {
    const idError = `error-${inputTarget.id}`;
    const pError = document.getElementById(idError);
    if (pError) {
        if (mensaje) {
            pError.textContent = mensaje;
            pError.hidden = false;
        } else {
            pError.textContent = "";
            pError.hidden = true;
        }
    }
}


// I left this helper to populate regions and their matching communes.
function escribirRegiones() {
    for (const nombreRegion in comunasPorRegion) {
        const option = document.createElement("option");

        option.value = nombreRegion;
        option.textContent = nombreRegion;

        inputRegion.appendChild(option);
    }
}

function escribirComunas(nombreRegion) {
    inputComuna.innerHTML = "";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "-- Seleccione la comuna --";

    inputComuna.appendChild(opcionInicial);

    if (!comunasPorRegion[nombreRegion]) return;

    for (const nombreComuna of comunasPorRegion[nombreRegion]) {
        const option = document.createElement("option");

        option.value = nombreComuna;
        option.textContent = nombreComuna;

        inputComuna.appendChild(option);
    }
}

function cargarRegionesYComunas() {
    if (!inputRegion || !inputComuna) return;

    escribirRegiones();

    inputRegion.addEventListener("change", function () {
        escribirComunas(inputRegion.value);
        mostrarError(inputRegion, inputRegion.value === "" ? "Debe seleccionar una región." : "");
    });

    const regionGuardada = inputRegion.dataset.regionGuardada;
    const comunaGuardada = inputComuna.dataset.comunaGuardada;

    if (regionGuardada && comunasPorRegion[regionGuardada]) {
        inputRegion.value = regionGuardada;
        escribirComunas(regionGuardada);
        if ([...inputComuna.options].some(option => option.value === comunaGuardada)) {
            inputComuna.value = comunaGuardada;
        }
    }
}


// I left this section to validate user-maintenance fields.

// I left this calculation to verify the RUN check digit.
function calcularDigitoVerificador(cuerpo) {
    let suma = 0;
    let multiplo = 2;

    for (let i = cuerpo.length - 1; i >= 0; i--) {
        suma += Number(cuerpo[i]) * multiplo;
        multiplo = multiplo === 7 ? 2 : multiplo + 1;
    }

    const resto = 11 - (suma % 11);

    if (resto === 11) return "0";
    if (resto === 10) return "K";
    return String(resto);
}

function validarRun() {
    // I left the RUN unchanged when editing an existing user.
    if (!inputRun || inputRun.readOnly) return;

    inputRun.addEventListener("input", () => {
        const valor = inputRun.value.trim().toUpperCase();
        const formatoValido = /^[0-9]+[0-9K]$/.test(valor);
        const largoValido = valor.length >= 7 && valor.length <= 9;

        let mensajeError = "";

        if (valor === "") {
            mensajeError = "El RUN es obligatorio.";
        } else if (!formatoValido) {
            mensajeError = "El RUN debe ingresarse sin puntos ni guion. Ejemplo: 19011022K";
        } else if (!largoValido) {
            mensajeError = "El RUN debe tener entre 7 y 9 caracteres.";
        } else {
            const cuerpo = valor.slice(0, -1);
            const digitoIngresado = valor.slice(-1);
            const digitoEsperado = calcularDigitoVerificador(cuerpo);

            if (digitoIngresado !== digitoEsperado) {
                mensajeError = `El RUN no es válido, el dígito verificador debería ser ${digitoEsperado}.`;
            }
        }

        mostrarError(inputRun, mensajeError);
        inputRun.setCustomValidity(mensajeError);
    });
}

function validarNombreUsuario() {
    if (!inputRun || !inputNombreProducto) return;

    /* En la vista de usuarios el campo "nombre" tiene max 50 */
    inputNombreProducto.addEventListener("input", () => {
        const valor = inputNombreProducto.value.trim();

        let mensajeError = "";

        if (valor === "") {
            mensajeError = "El nombre es obligatorio.";
        } else if (valor.length > 50) {
            mensajeError = "El nombre no puede superar los 50 caracteres.";
        }

        mostrarError(inputNombreProducto, mensajeError);
        inputNombreProducto.setCustomValidity(mensajeError);
    });
}

function validarApellidos() {
    if (!inputApellidos) return;

    inputApellidos.addEventListener("input", () => {
        const valor = inputApellidos.value.trim();

        let mensajeError = "";

        if (valor === "") {
            mensajeError = "Los apellidos son obligatorios.";
        } else if (valor.length > 100) {
            mensajeError = "Los apellidos no pueden superar los 100 caracteres.";
        }

        mostrarError(inputApellidos, mensajeError);
        inputApellidos.setCustomValidity(mensajeError);
    });
}

function validarCorreo() {
    if (!inputCorreo) return;

    inputCorreo.addEventListener("input", () => {
        const valor = inputCorreo.value.trim().toLowerCase();

        let mensajeError = "";

        if (valor === "") {
            mensajeError = "El correo es obligatorio.";
        } else if (valor.length > 100) {
            mensajeError = "El correo no puede superar los 100 caracteres.";
        } else if (!dominiosValidos.some(dominio => valor.endsWith(dominio))) {
            mensajeError = "El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com";
        }

        mostrarError(inputCorreo, mensajeError);
        inputCorreo.setCustomValidity(mensajeError);
    });
}

function validarTipoUsuario() {
    if (!inputTipoUsuario) return;

    inputTipoUsuario.addEventListener("change", () => {
        const mensajeError = inputTipoUsuario.value === ""
            ? "Debe seleccionar el tipo de usuario."
            : "";

        mostrarError(inputTipoUsuario, mensajeError);
        inputTipoUsuario.setCustomValidity(mensajeError);
    });
}

function validarDireccion() {
    if (!inputDireccion) return;

    inputDireccion.addEventListener("input", () => {
        const valor = inputDireccion.value.trim();

        let mensajeError = "";

        if (valor === "") {
            mensajeError = "La dirección es obligatoria.";
        } else if (valor.length > 300) {
            mensajeError = "La dirección no puede superar los 300 caracteres.";
        }

        mostrarError(inputDireccion, mensajeError);
        inputDireccion.setCustomValidity(mensajeError);
    });
}

function validarContrasena() {
    if (!inputContrasena || !inputConfirmar) return;

    function comprobarContrasenas() {
        const contrasena = inputContrasena.value;
        const confirmar = inputConfirmar.value;

        let mensajeErrorLargo = "";
        let mensajeErrorConfirmar = "";

        /* En "editar usuario" el campo va vacío si no se quiere cambiar */
        if (contrasena !== "" && (contrasena.length < 4 || contrasena.length > 10)) {
            mensajeErrorLargo = "La contraseña debe tener entre 4 y 10 caracteres.";
        }

        if (contrasena !== confirmar) {
            mensajeErrorConfirmar = "Las contraseñas no coinciden.";
        }

        mostrarError(inputContrasena, mensajeErrorLargo);
        inputContrasena.setCustomValidity(mensajeErrorLargo);

        mostrarError(inputConfirmar, mensajeErrorConfirmar);
        inputConfirmar.setCustomValidity(mensajeErrorConfirmar);
    }

    inputContrasena.addEventListener("input", comprobarContrasenas);
    inputConfirmar.addEventListener("input", comprobarContrasenas);
}


// I left this section to validate product fields.

function validarCodigo() {
    if (!inputCodigo) return;

    inputCodigo.addEventListener("input", () => {
        const valor = inputCodigo.value.trim();

        let mensajeError = "";

        if (valor === "") {
            mensajeError = "El código del producto es obligatorio.";
        } else if (valor.length < 3) {
            mensajeError = "El código debe tener al menos 3 caracteres.";
        }

        mostrarError(inputCodigo, mensajeError);
        inputCodigo.setCustomValidity(mensajeError);
    });
}

function validarNombreProducto() {
    // I left this check only for product forms.
    if (!inputCodigo || !inputNombreProducto) return;

    inputNombreProducto.addEventListener("input", () => {
        const valor = inputNombreProducto.value.trim();

        let mensajeError = "";

        if (valor === "") {
            mensajeError = "El nombre del producto es obligatorio.";
        } else if (valor.length > 100) {
            mensajeError = "El nombre no puede superar los 100 caracteres.";
        }

        mostrarError(inputNombreProducto, mensajeError);
        inputNombreProducto.setCustomValidity(mensajeError);
    });
}

function validarDescripcion() {
    if (!inputDescripcion) return;

    const spanContador = document.getElementById("contador-descripcion");

    function revisarDescripcion() {
        const largo = inputDescripcion.value.length;
        const restantes = 500 - largo;

        if (spanContador) {
            spanContador.textContent = restantes;
        }

        /* La descripción es opcional, sólo se limita el largo */
        const mensajeError = largo > 500
            ? "La descripción no puede superar los 500 caracteres."
            : "";

        mostrarError(inputDescripcion, mensajeError);
        inputDescripcion.setCustomValidity(mensajeError);
    }

    inputDescripcion.addEventListener("input", revisarDescripcion);
    revisarDescripcion();
}

function validarPrecio() {
    if (!inputPrecio) return;

    inputPrecio.addEventListener("input", () => {
        const valor = inputPrecio.value.trim();
        const numero = Number(valor);

        let mensajeError = "";

        if (valor === "") {
            mensajeError = "El precio es obligatorio.";
        } else if (Number.isNaN(numero)) {
            mensajeError = "El precio debe ser un número.";
        } else if (numero < 0) {
            mensajeError = "El precio no puede ser negativo.";
        }

        mostrarError(inputPrecio, mensajeError);
        inputPrecio.setCustomValidity(mensajeError);

        /* Un precio 0 es válido: se considera producto FREE */
        if (mensajeError === "" && numero === 0) {
            mostrarError(inputPrecio, "");
        }
    });
}

function validarStock() {
    if (!inputStock) return;

    inputStock.addEventListener("input", () => {
        const valor = inputStock.value.trim();
        const numero = Number(valor);

        let mensajeError = "";

        if (valor === "") {
            mensajeError = "El stock es obligatorio.";
        } else if (!Number.isInteger(numero)) {
            mensajeError = "El stock debe ser un número entero.";
        } else if (numero < 0) {
            mensajeError = "El stock no puede ser negativo.";
        }

        mostrarError(inputStock, mensajeError);
        inputStock.setCustomValidity(mensajeError);

        revisarStockCritico();
    });
}

// I left low stock as a warning instead of a blocking error.
function revisarStockCritico() {
    if (!inputStock || !inputStockCritico) return;

    const stock = Number(inputStock.value);
    const critico = Number(inputStockCritico.value);

    if (inputStockCritico.value.trim() === "" || inputStock.value.trim() === "") {
        mostrarError(inputStockCritico, "");
        return;
    }

    if (!Number.isInteger(critico) || critico < 0) {
        mostrarError(inputStockCritico, "El stock crítico debe ser un número entero igual o mayor a 0.");
        inputStockCritico.setCustomValidity("Stock crítico inválido");
        return;
    }

    inputStockCritico.setCustomValidity("");

    if (stock <= critico) {
        mostrarError(inputStockCritico, `Atención: el stock (${stock}) es igual o inferior al stock crítico (${critico}).`);
    } else {
        mostrarError(inputStockCritico, "");
    }
}

function validarStockCritico() {
    if (!inputStockCritico) return;

    inputStockCritico.addEventListener("input", revisarStockCritico);
    revisarStockCritico();
}

function validarCategoria() {
    if (!inputCategoria) return;

    inputCategoria.addEventListener("change", () => {
        const mensajeError = inputCategoria.value === ""
            ? "Debe seleccionar una categoría."
            : "";

        mostrarError(inputCategoria, mensajeError);
        inputCategoria.setCustomValidity(mensajeError);
    });
}


// I left each validator safe to run on any admin form.
cargarRegionesYComunas();

validarRun();
validarNombreUsuario();
validarApellidos();
validarCorreo();
validarTipoUsuario();
validarDireccion();
validarContrasena();

validarCodigo();
validarNombreProducto();
validarDescripcion();
validarPrecio();
validarStock();
validarStockCritico();
validarCategoria();
