/* Dejé este catálogo como la fuente compartida de datos de productos y rutas de imágenes. */

const productos = [
    {
        codigo: "FR-001",
        nombre: "Manzana Fuji",
        categoria: "frutas",
        categoriaNombre: "Frutas",
        unidad: "Kilo",
        precio: 1290,
        stock: 48,
        imagen: "../assets/img/productos/manzana-fuji.jpg",
        alt: "Manzanas Fuji apiladas en un cajón de madera",
        descripcion: "Manzanas Fuji frescas, crujientes y dulces, seleccionadas para consumo diario.",
        destacado: true
    },
    {
        codigo: "FR-002",
        nombre: "Plátano de Ecuador",
        categoria: "frutas",
        categoriaNombre: "Frutas",
        unidad: "Kilo",
        precio: 1490,
        stock: 60,
        imagen: "../assets/img/productos/platano.jpg",
        alt: "Plátanos de Ecuador",
        descripcion: "Plátanos de Ecuador con maduración gradual, ideales para consumir durante la semana.",
        destacado: true
    },
    {
        codigo: "FR-003",
        nombre: "Naranja Valencia",
        categoria: "frutas",
        categoriaNombre: "Frutas",
        unidad: "Malla 3 kilos",
        precio: 3590,
        stock: 25,
        imagen: "../assets/img/productos/naranja.jpg",
        alt: "Naranjas Valencia",
        descripcion: "Naranjas jugosas de temporada, perfectas para jugos y preparaciones caseras.",
        destacado: true
    },
    {
        codigo: "FR-004",
        nombre: "Frutilla",
        categoria: "frutas",
        categoriaNombre: "Frutas",
        unidad: "Bandeja 500 g",
        precio: 2490,
        stock: 6,
        imagen: "../assets/img/productos/frutilla.jpg",
        alt: "Frutillas frescas en una bandeja",
        descripcion: "Frutillas de temporada, seleccionadas y listas para servir.",
        destacado: true
    },
    {
        codigo: "FR-005",
        nombre: "Muestra de temporada",
        categoria: "frutas",
        categoriaNombre: "Frutas",
        unidad: "Muestra",
        precio: 0,
        stock: 100,
        imagen: "../assets/img/productos/muestra-gratis.jpg",
        alt: "Muestra gratuita de frutas de temporada",
        descripcion: "Muestra gratuita de productos de temporada. Precio GRATIS.",
        destacado: false
    },
    {
        codigo: "VE-001",
        nombre: "Tomate Limachino",
        categoria: "verduras",
        categoriaNombre: "Verduras",
        unidad: "Kilo",
        precio: 1990,
        stock: 32,
        imagen: "../assets/img/productos/tomate.jpg",
        alt: "Tomates Limachino",
        descripcion: "Tomates Limachino de sabor intenso, cultivados y seleccionados en la zona central.",
        destacado: true
    },
    {
        codigo: "VE-002",
        nombre: "Palta Hass",
        categoria: "verduras",
        categoriaNombre: "Verduras",
        unidad: "Kilo",
        precio: 4990,
        stock: 20,
        imagen: "../assets/img/productos/palta.jpg",
        alt: "Paltas Hass cortadas por la mitad",
        descripcion: "Palta Hass cremosa, ideal para untar. Se despacha con maduración de 2 a 3 días.",
        destacado: true
    },
    {
        codigo: "VE-003",
        nombre: "Zanahoria",
        categoria: "verduras",
        categoriaNombre: "Verduras",
        unidad: "Kilo",
        precio: 990,
        stock: 75,
        imagen: "../assets/img/productos/zanahoria.jpg",
        alt: "Zanahorias frescas",
        descripcion: "Zanahorias frescas y crocantes, buenas para ensaladas, sopas y jugos.",
        destacado: true
    },
    {
        codigo: "VE-004",
        nombre: "Lechuga escarola",
        categoria: "verduras",
        categoriaNombre: "Verduras",
        unidad: "Unidad",
        precio: 1190,
        stock: 40,
        imagen: "../assets/img/productos/lechuga.jpg",
        alt: "Lechuga escarola fresca",
        descripcion: "Lechuga escarola fresca, lavada y lista para preparar ensaladas.",
        destacado: false
    },
    {
        codigo: "OR-001",
        nombre: "Mix orgánico de temporada",
        categoria: "organicos",
        categoriaNombre: "Orgánicos",
        unidad: "Caja 5 kilos",
        precio: 8990,
        stock: 10,
        imagen: "../assets/img/productos/mix-organico.jpg",
        alt: "Caja con mix orgánico de temporada",
        descripcion: "Selección de frutas y verduras orgánicas de la temporada.",
        destacado: true
    },
    {
        codigo: "OR-002",
        nombre: "Quinoa orgánica",
        categoria: "organicos",
        categoriaNombre: "Orgánicos",
        unidad: "Bolsa 500 g",
        precio: 5490,
        stock: 22,
        imagen: "../assets/img/productos/quinoa.jpg",
        alt: "Quinoa orgánica",
        descripcion: "Quinoa orgánica seleccionada, rica en proteínas y fácil de preparar.",
        destacado: false
    },
    {
        codigo: "OR-003",
        nombre: "Miel de ulmo",
        categoria: "organicos",
        categoriaNombre: "Orgánicos",
        unidad: "Frasco 500 g",
        precio: 6990,
        stock: 5,
        imagen: "../assets/img/productos/miel.jpg",
        alt: "Frasco de miel de ulmo",
        descripcion: "Miel de ulmo de productores locales, envasada en origen.",
        destacado: false
    }
];

