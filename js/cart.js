import { cart } from './index.js'; // Asegúrate de que la ruta sea correcta
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDocs, collection, query, where, deleteDoc } from "https://www.gstatic.com/firebasejs/9.4.0/firebase-firestore.js";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB-cvjO5Ze1jUG5WRVd6pFPWHPq56vjJZc",
    authDomain: "espaciomelo-34e9a.firebaseapp.com",
    projectId: "espaciomelo-34e9a",
    storageBucket: "espaciomelo-34e9a.appspot.com",
    messagingSenderId: "90914534743",
    appId: "1:90914534743:web:fd53ebbe6384be9cc53a12"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const agendaRef = collection(db, "agenda");

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
    cart.forEach((p, index) => {
        const partesFecha = p.fecha_hora.split("-");
        const modalBody = document.createElement("div");
        const precio = p.price * p.quantity;
        modalBody.className = "modal-body";
        modalBody.innerHTML = `
            <div><p>Turno: El dia ${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]} a las ${partesFecha[3]}hs.</p></div>
            <div class="product">
                <img class="product-img" src="${p.img}"/>
                <div class="product-info">
                    <h4>${p.productName}</h4>
                </div>
                <div class="price">$${precio.toLocaleString('es-ES')}</div>
                <div class="delete-product" data-index="${index}">🚫</div>
            </div>
        `;

        modalContainer.appendChild(modalBody);
    });

    // Agregar evento de clic para eliminar productos
    const deleteButtons = modalContainer.querySelectorAll(".delete-product");
    deleteButtons.forEach(button => {
        button.addEventListener("click", (e) => {
            const productIndex = e.target.getAttribute("data-index");
            deleteCartProduct(productIndex);
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

            const response = await fetch("https://servidor-espacio-melo.vercel.app/create_preference", {

                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(orderData)
            });

            const preference = await response.json();
            createCheckoutButton(preference.id);
        } 
        catch (error) 
        {
            console.log(error);
            alert("Error al procesar el pago 😕");
        }
    });

    // Función para cerrar el modal
    function cerrarModal() 
    {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
        header.style.display = "grid";
        contadorCarrito.style.display = "block";
        displayCounter();
    }
};

// Evento para mostrar el carrito al hacer click en el botón de carrito
cartBtn.addEventListener("click", displayCart);

// Borro en la base de datos.
const deleteAgendaDoc = async (id) => {
    try {
        const docRef = doc(db, "agenda", id);
        await deleteDoc(docRef);
        console.log("Documento eliminado con éxito");
    } catch (error) {
        console.error("Error al eliminar el documento: ", error);
    }
};

// Borro en la base de datos y en el carrito.
const deleteCartProduct = (index) => {
    // Base de datos.
    const cartBorrar = cart[index];
    deleteAgendaDoc(cartBorrar.fecha_hora);
    // carrito.
    cart.splice(index, 1);
    // Actualizamos el contador.
    displayCounter();
};

// Función para mostrar el contador del carrito
function displayCounter() {
    const cartLength = cart.reduce((acc, el) => acc + el.quantity, 0);
    cartCounter.textContent = cartLength;
}

// Generar descripción del carrito para MercadoPago
function generateCartDescription() {
    return cart.map(product => `${product.productName} (x${product.quantity})`).join(', ');
}

// Función para crear el botón de pago de MercadoPago
const createCheckoutButton = (preferenceId) => {
    const brickBuilder = mp.bricks();

    const renderComponent = async () => {
        const walletContainer = document.querySelector("#wallet_container");

        // Validación para solo crear un botón de MP.
        if (walletContainer.innerHTML.trim() === "") {
            await brickBuilder.create("wallet", "wallet_container", {
                initialization: {
                    preferenceId: preferenceId,
                }
            });
        }
    };

    renderComponent();

    // consultaEstadoPago(preferenceId)
};


// Función para consultar el estado de un pago en MercadoPago
const consultaEstadoPago = async (preferenceId) => {
    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${preferenceId}`, {
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ACCESS_TOKEN', // Reemplaza ACCESS_TOKEN con tu token de MercadoPago
                'Content-Type': 'application/json'
            }
        });

        const paymentInfo = await response.json();
        console.log('Información del pago:', paymentInfo);

        // Verifica el estado del pago y toma acciones correspondientes
        if (paymentInfo.status === 'approved') {
            console.log('El pago fue aprobado');
            // Aquí podrías hacer algo más si el pago fue aprobado
        } else {
            console.log('El pago no fue aprobado');
            // Aquí podrías manejar el caso en que el pago no fue aprobado
        }

    } catch (error) {
        console.error('Error al consultar el estado del pago:', error);
    }
};