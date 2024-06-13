const shopContent = document.querySelector("#shopContent");
const contenedorInfo = document.querySelector(".modal-informacion")
const modalOver = document.querySelector("#modal-overlay");

const cart = []

const mostrarModalInfo = (p) =>
{
    contenedorInfo.style.display = "block";
    modalOver.style.display = "block";
    contenedorInfo.innerHTML = "";

    // desaparecer header y carrito
    const carrito = document.querySelector(".cart-btn");
    carrito.style.display = "none";

    const header = document.querySelector(".encabezado");
    header.style.display = "none";

    const contadorCarrito = document.querySelector(".cart-counter");
    contadorCarrito.style.display = "none"

    // Modal Header.
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
        contadorCarrito.style.display = "initial"
        displayCounter(); 
    });

    const body = document.createElement("div");
    body.className = "bodyInformacion";
    body.innerHTML = `
        <h1 class="tituloInformacion">${p.productName}</h1>
        <img class="imagenInformacion" src=${p.img}>
        <h2>¿Qué es?</h4>
        <p class="descripcionInformacion">${p.descripcion}</p>
        <h2>Caracteristicas</h4>
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

    `
    contenedorInfo.append(modalHeader)
    contenedorInfo.append(body)
    contenedorInfo.append(footer)
}


productos.forEach(p => {
    const content = document.createElement("div");
    content.className = "content"
    content.innerHTML = `
        <img src="${p.img}">
        <h3 class="nombreProducto">${p.productName}</h3>
        <p class="precio">$${p.price.toLocaleString('es-ES')}</p>
        <a class="MasInformacion" href="">Mas Información</a>
    `
    shopContent.append(content)

    const buyButton = document.createElement("button");
    buyButton.className = "botonComprar"
    buyButton.innerText = "Agregar al 🛒"

    content.append(buyButton)

    const buttonInformacionEl = content.querySelector(".MasInformacion");
    try 
    {
        // Añade un manejador de eventos para mostrar la información modal
        buttonInformacionEl.addEventListener("click", function(e) {
            e.preventDefault()
            mostrarModalInfo(p);
        });        
    } 
    catch (error) 
    {
        console.log(error)
    }


    buyButton.addEventListener("click", async (e)=> 
    {

        const carrito = document.querySelector('.cart-btn');
        const audio = document.querySelector("#buySound")
        
        // Reiniciar animación
        carrito.classList.remove('glow');
        audio.currentTime = 0;
        audio.play();
        void carrito.offsetWidth;  // Forzar reflow para reiniciar la animación
        carrito.classList.add('glow');

        const button = e.target;
    
        // Añadir clase para efecto visual
        button.classList.add('clicked');
        
        // Quitar clase después de 300ms
        setTimeout(function() 
        {
            button.classList.remove('clicked');
        }, 100);

        const repeat = cart.some((repeatProduct) => repeatProduct.id === p.id);
        if (repeat)
        {
            cart.map((pro) =>
            {
                if (pro.id === p.id)
                {
                    pro.quanty++;
                    displayCounter();
                }
            })
        }
        else
        {
            cart.push({
                id: p.id,
                productName: p.productName,
                price: p.price,
                quanty: p.quanty,
                img: p.img
            });
            displayCounter();
        }
    })
});

