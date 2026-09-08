const CLAVE_CARRITO = "carrito";
const DESPACHO = 2990;

// ----------------------- Lectura, limpieza y persistencia

function cantidadValida(producto, cantidad) {
    return Number.isInteger(cantidad) && cantidad > 0 && cantidad <= producto.stock;
}  // fin -> revisar q los productos sean ints

function normalizarCarrito(valor) {
    if (!Array.isArray(valor)) return [];

    return valor.reduce((carrito, linea) => {
        const producto = buscarProducto(linea && linea.codigo);
        const cantidad = Number.parseInt(linea && linea.cantidad, 10);

        if (!producto || !cantidadValida(producto, cantidad)) return carrito;

        const existente = carrito.find(item => item.codigo === producto.codigo);
        if (existente) {
            existente.cantidad = Math.min(producto.stock, existente.cantidad + cantidad);
        } else {
            carrito.push({ codigo: producto.codigo, cantidad });
        }

        return carrito;
    }, []);
}  // fin -> hace q todo sea listas, y verifica q estén bien; ej "hola" lo pasa a [], que es una lista

function leerCarrito() {
    const guardado = localStorage.getItem(CLAVE_CARRITO);
    if (guardado === null) return [];

    try {
        return normalizarCarrito(JSON.parse(guardado));
    } catch (error) {
        return [];
    }
} // fin -> lee el carrito de la memoria local

function guardarCarrito(carrito) {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(normalizarCarrito(carrito)));
} // fin -> toma la memoria local de carrito y lo pasa  a JSON antes de guardarlo





// ------------- counter y resumen del carrito

function contarProductos(carrito) {
    return carrito.reduce((total, linea) => total + linea.cantidad, 0);
}

function actualizarContador(carrito) {
    for (const contador of document.querySelectorAll("[data-cart-count]")) {
        contador.textContent = contarProductos(carrito);
    }
}

function calcularSubtotal(carrito) {
    return carrito.reduce((subtotal, linea) => {
        const producto = buscarProducto(linea.codigo);
        return producto ? subtotal + producto.precio * linea.cantidad : subtotal;
    }, 0);
}

function actualizarResumen(carrito) {
    const subtotal = calcularSubtotal(carrito);
    const despacho = subtotal > 0 ? DESPACHO : 0;

    const campoSubtotal = document.getElementById("subtotal-carrito");
    const campoDespacho = document.getElementById("despacho-carrito");
    const campoTotal = document.getElementById("total-carrito");

    if (campoSubtotal) campoSubtotal.textContent = formatoPesos(subtotal);
    if (campoDespacho) campoDespacho.textContent = formatoPesos(despacho);
    if (campoTotal) campoTotal.textContent = formatoPesos(subtotal + despacho);
} // saca valores a un scope de fx usando las fx previas para actualizar el carrito con el textContent q actualiza el html

function anunciar(mensaje) {
    let aviso = document.getElementById("mensaje-carrito");

    if (!aviso) {
        aviso = document.createElement("p");
        aviso.id = "mensaje-carrito";
        aviso.className = "error";
        aviso.setAttribute("role", "status");
        document.body.prepend(aviso);
    }

    aviso.textContent = mensaje;
    aviso.hidden = false;
} // crea un banner arriba para mostrar mensajes del carrito; limitado sólo a poner más del stock posible






//-------------------------------- Vista del carrito

function buscarLinea(carrito, codigo) {
    return carrito.find(linea => linea.codigo === codigo) || null;
} // busca y si no pilla, devuelve nada, si no, devuelve lo q encuentre