function buscarProducto(codigo) {
    return productos.find(producto => producto.codigo === codigo) || null;
}

function formatoPesos(numero) {
    return `$${numero.toLocaleString("es-CL")}`;
}

function productosDeCategoria(categoria) {
    if (!categoria) return [...productos];
    return productos.filter(producto => producto.categoria === categoria);
}

function crearPlaceholder(producto, clase = "ph") {
    const imagen = document.createElement("img");
    imagen.className = clase;
    imagen.src = producto.imagen;
    imagen.alt = producto.alt;
    imagen.loading = "lazy";
    return imagen;
}

function crearTarjeta(producto, incluirBoton, nivel = "h2") {
    const item = document.createElement("li");
    item.className = "card-producto";
    item.dataset.codigo = producto.codigo;

    const enlace = document.createElement("a");
    enlace.href = `producto-detalle.html?codigo=${encodeURIComponent(producto.codigo)}`;
    enlace.appendChild(crearPlaceholder(producto));

    const titulo = document.createElement(nivel);
    titulo.textContent = producto.nombre;
    enlace.appendChild(titulo);
    item.appendChild(enlace);

    const descripcion = document.createElement("p");
    descripcion.textContent = `${producto.unidad} · Categoría: ${producto.categoriaNombre}`;
    item.appendChild(descripcion);

    const precio = document.createElement("p");
    precio.className = "precio";
    precio.textContent = producto.precio === 0
        ? "$0 (GRATIS)"
        : formatoPesos(producto.precio);
    item.appendChild(precio);

    if (incluirBoton) {
        const boton = document.createElement("button");
        boton.type = "button";
        boton.className = "btn-bloque";
        boton.dataset.accion = "añadir";
        boton.dataset.codigo = producto.codigo;
        boton.textContent = "Añadir";
        item.appendChild(boton);
    }

    return item;
}

function renderizarLista(lista, elementos, incluirBoton, nivel) {
    lista.innerHTML = "";

    for (const producto of elementos) {
        lista.appendChild(crearTarjeta(producto, incluirBoton, nivel));
    }
}

function leerParametro(nombre) {
    return new URLSearchParams(window.location.search).get(nombre) || "";
}

