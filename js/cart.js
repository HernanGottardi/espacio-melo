const modalContainer = document.querySelector("#modal-container");
const modalOverlay = document.querySelector("#modal-overlay");
const cartBtn = document.querySelector("#cart-btn");
const cartCounter = document.querySelector(".cart-counter");

const mp = new MercadoPago('APP_USR-38e265f7-7184-46ce-a88d-f9f21c60ac96');

const displayCart = () => {
    // Ocultar header y contador de carrito
    const header = document.querySelector(".encabezado");
    header.style.display = "none";

    const contadorCarrito = document.querySelector(".cart-counter");
    contadorCarrito.style.display = "none";

    // Limpiar modal anterior y mostrar el contenedor del modal
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";

    // Modal Header
    const modalHeader = document.createElement("div");
    modalHeader.className = "modal-header";

    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";
    modalClose.addEventListener("click", () => {
        cerrarModal();
    });

    modalHeader.appendChild(modalClose);

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Carrito 🛒";
    modalTitle.className = "modal-title";

    modalHeader.appendChild(modalTitle);
    modalContainer.appendChild(modalHeader);

    // Mostrar cada producto en el carrito
    cart.forEach(p => {
        const modalBody = document.createElement("div");
        const precio = p.price * p.quantity;
        modalBody.className = "modal-body";
        modalBody.innerHTML = `
            <div class="product">
                <img class="product-img" src="${p.img}"/>
                <div class="product-info">
                    <h4>${p.productName}</h4>
                </div>
                <div class="quantity">
                    <span class="quantity-btn-decrese">➖</span>
                    <span class="quantity-input">${p.quantity}</span>
                    <span class="quantity-btn-increse">➕</span>
                </div>
                <div class="price">$${precio.toLocaleString('es-ES')}</div>
                <div class="delete-product">🚫</div>
            </div>
        `;

        modalContainer.appendChild(modalBody);

        // Eventos para modificar la cantidad y eliminar productos
        const decreaseBtn = modalBody.querySelector(".quantity-btn-decrese");
        decreaseBtn.addEventListener("click", () => {
            if (p.quantity > 1) {
                p.quantity--;
                displayCart();
            }
        });

        const increaseBtn = modalBody.querySelector(".quantity-btn-increse");
        increaseBtn.addEventListener("click", () => {
            p.quantity++;
            displayCart();
        });

        const deleteBtn = modalBody.querySelector(".delete-product");
        deleteBtn.addEventListener("click", () => {
            deleteCartProduct(p.id);
            displayCart();
        });
    });

    // Calcular y mostrar el total del carrito
    const total = cart.reduce((acc, el) => acc + el.price * el.quantity, 0);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalFooter.innerHTML = `
        <div class="total-price">Total: $${total.toLocaleString('es-ES')}</div>
        <button class="btn-primary" id="checkout-btn">Ir a Pagar</button>
        <div id="wallet_container"></div>
    `;

    modalContainer.appendChild(modalFooter);

    // Evento para ir a pagar con MercadoPago
    const checkoutBtn = modalFooter.querySelector("#checkout-btn");
    checkoutBtn.addEventListener("click", async () => {
        try {
            const orderData = {
                title: generateCartDescription(),
                quantity: 1,
                price: total
            };

            const response = await fetch("https://mpvercel.vercel.app/create_preference", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData)
            });

            const preference = await response.json();
            createCheckoutButton(preference.id);
        } catch (error) {
            console.log(error)
            alert("Error al procesar el pago 😕");
        }
    });


    // Función para cerrar el modal
    function cerrarModal() {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
        header.style.display = "flex";
        contadorCarrito.style.display = "block";
        displayCounter();
    }
};

// Evento para mostrar el carrito al hacer click en el botón de carrito
cartBtn.addEventListener("click", displayCart);

// Eliminar un producto del carrito por su ID
const deleteCartProduct = (id) => {
    const index = cart.findIndex(item => item.id === id);
    if (index !== -1) {
        cart.splice(index, 1);
        displayCounter();
    }
};

// Función para mostrar el contador del carrito
function displayCounter() {
    const cartLength = cart.reduce((acc, el) => acc + el.quantity, 0);
    cartCounter.textContent = cartLength;
    cartCounter.style.display = cartLength > 0 ? "block" : "block";
}

// Generar descripción del carrito para MercadoPago
function generateCartDescription() {
    return cart.map(product => `${product.productName} (x${product.quantity})`).join(', ');
}

// Función para crear el botón de pago de MercadoPago
const createCheckoutButton = (preferenceId)=>{
    const brickBuilder = mp.bricks();

    const renderComponent = async () => {
        const walletContainer = document.querySelector("#wallet_container");
        
        // Validación para solo crear un botón de MP.
        if (walletContainer.innerHTML.trim() === "") {
            await brickBuilder.create("wallet", "wallet_container", {
                initialization: {
                    preferenceId: preferenceId,
                },
            });
        }
    };
    renderComponent();
}



