socket.emit("cart_req")
socket.on("cart_res", async (data) => {
    let carrito = document.getElementById("cart")
    carrito.innerHTML = ''

    for(let i = 0; i < data.length; i++){
        carrito.innerHTML += await cart_item(data[i])
    }

    data.forEach(async function(element){
        const cod = element._id._id

        const less = document.getElementById(`cart_item__less${cod}`)
        const more = document.getElementById(`cart_item__more${cod}`)
        const del = document.getElementById(`cart_item__delete${cod}`)

        less.addEventListener("click", async () => await less_handler(cod))
        more.addEventListener("click", async () => await more_handler(cod))
        del.addEventListener("click", async () => await delete_handler(cod))
    });
    await calcular_total()
    socket.emit("cart_update")
})


async function calcular_total(){
    
    let total = document.getElementById("total")
    await fetch("http://localhost:8080/api/carts/bills/648ccc29ca71f8147c552fec")
        .then(resp=>resp.json())
        .then(resp => total.innerText = '$' + resp.response[0].total)

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
    let prod = await fetch("http://localhost:8080/api/products/"+item._id._id)
    .then(res => res.json())
    .then(res => res.response)
    .catch(err => console.error(err))

    let resp = `
    <div class="cart_item" id="cart_item${item._id._id}">
        <div class="id">${item._id._id}</div>
        <div class="title">${prod.title}</div>
        <div class="price">$${prod.price}</div>
        <button class="cart_item__less" id="cart_item__less${item._id._id}"> - </button>
        <div class="units">${item.units}</div>
        <button class="cart_item__more" id="cart_item__more${item._id._id}"> + </button>
        <div class="total_price">$${prod.price * item.units}</div>
        <button class="cart_item__delete" id="cart_item__delete${item._id._id}"> X </button>
    </div>`

    return resp
}