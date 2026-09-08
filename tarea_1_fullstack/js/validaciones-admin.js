/* ============================================================
   Huerto Verde - Validaciones del Administrador
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
    // Inicializar validaciones según la vista actual
    if (document.getElementById('run')) initValidacionUsuarios();
    if (document.getElementById('codigo')) initValidacionProductos();
});

/* ---------- 1. Mantenedor de Usuarios ---------- */
function initValidacionUsuarios() {
    const formUsuario = document.querySelector('form');
    
    // a. Validación de dominios de correo permitidos
    const inputCorreo = document.getElementById('correo');
    if (inputCorreo) {
        inputCorreo.addEventListener('input', () => {
            const dominiosValidos = ['@duoc.cl', '@profesor.duoc.cl', '@gmail.com'];
            const valor = inputCorreo.value.toLowerCase();
            const esValido = dominiosValidos.some(dominio => valor.endsWith(dominio));
            
            mostrarError(inputCorreo, esValido ? '' : 'El correo debe terminar en @duoc.cl, @profesor.duoc.cl o @gmail.com');
            // Usamos setCustomValidity para bloquear el submit nativo del formulario
            inputCorreo.setCustomValidity(esValido ? '' : 'Dominio inválido');
        });
    }

    // b. Validación del RUN (sin puntos ni guion, entre 7 y 9 caracteres)
    const inputRun = document.getElementById('run');
    if (inputRun && !inputRun.readOnly) {
        inputRun.addEventListener('input', () => {
            const valor = inputRun.value;
            // Expresión regular: solo números seguidos opcionalmente por una K
            const formatoValido = /^[0-9]+[0-9Kk]?$/.test(valor);
            const largoValido = valor.length >= 7 && valor.length <= 9;
            
            let mensajeError = '';
            if (!formatoValido) mensajeError = 'El RUN debe ingresarse sin puntos ni guion.';
            else if (!largoValido) mensajeError = 'El RUN debe tener entre 7 y 9 caracteres.';
            
            mostrarError(inputRun, mensajeError);
            inputRun.setCustomValidity(mensajeError);
        });
    }

    // c. Dinamismo Región -> Comuna (Simulado con un arreglo)
    const selectRegion = document.getElementById('region');
    const selectComuna = document.getElementById('comuna');
    
    const comunasPorRegion = {
        '13': [{ val: '13101', text: 'Santiago' }, { val: '13123', text: 'Maipú' }],
        '09': [{ val: '09101', text: 'Temuco' }, { val: '09112', text: 'Padre Las Casas' }],
        '16': [{ val: '16101', text: 'Chillán' }],
        '07': [{ val: '07101', text: 'Talca' }, { val: '07401', text: 'Linares' }],
        '05': [{ val: '05101', text: 'Valparaíso' }, { val: '05109', text: 'Viña del Mar' }]
    };

    if (selectRegion && selectComuna) {
        selectRegion.addEventListener('change', (e) => {
            const regionSeleccionada = e.target.value;
            
            // Limpiar comunas actuales
            selectComuna.innerHTML = '<option value="">-- Seleccione la comuna --</option>';
            
            if (regionSeleccionada && comunasPorRegion[regionSeleccionada]) {
                comunasPorRegion[regionSeleccionada].forEach(comuna => {
                    const option = document.createElement('option');
                    option.value = comuna.val;
                    option.textContent = comuna.text;
                    selectComuna.appendChild(option);
                });
            }
        });
    }
}

/* ---------- 2. Mantenedor de Productos ---------- */
function initValidacionProductos() {
    const formProducto = document.querySelector('form');

    // a. Validación de Precio (mínimo 0)
    const inputPrecio = document.getElementById('precio');
    if (inputPrecio) {
        inputPrecio.addEventListener('input', () => {
            const valor = parseFloat(inputPrecio.value);
            const esValido = valor >= 0;
            mostrarError(inputPrecio, esValido ? '' : 'El precio no puede ser negativo.');
            inputPrecio.setCustomValidity(esValido ? '' : 'Precio inválido');
        });
    }

    // b. Contador de caracteres para la descripción
    const inputDesc = document.getElementById('descripcion');
    const spanContador = document.querySelector('span[data-contador="descripcion"]');
    if (inputDesc && spanContador) {
        inputDesc.addEventListener('input', () => {
            const restantes = 500 - inputDesc.value.length;
            spanContador.textContent = restantes;
        });
        // Inicializar el contador al cargar la página
        spanContador.textContent = 500 - inputDesc.value.length;
    }
    
    // c. Control de stock vs stock crítico al intentar guardar
    if (formProducto) {
        formProducto.addEventListener('submit', (e) => {
            const stock = parseInt(document.getElementById('stock').value, 10);
            const stockCriticoInput = document.getElementById('stock-critico').value;
            const stockCritico = stockCriticoInput ? parseInt(stockCriticoInput, 10) : -1;

            if (stockCritico !== -1 && stock <= stockCritico) {
                // Solo mostramos una alerta, no bloqueamos el submit según requerimientos
                alert(`Atención: El stock (${stock}) está por debajo o igual al nivel crítico (${stockCritico}).`);
            }
        });
    }
}

/* ---------- Funciones Utilitarias ---------- */
// Inyecta el mensaje en el párrafo con id="error-nombredelcampo"
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