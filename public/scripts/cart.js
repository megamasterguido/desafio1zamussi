

socket.emit("cart_req")

socket.on("cart_res", async (data) => {
    cart_id = data._id
    let carrito = document.getElementById("cart")
    carrito.innerHTML = ''
    if(cart_id){
        for(let i = 0; i < data.products.length; i++){
            carrito.innerHTML += await cart_item(data.products[i])
        }
    
        data.products.forEach(async function(element){
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
    }
    else{
        carrito.innerHTML = `<span id="sinUsuario">Para agregar articulos al carrito debe iniciar sesion</span>`
    }
})

let total = document.getElementById("total")

async function calcular_total(){
    if(cart_id){
        await fetch("http://localhost:"+ port +"/api/carts/bills/" + cart_id)
            .then(resp=>resp.json())
            .then(resp => total.innerText = '$' + resp.response[0].total)
    }
}

async function delete_handler(id){
    if(cart_id){
        let cant = +document.querySelector(`#cart_item${id} .units`).innerText
        await fetch("http://localhost:"+ port +"/api/carts/" + cart_id + "/products/" + id + '/' + cant, {method: "DELETE"})
        .then(res => res.json())
        .then(res => res.response)
        .catch(err => console.error(err))
    
        socket.emit("cart_req")
    }
}

async function less_handler(id){
    if(cart_id){
        await fetch("http://localhost:"+ port +"/api/carts/" + cart_id + "/products/" + id + '/' + 1, {method: "DELETE"})
        .then(res => res.json())
        .then(res => res.response)
        .catch(err => console.error(err))
    
        socket.emit("cart_req")
    }
}

async function more_handler(id){
    if(cart_id){
        await fetch("http://localhost:"+ port +"/api/carts/" + cart_id + "/products/" + id + '/' + 1, {method: "PUT"})
        .then(res => res.json())
        .then(res => res.response)
        .catch(err => console.error(err))
    
        socket.emit("cart_req")
    }
}

async function cart_item(item){
    let prod = await fetch("http://localhost:"+ port +"/api/products/"+item._id._id)
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

let comprar = document.getElementById("finalizar_compra")
comprar.addEventListener("click", purchase)

async function purchase(){
    let purchase_datetime = new Date()
    let amount = parseInt(total.innerText.substr(1, total.innerText.length))
    let purchaser = await fetch("http://localhost:8080/api/auth/current").then(resp => resp.json()).then(resp => resp.response.mail).catch(err => console.error(err))

    let ticket = {
        purchase_datetime: purchase_datetime,
        amount: amount,
        purchaser: purchaser
        }

        console.log(cart_id)

    let resp = await fetch("http://localhost:8080/api/" + cart_id + "/purchase",
        {
        method:"POST",
        body: JSON.stringify(ticket)
        }
    )
        .then(resp => resp.json())
        .then(resp => {
            console.log(resp)
            return resp.response})
        .catch(err => console.error(err))

    console.log(resp)
}