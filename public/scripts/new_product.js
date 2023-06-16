let title = document.getElementById("form__title")
let description = document.getElementById("form__description")
let price = document.getElementById("form__price")
let thumbnail = document.getElementById("form__thumbnail")
let stock = document.getElementById("form__stock")
let submit = document.getElementById("form__submit")

let flag = 0

if(window.location.href == "http://localhost:8080/new_product/db"){
    flag = 1
}

async function escuchaSubmit (){
    let nuevo = JSON.stringify({
        title: title.value,
        description: description.value,
        price: price.value,
        thumbnail: thumbnail.value,
        stock: stock.value
    })

    let config = {
        mode: "cors",
        method: "POST",
        headers: { "Content-Type": "application/json" }, 
        body: nuevo
    }

    let link = "http://localhost:8080/api/products/"

    if(flag){
        link = "http://localhost:8080/api/products/db/"
    }

    await fetch(link, 
            config
        )
    .then(resp => resp.json())
    .then(resp => {
        console.log(resp)
        if(typeof(resp.response) != "string"){
            alert("Articulo cargado con éxito. Será redirigido al catálogo.")
            let redi = "http://localhost:8080/products/"
            if(flag){
                redi = "http://localhost:8080/products/db"
            }
            window.location.href = redi
        }
        else{
            alert(resp.response)
        }
        })
    .catch(err => console.error(err))
    .catch(err => alert(err))
}

submit.addEventListener("click",escuchaSubmit)