const modalContainer = document.querySelector("#modal-container");
const modalOverlay = document.querySelector("#modal-overlay");
const cartBtn = document.querySelector("#cart-btn");
const cartCounter = document.querySelector(".cart-counter");

const displayCart = () => {
    modalContainer.innerHTML = "";
    modalContainer.style.display = "block";
    modalOverlay.style.display = "block";
    
    // Modal Header.
    const modalHeader = document.createElement("div");

    const modalClose = document.createElement("div");
    modalClose.innerText = "❌";
    modalClose.className = "modal-close";

    modalHeader.append(modalClose);

    modalClose.addEventListener("click", () => {
        modalContainer.style.display = "none";
        modalOverlay.style.display = "none";
    });

    const modalTitle = document.createElement("div");
    modalTitle.innerText = "Cart";
    modalTitle.className = "modal-title";

    modalHeader.append(modalTitle);

    modalContainer.append(modalHeader);

    cart.forEach((p) => {
        const modalBody = document.createElement("div");
        modalBody.className = "modal-body";
        modalBody.innerHTML = `
            <div class="product">
                <img class="product-img" src="${p.img}"/>
                <div class="product-info">
                    <h4>${p.productName}</h4>
                </div>
                <div class="quantity">
                    <span class="quantity-btn-decrese">-</span>
                    <span class="quantity-input">${p.quanty}</span>
                    <span class="quantity-btn-increse">+</span>
                </div>
                <div class="price">${p.price * p.quanty}</div>
                <div class="delete-product">❌</div>
            </div> 
        `;

        modalContainer.append(modalBody);
    
        const decrese = modalBody.querySelector(".quantity-btn-decrese");
        decrese.addEventListener("click", () => {
            if (p.quanty !== 1) {
                p.quanty--;
                displayCart();
            }
        });

        const increse = modalBody.querySelector(".quantity-btn-increse");
        increse.addEventListener("click", () => {
            p.quanty++;   
            displayCart();
            });

        const borrar = modalBody.querySelector(".delete-product");
        borrar.addEventListener("click", () => {
            deleteCartProduct(p.id);
            displayCart(); // Para actualizar la vista después de eliminar el producto
        });
    });

    const total = cart.reduce((acc, el) => acc + el.price * el.quanty, 0);

    const modalFooter = document.createElement("div");
    modalFooter.className = "modal-footer";
    modalFooter.innerHTML = `
        <div class="total-price">Total: $${total}</div>
        <button class="btn-primary" id="checkout-btn">go to checkout</button>
        <div id="wallet_container"></div>
    `;

    modalContainer.append(modalFooter);

    // MP ---------------------------------------------------------
    const mp = new MercadoPago("APP_USR-38e265f7-7184-46ce-a88d-f9f21c60ac96", {
        locale: "es-AR"
    });

    const generateCartDescription = () => {
        return cart.map(product => `${product.productName} (x${product.quanty})`).join(', ')
    }

    document.querySelector("#checkout-btn").addEventListener("click", async () => {
        try 
        {
            const orderData = {
                title: generateCartDescription(),
                quantity: 1,
                price: total
            };

            const response = await fetch("https://e-commerce-iqtwj8dj9-hernans-projects-b8ac9745.vercel.app/create_preference", {
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
            alert("error 😕")
        }
    })

    const createCheckoutButton = (preferenceId)=>{
        const brickBuilder = mp.bricks();

        const renderComponent = async () => {
            // Validacion para solo crear un boton de MP.
            if (window.checkoutButton) window.checkoutButton.unmount();

            await brickBuilder.create("wallet", "wallet_container", {
                initialization: {
                    preferenceId: preferenceId,
                },
            });
        };
        renderComponent();
    }
};
// ----------------------------------------------------------------

cartBtn.addEventListener("click", displayCart);

const deleteCartProduct = (id) => {
    const foundId = cart.findIndex((element) => element.id === id);
    if (foundId !== -1) {
        cart.splice(foundId, 1); // Remover el producto del carrito
        displayCounter();
    }
};

const displayCounter = () => {
    const cartLength = cart.reduce((acc, el) => acc + el.quanty, 0);
    if (cartLength > 0)
    {
        cartCounter.style.display = "block";
        cartCounter.innerText = cartLength;
    }
    else
    {
        cartCounter.style.display = "none";
    }  
}