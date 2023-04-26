const fs = require("fs")
class ProductManager{
    constructor(path){
        this.products = []
        this.path = path
    }

    async getProducts(){
        let resp
        await fs.promises.readFile(this.path, "utf-8")
            .then(res => res == "" || res == "[]"? resp = "Not found" : resp = JSON.parse(res) )
            .catch(() => resp = "getProducts: error")
        return resp
    }

    async getProductById(id){
        let resp = "getProductById: error"
        let prods
        await fs.promises.readFile(this.path, "utf-8")
            .then(res => prods = JSON.parse(res))
            .catch(() => prods = "Error")
        
        console.log(prods)

        if(prods == "" || prods == "[]"){
            resp = "Not found"
        }
        else if(prods == "Error"){
            resp = "getProductById: error"
        }
        else{
            resp = JSON.parse(prods)
        }
        
        return resp
    }

    async addProduct(title, description, price, thumbnail, stock = 0){
        let resp = "addProduct: error"
        let vacio = await this.getProducts()

        if(typeof(vacio) != "string"){
            this.products = vacio

            this.products.forEach(prod => {
                if(prod.title == title){
                    resp = "Ya existe un producto con esas propiedades en la lista"
                }
            })
            if(resp != "Ya existe un producto con esas propiedades en la lista"){
                this.products.push({id: this.products.length+1, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock})
                resp = this.products.length
                fs.promises.writeFile(this.path, JSON.stringify(this.products,null,2))
            }
        }
        else if(vacio == "[]" || vacio == "getProducts: error" || vacio == "Not found" ){
            this.products.push({id: this.products.length+1, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock})
            resp = this.products.length
            fs.promises.writeFile(this.path, JSON.stringify(this.products,null,2))
        }

        return resp
    }

    async updateProduct(id, data){

    }
}

async function pruebas(){
    let prueba = new ProductManager("./Productos")
    console.log("1", await prueba.getProducts())
    console.log("2", await prueba.getProductById(1))
    console.log("3", await prueba.addProduct("Eje Drean Original", "Eje Drean Excellent 166 original", 12000, "https://www.serviceitalia.com.ar/images/uploads/ecommerce/1718.jpg"))
    console.log("4", await prueba.addProduct("Eje Drean Copia", "Eje Drean Excellent 166 original", 12000, "https://www.serviceitalia.com.ar/images/uploads/ecommerce/1718.jpg"))
    console.log("5", await prueba.getProducts())
    console.log("6", await prueba.getProductById(1))
}

pruebas()