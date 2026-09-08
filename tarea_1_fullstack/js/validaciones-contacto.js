const formulario = document.getElementById("formulario-contacto");
const inputNombre = document.getElementById("nombre");
const inputCorreo = document.getElementById("correo");
const inputComentario = document.getElementById("comentario");
const contador = document.querySelector('[data-contador="comentario"]');
const mensajeExito = document.getElementById("mensaje-contacto");

const DOMINIOS_PERMITIDOS = /^(?:duoc\.cl|profesor\.duoc\.cl|gmail\.com)$/i;

function mostrarError(input, mensaje) {
    const elemento = document.getElementById(`error-${input.id}`);
    if (!elemento) return;

    elemento.textContent = mensaje;
    elemento.hidden = !mensaje;
}

function correoValido(valor) {
    const partes = valor.trim().toLowerCase().split("@");
    return partes.length === 2 && partes[0].length > 0 && DOMINIOS_PERMITIDOS.test(partes[1]);
}

function validarNombre() {
    const valor = inputNombre.value.trim();
    const mensaje = !valor
        ? "El nombre es obligatorio."
        : valor.length > 100
            ? "El nombre no puede superar 100 caracteres."
            : "";

    mostrarError(inputNombre, mensaje);
    inputNombre.setCustomValidity(mensaje);
    return !mensaje;
}

function validarCorreo() {
    const valor = inputCorreo.value.trim();
    const mensaje = valor && !correoValido(valor)
        ? "Use un correo @duoc.cl, @profesor.duoc.cl o @gmail.com."
        : "";

    mostrarError(inputCorreo, mensaje);
    inputCorreo.setCustomValidity(mensaje);
    return !mensaje;
}

function validarComentario() {
    const valor = inputComentario.value;
    const mensaje = !valor.trim()
        ? "El comentario es obligatorio."
        : valor.length > 500
            ? "El comentario no puede superar 500 caracteres."
            : "";

    mostrarError(inputComentario, mensaje);
    inputComentario.setCustomValidity(mensaje);
    if (contador) contador.textContent = Math.max(0, 500 - valor.length);
    return !mensaje;
}

function validarFormulario() {
    const nombreCorrecto = validarNombre();
    const correoCorrecto = validarCorreo();
    const comentarioCorrecto = validarComentario();
    return nombreCorrecto && correoCorrecto && comentarioCorrecto && formulario.checkValidity();
}

if (formulario && inputNombre && inputCorreo && inputComentario) {
    inputNombre.addEventListener("input", validarFormulario);
    inputCorreo.addEventListener("input", validarFormulario);
    inputComentario.addEventListener("input", validarFormulario);

    formulario.addEventListener("submit", event => {
        event.preventDefault();
        if (!validarFormulario()) return;

        if (mensajeExito) {
            mensajeExito.textContent = "Mensaje validado correctamente. Este formulario todavía no envía datos a un servidor.";
            mensajeExito.hidden = false;
        }
    });

    validarFormulario();
}
