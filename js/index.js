
const shopContent = document.querySelector("#shopContent");
const contenedorInfo = document.querySelector(".modal-informacion");
const modalOver = document.querySelector("#modal-overlay");

const buscador = document.querySelector(".buscadorProductos");
const cart = [];

const mostrarProductos = (productosMostrados) => {
    shopContent.innerHTML = "";
    productosMostrados.forEach(p => {
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

        content.append(buyButton);
        shopContent.append(content);

        buyButton.addEventListener("click", async (e) => {
            e.preventDefault();
            const button = e.target;
            button.classList.add('clicked');
            setTimeout(() => button.classList.remove('clicked'), 100);

            // Agregar clase glow al botón cartBtn
            cartBtn.classList.add('glow');

            const audio = document.querySelector("#buySound");
            audio.currentTime = 0;
            audio.play();
            
            // Eliminar la clase glow después de 500ms
            setTimeout(() => {
                
                cartBtn.classList.remove('glow');
            }, 2000);

            const productoSeleccionado = productos.find(prod => prod.id === p.id);
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
        });

        const buttonInformacionEl = content.querySelector(".MasInformacion");
        buttonInformacionEl.addEventListener("click", function(e) {
            e.preventDefault();
            mostrarModalInfo(p);
        });
    });
};

const mostrarModalInfo = (p) => {
    contenedorInfo.style.display = "block";
    modalOver.style.display = "block";
    contenedorInfo.innerHTML = "";

    const modalHeader = document.createElement("div");
    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";

    modalHeader.append(modalClose);

    modalClose.addEventListener("click", () => {
        contenedorInfo.style.display = "none";
        modalOver.style.display = "none";
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
        carrito.style.display = "initial";
        header.style.display = "initial";
        contadorCarrito.style.display = "initial";
        displayCounter(); 
    });

    const body = document.createElement("div");
    body.className = "bodyInformacion";
    body.innerHTML = `
        <h1 class="tituloInformacion">${p.productName}</h1>
        <img class="imagenInformacion" src=${p.img}>
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

    contenedorInfo.append(modalHeader);
    contenedorInfo.append(body);
    contenedorInfo.append(footer);
};

// Función para mostrar todos los productos al inicio
mostrarProductos(productos);

// Evento para filtrar productos según lo ingresado en el buscador
buscador.addEventListener("input", (e) => {
    const valorBusqueda = e.target.value.trim().toLowerCase();
    const productosFiltrados = productos.filter(p => {
        return p.productName.toLowerCase().includes(valorBusqueda);
    });

    // Mostrar productos filtrados o todos si no hay búsqueda
    mostrarProductos(productosFiltrados.length > 0 ? productosFiltrados : productos);
});

// Función para mostrar el contador del carrito
function displayCounter() {
    const contadorCarrito = document.querySelector(".cart-counter");
    contadorCarrito.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}