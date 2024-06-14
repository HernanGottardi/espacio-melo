const shopContent = document.querySelector("#shopContent");
const contenedorInfo = document.querySelector(".modal-informacion");
const modalOver = document.querySelector("#modal-overlay");
const buscador = document.querySelector(".buscadorProductos");

// Carrito de compras
const cart = [];

// Función para mostrar los productos en el DOM
function mostrarProductos(productosMostrados) {
    shopContent.innerHTML = "";
    productosMostrados.forEach(p => {
        const content = crearProductoElemento(p);
        shopContent.appendChild(content);
    });
}

// Función para crear el elemento HTML de un producto
function crearProductoElemento(p) {
    const content = document.createElement("div");
    content.className = "content";
    content.innerHTML = `
        <img src="${p.img}">
        <h3 class="nombreProducto">${p.productName}</h3>
        <p class="precio">$${p.price.toLocaleString('es-ES')}</p>
        <a class="MasInformacion" href="#">Más Información</a>
    `;

    const buyButton = document.createElement("button");
    buyButton.className = "botonComprar";
    buyButton.innerText = "Agregar al 🛒";
    buyButton.addEventListener("click", () => agregarAlCarrito(p));

    content.appendChild(buyButton);

    const buttonInformacionEl = content.querySelector(".MasInformacion");
    buttonInformacionEl.addEventListener("click", (e) => {
        e.preventDefault();
        mostrarModalInfo(p);
    });

    return content;
}

// Función para agregar un producto al carrito
function agregarAlCarrito(productoSeleccionado) {
    const existeEnCarrito = cart.some(item => item.id === productoSeleccionado.id);
    if (existeEnCarrito) {
        cart.forEach(item => {
            if (item.id === productoSeleccionado.id) {
                item.quantity++;
            }
        });
    } else {
        cart.push({
            id: productoSeleccionado.id,
            productName: productoSeleccionado.productName,
            price: productoSeleccionado.price,
            quantity: 1,
            img: productoSeleccionado.img
        });
    }
    displayCounter();
}

// Función para mostrar la información modal de un producto
function mostrarModalInfo(p) {
    contenedorInfo.style.display = "block";
    modalOver.style.display = "block";
    contenedorInfo.innerHTML = "";

    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";

    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalClose.addEventListener("click", () => cerrarModal());

    modalHeader.appendChild(modalClose);
    contenedorInfo.appendChild(modalHeader);

    const body = document.createElement("div");
    body.className = "bodyInformacion";
    body.innerHTML = `
        <h1 class="tituloInformacion">${p.productName}</h1>
        <img class="imagenInformacion" src="${p.img}">
        <h2>¿Qué es?</h2>
        <p class="descripcionInformacion">${p.descripcion}</p>
        <h2>Características</h2>
        <div class="caracteristicasInformacion">
            <p>- Duración: ${p.duracion}</p>
            <p>- Modalidad: ${p.modalidad}</p>
            <p>- Valor: $${p.price.toLocaleString('es-ES')}</p>
        </div>
    `;

    const footer = document.createElement("div");
    footer.className = "footerInformacion";
    footer.innerHTML = `
        <a href="https://wa.me/message/JF5BCO7TZVLVG1" target="_blank">
            <img id="wpp" class="icono" src="./media/WhatsApp.png">
        </a>
        <a href="https://www.instagram.com/espacio.melo/" target="_blank">
            <img id="insta" class="icono" src="./media/instagram.png">
        </a>
    `;

    contenedorInfo.appendChild(body);
    contenedorInfo.appendChild(footer);
}

// Función para cerrar el modal de información
function cerrarModal() {
    contenedorInfo.style.display = "none";
    modalOver.style.display = "none";
    displayCounter();
}

// Evento para filtrar productos según lo ingresado en el buscador
buscador.addEventListener("input", (e) => {
    const valorBusqueda = e.target.value.trim().toLowerCase();
    const productosFiltrados = productos.filter(p =>
        p.productName.toLowerCase().includes(valorBusqueda)
    );
    mostrarProductos(productosFiltrados.length > 0 ? productosFiltrados : productos);
});

// Función para mostrar el contador del carrito
function displayCounter() {
    const contadorCarrito = document.querySelector(".cart-counter");
    contadorCarrito.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

// Mostrar todos los productos al inicio
mostrarProductos(productos);