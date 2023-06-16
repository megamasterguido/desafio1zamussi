let productos = []

let loc = window.location.href
let link = "http://localhost:8080/api/products/db"
let link_handler = "http://localhost:8080/api/carts/db/648bb2c828ddea6a745e4901/products/"
let flag = 0

if(location == "http://localhost:8080/products" ){
    link = "http://localhost:8080/api/products"
    flag = 1
    link_handler = "http://localhost:8080/api/carts/1/products/"

}

fetch(link)
    .then(resp => resp.json())
    .then(resp => productos = resp.response)
    .then(() => products_box.innerHTML += productos.map(card).join(''))
    .then(() => {

        for(let i = 0; i <productos.length; i++){
            let cod = productos[i].id
            if(!flag){
                cod = productos[i]._id
            }
            let button = document.getElementById("add_cart__button" + cod)
            let input = document.getElementById("add_cart__input" + cod)
            button.addEventListener("click", () => {
                fetch(link_handler+ cod +"/"+input.value, {method: "PUT"})
                .then(resp => resp.json())
                .then(resp => {
                    if(typeof(resp.response) == "string"){
                        alert(resp.response)
                    }
                    else{
                        if(flag){
                            socket.emit("cart_update")
                        }
                        else{
                            socket.emit("cart_update_db")                            
                        }
                    }
                })
                .catch(err => console.error(err))
            })
        }
    })

function card (prod){
    let id = prod.id
    let ref = id
    if(!flag){
        id = prod._id
        ref = 'db/'+id
    }
    let resp = `
                <div class="product_card">
                    <a href="/products/${ref}">
                    <div class="product_card__id">ID: ${id}</div>
                    <div class="product_card__title">${prod.title}</div>
                    <div class="product_card__price">$${prod.price}</div>
                    <img src="${prod.thumbnail}" alt="Miniatura del producto" class="product_card__thumbnail">
                    <p class="product_card__description">${prod.description}</p>
                    </a>
                    <div class="add_cart">
                        <input min="0" type="number" id="add_cart__input${id}">
                        <button id="add_cart__button${id}" for="add_cart__input${id}">AGREGAR AL CARRITO</button>
                    </div>
                </div>`
    return resp
}


let products_box = document.getElementById("products")
/*
async function cargar(){
    let JSnuevo
    for(let i = 0; i<productos.length;i++){
        nuevo = JSON.stringify({
            title: productos[i].title,
            description: productos[i].description,
            price: productos[i].price,
            thumbnail: productos[i].thumbnail,
            stock: productos[i].stock
        })
        console.log(nuevo)
        fetch("http://localhost:8080/api/products/db", {
            method: "POST",
            headers: { "Content-Type": "application/json" }, 
            body: nuevo
        })
        .then(resp => resp.json())
        .then(resp => console.log(resp))
        .catch(err => console.error(err))
    }
}
*/