function crearArticuloCarrito(producto, cantidadInicial) {
    const articulo = document.createElement("article");
    articulo.className = "linea-carrito";
    articulo.dataset.codigo = producto.codigo;

    const miniatura = document.createElement("div");
    miniatura.className = "miniatura";
    const imagen = document.createElement("img");
    imagen.className = "ph ph-mini";
    imagen.src = producto.imagen;
    imagen.alt = producto.alt;
    imagen.loading = "lazy";
    miniatura.appendChild(imagen);

    const datos = document.createElement("div");
    datos.className = "datos";
    const titulo = document.createElement("h3");
    const enlace = document.createElement("a");
    enlace.href = `producto-detalle.html?codigo=${encodeURIComponent(producto.codigo)}`;
    enlace.textContent = producto.nombre;
    titulo.appendChild(enlace);
    datos.appendChild(titulo);

    const descripcion = document.createElement("p");
    descripcion.textContent = `${producto.unidad} · ${producto.categoriaNombre} · Código ${producto.codigo}`;
    datos.appendChild(descripcion);

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = formatoPesos(producto.precio);

    const cantidad = document.createElement("div");
    cantidad.className = "cantidad";

    const restar = document.createElement("button");
    restar.type = "button";
    restar.dataset.accion = "restar";
    restar.dataset.codigo = producto.codigo;
    restar.setAttribute("aria-label", `Quitar una unidad de ${producto.nombre}`);
    restar.textContent = "−";

    const etiqueta = document.createElement("label");
    etiqueta.className = "oculto-visual";
    etiqueta.htmlFor = `cant-${producto.codigo}`;
    etiqueta.textContent = `Cantidad de ${producto.nombre}`;

    const input = document.createElement("input");
    input.type = "number";
    input.id = `cant-${producto.codigo}`;
    input.name = `cant-${producto.codigo}`;
    input.value = cantidadInicial;
    input.min = "1";
    input.max = producto.stock;
    input.step = "1";
    input.inputMode = "numeric";

    const sumar = document.createElement("button");
    sumar.type = "button";
    sumar.dataset.accion = "sumar";
    sumar.dataset.codigo = producto.codigo;
    sumar.setAttribute("aria-label", `Agregar una unidad de ${producto.nombre}`);
    sumar.textContent = "+";

    cantidad.append(restar, etiqueta, input, sumar);

    const eliminar = document.createElement("button");
    eliminar.type = "button";
    eliminar.dataset.accion = "eliminar";
    eliminar.dataset.codigo = producto.codigo;
    eliminar.textContent = "Eliminar";

    articulo.append(miniatura, datos, precio, cantidad, eliminar);
    return articulo;
} // construye el artículo (el producto del carrito) tomando mil recursos

function actualizarVistaCarrito(carrito) {
    const contenedor = document.querySelector(".lineas");

    if (contenedor) {
        for (const articulo of [...contenedor.querySelectorAll("article[data-codigo]")]) {
            if (!buscarLinea(carrito, articulo.dataset.codigo)) {
                articulo.remove();
            }
        }

        const seguirComprando = contenedor.querySelector(":scope > p");

        for (const linea of carrito) {
            const existe = [...contenedor.querySelectorAll("article[data-codigo]")]
                .some(articulo => articulo.dataset.codigo === linea.codigo);
            const producto = buscarProducto(linea.codigo);

            if (!existe && producto) {
                const articulo = crearArticuloCarrito(producto, linea.cantidad);
                if (seguirComprando) {
                    contenedor.insertBefore(articulo, seguirComprando);
                } else {
                    contenedor.appendChild(articulo);
                }
                activarControlesArticulo(articulo);
            }
        }
    }

    for (const articulo of document.querySelectorAll("article[data-codigo]")) {
        const codigo = articulo.getAttribute("data-codigo");
        const linea = buscarLinea(carrito, codigo);
        const producto = buscarProducto(codigo);

        articulo.hidden = !linea;

        if (!linea || !producto) continue;

        const inputCantidad = document.getElementById(`cant-${codigo}`);
        const precio = articulo.querySelector(".precio");
        const nombre = articulo.querySelector("h3 a");

        if (inputCantidad) {
            inputCantidad.value = linea.cantidad;
            inputCantidad.max = producto.stock;
        }
        if (precio) precio.textContent = formatoPesos(producto.precio);
        if (nombre) nombre.textContent = producto.nombre;

        const miniatura = articulo.querySelector(".miniatura");
        if (miniatura && !miniatura.querySelector("img")) {
            miniatura.textContent = "";
            const imagen = document.createElement("img");
            imagen.className = "ph ph-mini";
            imagen.src = producto.imagen;
            imagen.alt = producto.alt;
            imagen.loading = "lazy";
            miniatura.appendChild(imagen);
        }
    }

    actualizarResumen(carrito);
} // básicamente modifica el html para sacar y meter los artículos del carrito. 
// Esta fx fue muy ayudada por IA, y no le encontramos errores en los tests.

function guardarYActualizar(carrito) {
    const limpio = normalizarCarrito(carrito);
    guardarCarrito(limpio);
    actualizarContador(limpio);
    actualizarVistaCarrito(limpio);
} // esta en resumen refresca el carrito




// --------------------------- añadir productos

function agregarProducto(codigo, cantidad = 1) {
    const producto = buscarProducto(codigo);
    const cantidadSolicitada = Number.parseInt(cantidad, 10);

    if (!producto || !Number.isInteger(cantidadSolicitada) || cantidadSolicitada < 1) {
        anunciar("No se pudo agregar el producto seleccionado.");
        return false;
    } // si no existe, o el número no es viable (no entero o negativo) rechaza

    const carrito = leerCarrito();
    const lineaExistente = buscarLinea(carrito, codigo);
    const cantidadActual = lineaExistente ? lineaExistente.cantidad : 0;

    if (cantidadActual + cantidadSolicitada > producto.stock) {
        anunciar(`No hay más stock disponible de ${producto.nombre}. Máximo: ${producto.stock}.`);
        return false;
    } // error si pide más del stock actual

    if (lineaExistente) {
        lineaExistente.cantidad += cantidadSolicitada;
    } else {
        carrito.push({ codigo, cantidad: cantidadSolicitada });
    } // si ya existe, añade y actualiza

    guardarYActualizar(carrito);
    anunciar(`${producto.nombre} fue agregado al carrito.`);
    return true;
}

