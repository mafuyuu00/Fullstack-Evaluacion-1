import { comunasPorRegion } from "./regiones.js";

const formulario = document.getElementById("formulario");
const boton = document.getElementById("boton_registrar");


const inputRut = document.getElementById("run")
const inputNombre = document.getElementById("nombre")
const inputApellidos = document.getElementById("apellidos")
const inputCorreo = document.getElementById("correo")
const inputContrasena = document.getElementById("contrasena")
const inputConfirmar = document.getElementById("confirmar")
const inputFechaNacimiento = document.getElementById("fecha-nacimiento")
const inpuTelefono = document.getElementById("telefono")
const inputRegion = document.getElementById("region")
const inputComuna = document.getElementById("comuna")
const inputDireccion = document.getElementById("direccion")


function escribirRegiones(){
    for (const nombreRegion in comunasPorRegion){
        const option = document.createElement("option");

        option.value = nombreRegion;
        option.textContent = nombreRegion

        inputRegion.appendChild(option)
    }
}

function escribirComunas(nombreRegion){
    inputComuna.innerHTML = "";

    const opcionInicial = document.createElement("option");
    opcionInicial.value = "";
    opcionInicial.textContent = "-- Seleccione la comuna --";

    inputComuna.appendChild(opcionInicial);

    for (const nombreComuna of comunasPorRegion[nombreRegion]){

        const option = document.createElement("option");

        option.value = nombreComuna;
        option.textContent = nombreComuna;

        inputComuna.appendChild(option);
    }
}

function cargarRegionesYComunas(){
    escribirRegiones();
    inputRegion.addEventListener("change", function(){
        escribirComunas(inputRegion.value);
        actualizarBoton()
    })
}

function mostrarError(inputTarget, mensaje) {
    const idError = `error-${inputTarget.id}`;
    const pError = document.getElementById(idError);
    if (pError) {
        if (mensaje) {
            pError.textContent = mensaje;
            pError.hidden = false;
        } else {
            pError.textContent = '';
            pError.hidden = true;
        }
    }
}

function validarRut(){
    if (inputRut && !inputRut.readOnly) {
        inputRut.addEventListener("input", () => {
            const valor = inputRut.value;
            const formatoValido = /^[0-9]+[0-9Kk]?$/.test(valor);
            const largoValido = valor.length >= 7 && valor.length <= 9;
            
            let mensajeError = '';
            if (!formatoValido) mensajeError = 'El RUN debe ingresarse sin puntos ni guion.';
            else if (!largoValido) mensajeError = 'El RUN debe tener entre 7 y 9 caracteres.';
            
            mostrarError(inputRut, mensajeError);
            inputRut.setCustomValidity(mensajeError);
            actualizarBoton()
        });
    }
}

function validarNombre(){
    inputNombre.addEventListener("input", () => {
        const valor = inputNombre.value.trim()
        const nombreValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/.test(valor);

        let mensajeError = ""
        if(!nombreValido) mensajeError = 'El nombre solo debe contener letras y espacios.'
        
        mostrarError(inputNombre, mensajeError)
        inputNombre.setCustomValidity(mensajeError)
        actualizarBoton()
    })
}

function validarApellidos(){
    inputApellidos.addEventListener("input", () => {
        const valor = inputApellidos.value.trim()
        const apellidoValido = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+(?:\s+[A-Za-zÁÉÍÓÚáéíóúÑñÜü]+)*$/.test(valor);

        let mensajeError = ""
        if(!apellidoValido) mensajeError = 'El nombre solo debe contener letras y espacios.'
        
        mostrarError(inputApellidos, mensajeError)
        inputApellidos.setCustomValidity(mensajeError)
        actualizarBoton()
    })
}

