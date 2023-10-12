let cod = window.location.href.substring(31)
let prod

async function agregar_al_carrito(cod, units){
    if(cart_id){
        fetch("http://localhost:"+ port +"/api/carts/" + cart_id +"/products/" + cod +"/"+units, {method: "PUT"})
            .then(resp => resp.json())
            .then(resp => {
                if(resp.error){
                    alert(resp.error)
                }
                else{
                    socket.emit("cart_update")
                }
            })
            .catch(err => console.error(err))
    }
    else{
        let admin = await fetch("http://localhost:8080/api/auth/current")
            .then(resp => resp.json())
            .then(resp => resp.success)
            .catch(err => console.error(err))
        
        console.log(admin)

        if(admin){
            alert("Los administradoes no pueden comprar.")
        }
        else{
            alert("Para agregar articulos al carrito debe iniciar sesion.")
        }
    }
}

fetch("http://localhost:"+ port +"/api/products/"+cod)
    .then(resp => resp.json())
    .then(resp => prod = resp.response)
    .then(() => landing(prod))
    .then(() => {
        let button
        let input = document.getElementById("add_cart__input")

        button = document.getElementById("add_cart__button")
            button.addEventListener("click",  async () => agregar_al_carrito(cod, input.value))
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