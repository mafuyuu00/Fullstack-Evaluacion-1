const formulario = document.getElementById("formulario-login");
const inputCorreo = document.getElementById("correo");
const inputContrasena = document.getElementById("contrasena");
const mensajeExito = document.getElementById("mensaje-login");

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

function validarCorreo() {
    const valor = inputCorreo.value.trim();
    let mensaje = "";

    if (!valor) mensaje = "El correo es obligatorio.";
    else if (!correoValido(valor)) mensaje = "Use un correo @duoc.cl, @profesor.duoc.cl o @gmail.com.";

    mostrarError(inputCorreo, mensaje);
    inputCorreo.setCustomValidity(mensaje);
    return !mensaje;
}

function validarContrasena() {
    const valor = inputContrasena.value;
    let mensaje = "";

    if (!valor) mensaje = "La contraseña es obligatoria.";
    else if (valor.length < 4 || valor.length > 10) mensaje = "La contraseña debe tener entre 4 y 10 caracteres.";

    mostrarError(inputContrasena, mensaje);
    inputContrasena.setCustomValidity(mensaje);
    return !mensaje;
}

function validarFormulario() {
    const correoCorrecto = validarCorreo();
    const contrasenaCorrecta = validarContrasena();
    return correoCorrecto && contrasenaCorrecta && formulario.checkValidity();
}

if (formulario && inputCorreo && inputContrasena) {
    inputCorreo.addEventListener("input", validarFormulario);
    inputContrasena.addEventListener("input", validarFormulario);

    formulario.addEventListener("submit", event => {
        event.preventDefault();
        if (!validarFormulario()) return;

        if (document.getElementById("recordar").checked) {
            localStorage.setItem("correo-recordado", inputCorreo.value.trim());
        } else {
            localStorage.removeItem("correo-recordado");
        }

        if (mensajeExito) {
            mensajeExito.textContent = "Datos válidos. La autenticación requiere un backend.";
            mensajeExito.hidden = false;
        }
    });

    validarFormulario();
}
