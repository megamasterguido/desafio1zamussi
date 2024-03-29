let title = document.getElementById("form__title")
let description = document.getElementById("form__description")
let price = document.getElementById("form__price")
let thumbnail = document.getElementById("form__thumbnail")
let stock = document.getElementById("form__stock")
let submit = document.getElementById("form__submit")

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
        headers: { "Content-Type": "application/json",
                    "authorization": ''}, 
        body: nuevo
    }

    let link = "http://localhost:"+ port +"/api/products/"

    await fetch(link, 
            config
        )
    .then(resp => resp.json())
    .then(resp => {
        if(typeof(resp.response) != "string"){
            alert("Articulo cargado con éxito. Será redirigido al catálogo.")
            window.location.href = "http://localhost:"+ port +"/products/"
        }
        else{
            alert(resp.response)
        }
        })
    .catch(err => console.error(err))
    .catch(err => alert(err))
}

submit.addEventListener("click",escuchaSubmit)