function activarBotonesAnadir() {
    for (const lista of document.querySelectorAll('ul[data-lista="productos"]')) {
        lista.addEventListener("click", event => {
            const boton = event.target.closest('button[data-accion="añadir"]');
            if (!boton || !lista.contains(boton)) return;

            event.preventDefault();
            agregarProducto(boton.dataset.codigo);
        });
    }

    const formulario = document.getElementById("formulario-detalle");
    if (!formulario) return;

    formulario.addEventListener("submit", event => {
        event.preventDefault();
        const boton = formulario.querySelector('button[data-accion="añadir"]');
        const cantidad = document.getElementById("cantidad");

        if (boton) agregarProducto(boton.dataset.codigo, cantidad ? cantidad.value : 1);
    });
} // hace que si le das click en añadir, sume en el detalle del carrito



// -------------------- Cambios en el carrito

function cambiarCantidad(codigo, cambio) {
    const producto = buscarProducto(codigo);
    const carrito = leerCarrito();
    const linea = buscarLinea(carrito, codigo);
    if (!producto || !linea) return;

    const nuevaCantidad = linea.cantidad + cambio;
    // si hay una nueva cantidad, lo suma (si le ponemos menos, suma un negativo así q resta (l374))

    if (nuevaCantidad > producto.stock) {
        anunciar(`No puedes superar el stock disponible de ${producto.stock} unidades.`);
        return;
    }

    if (nuevaCantidad <= 0) {
        eliminarProducto(codigo, carrito);
        return;
    }

    linea.cantidad = nuevaCantidad;
    guardarYActualizar(carrito);
} // ve las operaciones de cantidad de productos, y luego actualiza

function eliminarProducto(codigo, carrito = leerCarrito()) {
    guardarYActualizar(carrito.filter(linea => linea.codigo !== codigo));
} // literalmente crea un carrito nuevo, pero filtra el .codigo; en práctica borra el id filtrado

function actualizarCantidadDesdeInput(input) {
    const codigo = input.id.replace("cant-", "");
    const producto = buscarProducto(codigo);
    const carrito = leerCarrito();
    const linea = buscarLinea(carrito, codigo);
    const cantidad = Number.parseInt(input.value, 10);

    if (!producto || !linea) return;

    if (!Number.isInteger(cantidad) || cantidad <= 0) {
        eliminarProducto(codigo, carrito);
        return;
    }

    if (cantidad > producto.stock) {
        input.value = linea.cantidad;
        anunciar(`La cantidad máxima de ${producto.nombre} es ${producto.stock}.`);
        return;
    }

    linea.cantidad = cantidad;
    guardarYActualizar(carrito);
} // permite actualizar desde la cajita, ingresando un número de forma manual

function activarControlesArticulo(articulo) {
    const codigo = articulo.dataset.codigo;

    for (const boton of articulo.querySelectorAll("button[data-accion]")) {
        if (boton.dataset.accion === "sumar") {
            boton.addEventListener("click", () => cambiarCantidad(codigo, 1));
        }
        if (boton.dataset.accion === "restar") {
            boton.addEventListener("click", () => cambiarCantidad(codigo, -1));
        }
        if (boton.dataset.accion === "eliminar") {
            boton.addEventListener("click", () => eliminarProducto(codigo));
        }
    }

    const input = articulo.querySelector('input[id^="cant-"]');
    if (input) {
        input.addEventListener("change", () => actualizarCantidadDesdeInput(input));
    }
}

function activarControlesCarrito() {
    for (const articulo of document.querySelectorAll("article[data-codigo]")) {
        activarControlesArticulo(articulo);
    }
} // recorre todos los productos y vela q sus botones realmente botoneen


// ------------------ Inicializa el carrito y activa todos los botones

function iniciarCarritoDesdePagina() {
    if (localStorage.getItem(CLAVE_CARRITO) === null) return [];
    return leerCarrito();
} 

const carritoActual = iniciarCarritoDesdePagina();
activarBotonesAnadir();
activarControlesCarrito();
actualizarContador(carritoActual);
actualizarVistaCarrito(carritoActual);

window.vaciarCarrito = () => guardarYActualizar([]);