function inicializarListas() {
    const listas = document.getElementsByTagName("ul");

    for (const lista of listas) {
        const tipo = lista.getAttribute("data-lista");
        if (!tipo) continue;

        if (tipo === "destacados") {
            renderizarLista(
                lista,
                productos.filter(producto => producto.destacado),
                false,
                "h3"
            );
        }

        if (tipo === "productos") {
            renderizarLista(lista, productosDeCategoria(leerParametro("categoria")), true, "h2");
        }

        if (tipo === "relacionados") {
            const actual = buscarProducto(leerParametro("codigo"));
            const relacionados = actual
                ? productos.filter(producto => producto.categoria === actual.categoria && producto.codigo !== actual.codigo).slice(0, 5)
                : [];
            renderizarLista(lista, relacionados, false, "h3");
        }
    }
}

function activarOrdenProductos() {
    const orden = document.getElementById("orden");
    if (!orden) return;

    orden.addEventListener("change", () => {
        const lista = document.getElementsByTagName("ul");
        let listaProductos = null;

        for (const elemento of lista) {
            if (elemento.getAttribute("data-lista") === "productos") {
                listaProductos = elemento;
            }
        }

        if (!listaProductos) return;

        const elementos = productosDeCategoria(leerParametro("categoria"));

        if (orden.value === "precio-asc") elementos.sort((a, b) => a.precio - b.precio);
        if (orden.value === "precio-desc") elementos.sort((a, b) => b.precio - a.precio);
        if (orden.value === "nombre") elementos.sort((a, b) => a.nombre.localeCompare(b.nombre, "es"));

        renderizarLista(listaProductos, elementos, true, "h2");
    });
}

function inicializarDetalle() {
    const detalle = document.getElementById("detalle-producto");
    if (!detalle) return;

    const codigo = leerParametro("codigo");
    const producto = buscarProducto(codigo);
    const boton = document.getElementById("boton-anadir-detalle");
    const formulario = document.getElementById("formulario-detalle");

    if (!producto) {
        detalle.hidden = true;
        document.title = "Producto no encontrado | Huerto Verde";
        const mensaje = document.getElementById("producto-no-encontrado");
        if (mensaje) mensaje.hidden = false;
        if (formulario) formulario.hidden = true;
        return;
    }

    document.title = `${producto.nombre} | Huerto Verde`;

    const nombre = document.getElementById("detalle-nombre");
    const precio = document.getElementById("detalle-precio");
    const codigoElemento = document.getElementById("detalle-codigo");
    const categoria = document.getElementById("detalle-categoria");
    const disponibilidad = document.getElementById("detalle-disponibilidad");
    const descripcion = document.getElementById("detalle-descripcion");
    const breadcrumb = document.getElementById("detalle-breadcrumb");
    const imagen = document.getElementById("detalle-imagen");
    const cantidad = document.getElementById("cantidad");

    if (nombre) nombre.textContent = producto.nombre;
    if (precio) precio.textContent = `${formatoPesos(producto.precio)} por ${producto.unidad.toLowerCase()}`;
    if (codigoElemento) codigoElemento.textContent = producto.codigo;
    if (categoria) categoria.textContent = producto.categoriaNombre;
    if (disponibilidad) disponibilidad.textContent = `En stock (${producto.stock} unidades)`;
    if (descripcion) descripcion.textContent = producto.descripcion;
    if (breadcrumb) breadcrumb.textContent = producto.nombre;
    if (imagen) {
        imagen.textContent = "";
        const imagenReal = document.createElement("img");
        imagenReal.src = producto.imagen;
        imagenReal.alt = producto.alt;
        imagenReal.loading = "eager";
        imagen.appendChild(imagenReal);
    }
    if (boton) boton.dataset.codigo = producto.codigo;

    if (cantidad) {
        cantidad.innerHTML = "";
        const limite = Math.min(producto.stock, 5);
        for (let valor = 1; valor <= limite; valor += 1) {
            const opcion = document.createElement("option");
            opcion.value = valor;
            opcion.textContent = valor;
            cantidad.appendChild(opcion);
        }
    }
}

inicializarListas();
activarOrdenProductos();
inicializarDetalle();
