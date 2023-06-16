socket.emit("cart_req")
socket.on("cart_res", async (data) => {
    carrito.innerHTML = ''
    for(let i = 0; i < data.length; i++){
        carrito.innerHTML += await cart_item(data[i])
        let less = document.querySelector(`#cart_item${data[i].id} .cart_item__less`)
        let more = document.querySelector(`#cart_item${data[i].id} .cart_item__more`)
        let del = document.querySelector(`#cart_item${data[i].id} .cart_item__delete`)
        less.addEventListener("click", () => less_handler(data[i].id))
        more.addEventListener("click", () => more_handler(data[i].id))
        del.addEventListener("click", () => delete_handler(data[i].id))
    }
    calcular_total()
    socket.emit("cart_update")
})

let carrito = document.getElementById("cart")
let total = document.getElementById("total")
let monto = 0

function calcular_total(){
    let cant = document.querySelectorAll(`.cart_item .total_price`)
    monto = 0
    for(let i = 0 ; i < cant.length; i++){
        monto += +cant[i].innerText.substring(1)
    }

    total.innerText = '$' + monto
}

async function delete_handler(id){
    let cant = +document.querySelector(`#cart_item${id} .units`).innerText
    await fetch("http://localhost:8080/api/carts/1/products/" + id + '/' + cant, {method: "DELETE"})
    .then(res => res.json())
    .then(res => res.response)
    .catch(err => console.error(err))

    socket.emit("cart_req")
}

async function less_handler(id){
    await fetch("http://localhost:8080/api/carts/1/products/" + id + '/' + 1, {method: "DELETE"})
    .then(res => res.json())
    .then(res => res.response)
    .catch(err => console.error(err))

    socket.emit("cart_req")
}

async function more_handler(id){
    await fetch("http://localhost:8080/api/carts/1/products/" + id + '/' + 1, {method: "PUT"})
    .then(res => res.json())
    .then(res => res.response)
    .catch(err => console.error(err))

    socket.emit("cart_req")
}

async function cart_item(item){
    let prod = await fetch("http://localhost:8080/api/products/"+item.id)
    .then(res => res.json())
    .then(res => res.response)
    .catch(err => console.error(err))

    let resp = `
    <div class="cart_item" id="cart_item${item.id}">
        <div class="id">${item.id}</div>
        <div class="title">${prod.title}</div>
        <div class="price">$${prod.price}</div>
        <button class="cart_item__less"> - </button>
        <div class="units">${item.units}</div>
        <button class="cart_item__more"> + </button>
        <div class="total_price">$${prod.price * item.units}</div>
        <button class="cart_item__delete"> X </button>
    </div>`

    return resp
}