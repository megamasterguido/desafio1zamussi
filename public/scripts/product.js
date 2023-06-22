let id = window.location.href.substring(31)

let prod

fetch("http://localhost:8080/api/products/"+id)
    .then(resp => resp.json())
    .then(resp => prod = resp.response)
    .then(() => landing(prod))
    .then(() => {
        let button
        let input

        button = document.getElementById("add_cart__button")
            button.addEventListener("click", () => {
                input = document.getElementById("add_cart__input")
                fetch("http://localhost:8080/api/carts/648ccc29ca71f8147c552fec/products/"+ id +"/"+input.value, {method: "PUT"})
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
    )
    .catch(err => console.error(err))

function landing(prod){
    let resp = `<div class="product">
    <div class="product_card__id">ID: ${prod._id}</div>
    <div class="product_card__title">${prod.title}</div>
    <div class="lateral">
        <img src="${prod.thumbnail}" alt="Miniatura del producto" class="product_card__thumbnail">
        <p class="product_card__description">${prod.description}</p>
    </div>
    <div class="abajo">
        <div class="product_card__price">$${prod.price}</div>
        <div class="add_cart">
            <input min="0" type="number" id="add_cart__input">
            <button id="add_cart__button" for="add_cart__input">AGREGAR AL CARRITO</button>
        </div>
    </div>
</div>`

    let main = document.getElementsByTagName("main")[0]
    main.innerHTML += resp
}