let productos = []

fetch("http://localhost:8080/api/products")
    .then(resp => resp.json())
    .then(resp => productos = resp.response)
    .then(() => products_box.innerHTML += productos.map(card).join(''))
    .then(() => {
        let button
        let input

        for(let i = 0; i <productos.length; i++){
            button = document.getElementById("add_cart__button" + productos[i].id)
            button.addEventListener("click", () => {
                input = document.getElementById("add_cart__input" + productos[i].id)
                fetch("http://localhost:8080/api/carts/1/products/"+ productos[i].id +"/"+input.value, {method: "PUT"})
                .then(resp => resp.json())
                .then(resp => {
                    if(typeof(resp.response) == "string"){
                        alert(resp.response)
                    }
                    else{
                        socket.emit("cart_update")
                    }
                })
                .catch(err => console.error(err))
            })
        }
    })

function card (prod){
    let resp = `
                <div class="product_card">
                    <a href="/products/${prod.id}">
                    <div class="product_card__id">ID: ${prod.id}</div>
                    <div class="product_card__title">${prod.title}</div>
                    <div class="product_card__price">$${prod.price}</div>
                    <img src="${prod.thumbnail}" alt="Miniatura del producto" class="product_card__thumbnail">
                    <p class="product_card__description">${prod.description}</p>
                    </a>
                    <div class="add_cart">
                        <input min="0" type="number" id="add_cart__input${prod.id}">
                        <button id="add_cart__button${prod.id}" for="add_cart__input${prod.id}">AGREGAR AL CARRITO</button>
                    </div>
                </div>`
    return resp
}


let products_box = document.getElementById("products")

