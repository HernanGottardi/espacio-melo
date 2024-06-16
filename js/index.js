const shopContent = document.querySelector("#shopContent");
const modalMasInfo = document.querySelector(".modal-informacion");
const modalMenu = document.querySelector(".modal-menu");
const modalOver = document.querySelector("#modal-overlay");
const buscador = document.querySelector(".buscadorProductos");
const cartBTN = document.querySelector(".cart-btn");
const contadorCarrito = document.querySelector(".cart-counter");
const encabezado = document.querySelector(".encabezado");
const menu = document.querySelector(".menu")
const w = document.querySelector(".wpp-enlace")
const cart = [];

const mostrarProductos = (productosMostrados) => {
    shopContent.innerHTML = '';
    productosMostrados.forEach(p => {
        const content = document.createElement("div");
        content.className = "content";
        content.innerHTML = `
            <h3 class="nombreProducto">${p.productName}</h3>
            <img src="${p.img}">
            <p class="precio">$${p.price.toLocaleString('es-ES')}</p>
            <a class="MasInformacion" href="#">Más Información</a>
        `;

        const agregarButton = document.createElement("button");
        agregarButton.className = "botonComprar";
        agregarButton.innerText = "Agregar al 🛒";
        content.append(agregarButton);
        shopContent.append(content);

        agregarButton.addEventListener("click", async (e) => {
            e.preventDefault();
            cartBTN.classList.add('glow');
            const audio = document.querySelector("#buySound");
            audio.currentTime = 0;
            audio.play();
            setTimeout(() => {
                cartBTN.classList.remove('glow');
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

        const masInfoEl = content.querySelector(".MasInformacion");
        masInfoEl.addEventListener("click", function(e) {
            e.preventDefault();
            mostrarModalInfo(p);
        });
    });
};

const mostrarModalInfo = (p) => {
    modalMasInfo.style.display = "block";
    modalOver.style.display = "block";
    encabezado.style.display = "none";

    const modalHeader = document.createElement("div");
    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalHeader.append(modalClose);

    modalClose.addEventListener("click", () => {
        modalMasInfo.style.display = "none";
        modalOver.style.display = "none";
        encabezado.style.display = "grid";
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
        <a href="https://www.instagram.com/espacio.melo/" target="_blank">
            <img id="insta" class="icono" src="./media/instagram.png">
        </a>
    `;

    modalMasInfo.append(modalHeader);
    modalMasInfo.append(body);
    modalMasInfo.append(footer);
};

mostrarProductos(productos);

buscador.addEventListener("input", (e) => {
    e.preventDefault();
    const valorBusqueda = e.target.value.trim().toLowerCase();
    const productosFiltrados = productos.filter(p => 
    {
        return p.productName.toLowerCase().includes(valorBusqueda);
    });
    mostrarProductos(productosFiltrados.length > 0 ? productosFiltrados : productos);
});

function displayCounter() 
{
    contadorCarrito.textContent = cart.reduce((total, item) => total + item.quantity, 0);
}

menu.addEventListener("click", (e) => {
    try {
        e.preventDefault();
        encabezado.style.display = "none";
        modalMenu.style.display = "block";
        modalOver.style.display = "block";
        w.style.display = "none";

        const close = document.createElement("div");
        close.innerText = "❌";
        close.className = "modal-close";

        const header = document.createElement("div");
        header.className = "headerMenu"
        header.append(close);

        close.addEventListener("click", () => {
            modalMenu.style.display = "none";
            modalOver.style.display = "none";
            encabezado.style.display = "grid";
            w.style.display = "initial";
        });

        const body = document.createElement("div");
        body.className = "bodyMenu"
        body.innerHTML = `
            <div class="contenedorOpcionesMenu">
                <a class="opcionMenu" href="#">Contacto</a>
                <a class="opcionMenu" href="#">Tarot</a>
                <a class="opcionMenu" href="#">Más</a>
            </div>
        `;

        modalMenu.innerHTML = '';
        modalMenu.append(header);
        modalMenu.append(body);

    } catch (error) {
        console.log(error);
    }
});