// **********************************************************************



// const displayCart = () => 
// {
//     // desaparecer header y carrito
//     const carrito = document.querySelector(".cart-btn");
//     carrito.style.display = "none";

//     const header = document.querySelector(".encabezado");
//     header.style.display = "none";

//     const contadorCarrito = document.querySelector(".cart-counter");
//     contadorCarrito.style.display = "none"

//     modalContainer.innerHTML = "";
//     modalContainer.style.display = "block";
//     modalOverlay.style.display = "block";
    
//     // Modal Header.
//     const modalHeader = document.createElement("div");

//     const modalClose = document.createElement("div");
//     modalClose.innerText = "❌";
//     modalClose.className = "modal-close";

//     modalHeader.append(modalClose);

//     modalClose.addEventListener("click", () => {
//         modalContainer.style.display = "none";
//         modalOverlay.style.display = "none";
//         carrito.style.display = "initial";
//         header.style.display = "flex";
//         contadorCarrito.style.display = "initial"
//         displayCounter(); 
//     });

//     const modalTitle = document.createElement("div");
//     modalTitle.innerText = "Carrito 🛒";
//     modalTitle.className = "modal-title";

//     modalHeader.append(modalTitle);
//     modalContainer.append(modalHeader);

//     cart.forEach((p) => {
//         const modalBody = document.createElement("div");
//         const precio = p.price * p.quanty
//         modalBody.className = "modal-body";
//         modalBody.innerHTML = `
//             <div class="product">
//                 <img class="product-img" src="${p.img}"/>
//                 <div class="product-info">
//                     <h4>${p.productName}</h4>
//                 </div>
//                 <div class="quantity">
//                     <span class="quantity-btn-decrese">➖</span>
//                     <span class="quantity-input">${p.quanty}</span>
//                     <span class="quantity-btn-increse">➕</span>
//                 </div>
//                 <div class="price">$${precio.toLocaleString('es-ES')}</div>
//                 <div class="delete-product">🚫</div>
//             </div> 
//         `;

//         modalContainer.append(modalBody);
    
//         const decrese = modalBody.querySelector(".quantity-btn-decrese");
//         decrese.addEventListener("click", () => {
//             if (p.quanty !== 1) {
//                 p.quanty--;
//                 displayCart();
//             }
//         });

//         const increse = modalBody.querySelector(".quantity-btn-increse");
//         increse.addEventListener("click", () => {
//             p.quanty++;   
//             displayCart();
//             });

//         const borrar = modalBody.querySelector(".delete-product");
//         borrar.addEventListener("click", () => {
//             deleteCartProduct(p.id);
//             displayCart(); // Para actualizar la vista después de eliminar el producto
//         });
//     });

//     const total = cart.reduce((acc, el) => acc + el.price * el.quanty, 0);

//     const modalFooter = document.createElement("div");
//     modalFooter.className = "modal-footer";
//     modalFooter.innerHTML = `
//         <div class="total-price">Total: $${total.toLocaleString('es-ES')}</div>
//         <button class="btn-primary" id="checkout-btn">Ir a Pagar</button>
//         <div id="wallet_container"></div>
//     `;

//     modalContainer.append(modalFooter);

//     // MP ---------------------------------------------------------
//     const mp = new MercadoPago("APP_USR-38e265f7-7184-46ce-a88d-f9f21c60ac96", {
//         locale: "es-AR"
//     });

//     const generateCartDescription = () => {
//         return cart.map(product => `${product.productName} (x${product.quanty})`).join(', ')
//     }

//     document.querySelector("#checkout-btn").addEventListener("click", async () => {
//         try 
//         {
//             const orderData = {
//                 title: generateCartDescription(),
//                 quantity: 1,
//                 price: total
//             };

//             const response = await fetch("https://mpvercel.vercel.app/create_preference", {
//                 method: "POST",
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(orderData)
//             });

//             const preference = await response.json();
//             createCheckoutButton(preference.id);
//         }
//         catch (error)
//         {
//             alert("error 😕")
//         }
//     })

//     const createCheckoutButton = (preferenceId)=>{
//         const brickBuilder = mp.bricks();

//         const renderComponent = async () => {
//             const walletContainer = document.querySelector("#wallet_container");
            
//             // Validación para solo crear un botón de MP.
//             if (walletContainer.innerHTML.trim() === "") {
//                 await brickBuilder.create("wallet", "wallet_container", {
//                     initialization: {
//                         preferenceId: preferenceId,
//                     },
//                 });
//             }
//         };
//         renderComponent();
//     }
// };



