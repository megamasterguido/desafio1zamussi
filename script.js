class ProductManager{
    constructor(){
        this.products = []
    }

    getProducts(){
        return this.products;
    }

    getProductById(id){
        let resp = this.products.find(prod => prod.id == id)

        if(resp == undefined){
            console.error("No existe un producto con ese ID en la lista")
        }
        else{
            return resp
        }
    }

    addProduct(title, description, price, thumbnail, stock){
        let flag = false;
        this.products.forEach(prod => {
            if(prod.title == title && prod.description == description && prod.price == price && prod.thumbnail == thumbnail && prod.stock == stock){
                flag = true
            }
        })
        if(flag){
            console.error("Ya existe un producto con esas propiedades en la lista")
        }
        else{
            this.products.push({id: this.products.length, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock})
        }
    }
}

let Prueba = new ProductManager()

console.log(Prueba.getProducts())

Prueba.addProduct("Eje Drean Punta Redonda Original", "Eje del lavarropas Drean 166 original", 10000, "https://www.serviceitalia.com.ar/images/uploads/ecommerce/1718.jpg", 100)
console.log(Prueba.getProducts())
Prueba.addProduct("Eje Drean Punta Redonda Original", "Eje del lavarropas Drean 166 original", 10000, "https://www.serviceitalia.com.ar/images/uploads/ecommerce/1718.jpg", 100)
Prueba.addProduct("Eje Drean Punta Redonda Original", "Eje del lavarropas Drean 166 original", 9999, "https://www.serviceitalia.com.ar/images/uploads/ecommerce/1718.jpg", 100)

Prueba.addProduct("Eje Drean Punta Redonda Copia", "Eje del lavarropas Drean 166 copia marca ACyC", 4000, "https://www.serviceitalia.com.ar/images/uploads/ecommerce/1719_3.jpg", 0)
console.log(Prueba.getProducts())

console.log(Prueba.getProductById(1))
Prueba.getProductById(2)