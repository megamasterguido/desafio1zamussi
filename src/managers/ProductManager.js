import fs from 'fs'

export default class ProductManager{
    constructor(path){
        this.products = []
        this.path = path
        this.lastId = 0
        this.ks = this.init(this.path)
    }

    init(path){
        let file = fs.existsSync(path)
        let resp
        if(file){
            let archivo = fs.readFileSync(path, "UTF-8")
            try{
                this.products = JSON.parse(archivo)
                resp = "Datos recuperados"
                for(const prod in this.products){
                    if(prod.id >= this.lastId){
                        this.lastId = prod.id+1
                    }
                }
            }
            catch{
                resp = "Datos irrecuperables"
            }
        }
        else{
            fs.writeFileSync(path, "[]")
            resp = "Archivo creado"
        }
        return resp
    }

    getProducts(){
        let resp = "getProducts: error"
        if(this.ks != "Datos irrecuperables"){
            this.products.length == 0? resp = "Not found" : resp = this.products
        }
        return resp
    }

    getProductById(id){
        let resp = "getProductById: error"
        let find = this.products.find(prod => prod.id == id)
        if(this.ks != "Datos irrecuperables"){
            find == undefined? resp = "Not found" : resp = find
        }
        
        return resp
    }

    alreadyIn(title){
        let resp = false
            this.products.forEach(prod => {
                if(prod.title == title){
                    resp = true
                }
            })
        return resp
    }

    updateId(){
        let resp = 0
        this.products.forEach(prod => {
            if(resp < prod.id){
                resp = prod.id
            }
        })
        return resp
    }

    addProduct(title, description, price, thumbnail, stock = 0){
        let resp = "addProduct: error"

        if(this.ks != "Datos irrecuperables"){

            if(title != undefined && description != undefined && price != undefined && thumbnail != undefined){
                if(this.alreadyIn(title)){
                    resp = "Ya existe este producto en la lista"
                }
                if(resp != "Ya existe este producto en la lista"){

                    this.lastId = this.updateId()
                    this.lastId++
                    this.products.push({id: this.lastId, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock})
                    resp = this.lastId
                    fs.writeFileSync(this.path, JSON.stringify(this.products,null,2))
                }

            }
        }

        return resp
    }

    updateProduct(id, data){
        let resp = "updateProduct: error"
        if(this.ks != "Datos irrecuperables" && data.title != undefined && data.description != undefined && data.price != undefined && data.thumbnail != undefined){
            let prod = this.products.find(producto => producto.id == id)
            let repetido = this.products.find(producto => producto.title == data.title)
            if(repetido != undefined && repetido != prod && prod != undefined){
                resp = "Ya existe este producto en la lista"
            }
            else if(prod == undefined){
                resp = "Not found"

            }
            else{
                prod.title = data.title
                prod.description = data.description
                prod.price = data.price
                prod.thumbnail = data.thumbnail

                data.stock == undefined? prod.stock = prod.stock: prod.stock = data.stock

                resp = "updateProduct: done"
                fs.writeFileSync(this.path, JSON.stringify(this.products,null,2))
            }

        }
        return resp
    }

    deleteProduct(id){
        let resp = "deleteProduct: error"
        if(this.ks != "Datos irrecuperables"){
            let prod = this.products.find(producto => producto.id == id)
            if(prod){
                this.products.splice(this.products.indexOf(prod), 1)
                resp = "deleteProduct: done"
                fs.writeFileSync(this.path, JSON.stringify(this.products,null,2))
            }
            else{
                resp = "Not found"
            }
        }
        return resp
    }
}