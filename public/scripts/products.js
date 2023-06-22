let productos = []
let pagina = []
let page = 1

let link = "http://localhost:8080/api/products"
let link_handler = "http://localhost:8080/api/carts/648ccc29ca71f8147c552fec/products/"

let titulo = document.getElementById("products__search_input")
let buscar = document.getElementById("products__search_button")
let products_box = document.getElementById("products")

function busqueda(){
    if(titulo.value != ''){
        obtener_productos(link + '?title=' + titulo.value + "&page=" + page)
    }
    else(
        obtener_productos(link)
    )
}

buscar.addEventListener("click", busqueda)
titulo.addEventListener("keyup", (e) => {if(e.key == "Enter"){busqueda()}})

async function obtener_productos(link){
    products_box.innerHTML = ''
    await fetch(link)
    .then(resp => resp.json())
    .then(resp => pagina = resp.response)
    .then(() => productos = pagina.docs)
    .then(() => products_box.innerHTML += productos.map(card).join(''))
    .then(() => {
        pages()

        for(let i = 0; i <productos.length; i++){
            let cod = productos[i]._id
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
                        socket.emit("cart_update")
                    }
                })
                .catch(err => console.error(err))
            })
        }
    })

}

function card (prod){
    let id = prod._id
    let resp = `
                <div class="product_card">
                    <a href="/products/${id}">
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

function pages (){
    let prev = `<button id="prev"><-</button>`
    let next = `<button id="next">-></button>`

    let botones = document.getElementById("pages")
    if(pagina.prevPage){
        botones.innerHTML += prev
    }
    if(pagina.nextPage){
        botones.innerHTML += next
    }
}

obtener_productos(link)