let productos = []
let pagina = []
let page = 1

let link = "http://localhost:8080/api/products"
let link_handler = "http://localhost:8080/api/carts/648ccc29ca71f8147c552fec/products/"

let titulo = document.getElementById("products__search_input")
let buscar = document.getElementById("products__search_button")
let products_box = document.getElementById("products")

function busqueda(){
    obtener_productos(link + '?title=' + titulo.value + "&page=" + page)
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
        
        pages()
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
    let first = `<button id="first"><<</button>`
    let last = `<button id="last">>></button>`

    let botones = document.getElementById("pages")
    botones.innerHTML = ''
    let totalpages = pagina.totalPages

    if(pagina.prevPage){
        botones.innerHTML += first
        botones.innerHTML += prev
    }

    botones.innerHTML += '<div id="pages__nums"></div>'
    let botonera = document.getElementById("pages__nums")

    let min = page-3<1? 1: page-3

    for(let i = min ; i < page; i++){
        botonera.innerHTML += `<button class="page_button">${i}</button>`
    }

    botonera.innerHTML += page

    let max = (+page+3 > totalpages) ? totalpages : +page+3

    for(let j = +page + 1; j <= max; j++){
        botonera.innerHTML += `<button class="page_button">${j}</button>`
    }

    if(pagina.nextPage){
        botones.innerHTML += next
        botones.innerHTML += last
        document.getElementById("last").addEventListener("click", () => {page = totalpages; busqueda()})
    
    }
    
    let back = document.getElementById("prev")
    if(back){
        back.addEventListener("click", () => {page--; busqueda()})
        document.getElementById("first").addEventListener("click", () => {page = 1; busqueda()})
    }

    let forward = document.getElementById("next")
    if(forward){
        forward.addEventListener("click", () => {page = +page+1; busqueda()})
    }

    let page_buttons = Array.from(document.getElementsByClassName("page_button"))
    page_buttons.forEach(boton => {
        boton.addEventListener("click", ()=>{page = +boton.innerHTML; busqueda()})
    });
}

obtener_productos(link)