function validarCorreo(){
    inputCorreo.addEventListener("input", () => {
        const valor = inputCorreo.value.trim();
        const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

        let mensajeError = "";

        if (!correoValido) {
            mensajeError = "Ingrese un correo electrónico válido.";
        }

        mostrarError(inputCorreo, mensajeError);
        inputCorreo.setCustomValidity(mensajeError);
        actualizarBoton()
    });
}

function validarContrasena(){
    function comprobarContrasenas(){
        const contrasena = inputContrasena.value;
        const confirmar = inputConfirmar.value;

        let mensajeError = "";

        if (contrasena !== confirmar) {
            mensajeError = "Las contraseñas no coinciden.";
        }

        mostrarError(inputConfirmar, mensajeError);
        inputConfirmar.setCustomValidity(mensajeError);
        actualizarBoton()
    }

    inputContrasena.addEventListener("input", comprobarContrasenas);
    inputConfirmar.addEventListener("input", comprobarContrasenas);
}


function validarFechaNacimiento(){
    inputFechaNacimiento.addEventListener("input", () => {
        const valor = inputFechaNacimiento.value;

        let mensajeError = "";

        if (valor) {
            const fechaNacimiento = new Date(valor);
            const hoy = new Date();

            let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const mes = hoy.getMonth() - fechaNacimiento.getMonth();

            if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                edad--;
            }

            if (edad < 18) {
                mensajeError = "Debes ser mayor de 18 años.";
            }
        }

        mostrarError(inputFechaNacimiento, mensajeError);
        inputFechaNacimiento.setCustomValidity(mensajeError);
        actualizarBoton()
    });
}

function validarTelefono(){

    inpuTelefono.addEventListener("input", () => {

        let valor = inpuTelefono.value;

        // Elimina letras y caracteres no permitidos
        valor = valor.replace(/[^0-9+]/g, "");

        inpuTelefono.value = valor;

        const telefonoValido = /^\+569[0-9]{8}$/.test(valor);

        let mensajeError = "";

        if (valor !== "" && !telefonoValido) {
            mensajeError = "Ingrese un teléfono válido, por ejemplo +56912345678.";
        }

        mostrarError(inpuTelefono, mensajeError);

        inpuTelefono.setCustomValidity(mensajeError);

        actualizarBoton();
    });
}

function validarDireccion(){
    inputDireccion.addEventListener("input", () => {
        const valor = inputDireccion.value.trim();

        const direccionValida = /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü0-9\s.,#-]+$/.test(valor);

        let mensajeError = "";

        if (valor === "") {
            mensajeError = "La dirección es obligatoria.";
        } else if (!direccionValida) {
            mensajeError = "La dirección contiene caracteres no válidos.";
        }

        mostrarError(inputDireccion, mensajeError);
        inputDireccion.setCustomValidity(mensajeError);
        actualizarBoton()
    });

    
}

function validarTodosAlCambiar() {

    const campos = [
        inputRut,
        inputNombre,
        inputApellidos,
        inputCorreo,
        inputContrasena,
        inputConfirmar,
        inputFechaNacimiento,
        inpuTelefono,
        inputRegion,
        inputComuna,
        inputDireccion
    ];

    campos.forEach(campo => {
        campo.addEventListener("input", () => {
            validarFormularioInicial();
            actualizarBoton();
        });

        campo.addEventListener("change", () => {
            validarFormularioInicial();
            actualizarBoton();
        });
    });
}

function actualizarBoton() {
    console.log(formulario.checkValidity());
    boton.disabled = !formulario.checkValidity();
}


/**Por si preguntan en la prueba, lo hice así porque se ve más limpio el código, de hecho podríamos dejar todas las funciones de arriba en
una carpeta para las funciones desordenadas y traer solo la funcion que nos ejecute todas las funciones de validación MS*/ 
cargarRegionesYComunas()
validarRut()
validarNombre()
validarApellidos()
validarCorreo()
validarContrasena()
validarFechaNacimiento()
validarTelefono()
validarDireccion()
validarTodosAlCambiar()