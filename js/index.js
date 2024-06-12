const shopContent = document.querySelector("#shopContent");
const cart = []

productos.forEach(p => {
    const content = document.createElement("div");
    content.className = "content"
    content.innerHTML = `
        <img src="${p.img}">
        <h3>${p.productName}</h3>
        <p>$${p.price}</p>
    `
    shopContent.append(content)

    const buyButton = document.createElement("button");
    buyButton.className = "botonComprar"
    buyButton.innerText = "Comprar"

    content.append(buyButton)

    buyButton.addEventListener("click", async (e)=> 
    {
        const button = e.target;
    
        // Añadir clase para efecto visual
        button.classList.add('clicked');
        
        // Quitar clase después de 300ms
        setTimeout(function() {
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

