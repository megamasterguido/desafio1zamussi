socket.emit("cart_req")
socket.on("cart_res", async (data) => {
    let carrito = document.getElementById("cart")
    carrito.innerHTML = ''

    for(let i = 0; i < data.length; i++){
        const cod = data[i].id
        carrito.innerHTML += await cart_item(data[i])
    }

    data.forEach(async function(element){
        const cod = element.id

        const less = document.getElementById(`cart_item__less${cod}`)
        const more = document.getElementById(`cart_item__more${cod}`)
        const del = document.getElementById(`cart_item__delete${cod}`)

        less.addEventListener("click", async () => await less_handler(cod))
        more.addEventListener("click", async () => await more_handler(cod))
        del.addEventListener("click", async () => await delete_handler(cod))
    });
    calcular_total()
    socket.emit("cart_update")
})

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
    await fetch("http://localhost:8080/api/carts/648ccc29ca71f8147c552fec/products/" + id + '/' + cant, {method: "DELETE"})
    .then(res => res.json())
    .then(res => res.response)
    .catch(err => console.error(err))

    socket.emit("cart_req")
}

async function less_handler(id){
    await fetch("http://localhost:8080/api/carts/648ccc29ca71f8147c552fec/products/" + id + '/' + 1, {method: "DELETE"})
    .then(res => res.json())
    .then(res => res.response)
    .catch(err => console.error(err))

    socket.emit("cart_req")
}

async function more_handler(id){
    await fetch("http://localhost:8080/api/carts/648ccc29ca71f8147c552fec/products/" + id + '/' + 1, {method: "PUT"})
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
        <button class="cart_item__less" id="cart_item__less${item.id}"> - </button>
        <div class="units">${item.units}</div>
        <button class="cart_item__more" id="cart_item__more${item.id}"> + </button>
        <div class="total_price">$${prod.price * item.units}</div>
        <button class="cart_item__delete" id="cart_item__delete${item.id}"> X </button>
    </div>`

    return resp
}