import fs from 'fs'

export default class ProductManager{
    constructor(path){
        this.products = []
        this.path = path
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
                    if(prod._id >= this.lastId){
                        this.lastId = prod._id+1
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
        let find = this.products.find(prod => prod._id == id)
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

    addProduct(_id, title, description = '', price = 0, thumbnail = "https://th.bing.com/th/id/R.085fa773f6d278ccc06e31bb2ac8d795?rik=jjgfRStSU7Zpfw&pid=ImgRaw&r=0", stock = 0){
        let resp = "addProduct: error"

        if(this.ks != "Datos irrecuperables"){

            if(title != undefined){
                if(this.alreadyIn(title)){
                    resp = "Ya existe este producto en la lista"
                }
                if(resp != "Ya existe este producto en la lista"){

                    this.products.push({_id: _id, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock})
                    resp = this.lastId
                    fs.writeFileSync(this.path, JSON.stringify(this.products,null,2))
                }

            }
        }

        return resp
    }

    updateProduct(id, data){
        let resp = "updateProduct: error"
        if(this.ks != "Datos irrecuperables"){
            let prod = this.products.find(producto => producto._id == id)
            let repetido = data.title? this.products.find(producto => producto.title == data.title) : undefined
            if(repetido != undefined && repetido != prod && prod != undefined){
                resp = "Ya existe este producto en la lista"
            }
            else if(prod == undefined){
                resp = "Not found"

            }
            else{
                data.title ? prod.title = data.title : prod.title = prod.title
                data.description ? prod.description = data.description : prod.description = prod.description
                data.price ? prod.price = data.price : prod.price = prod.price
                data.thumbnail ? prod.thumbnail = data.thumbnail : prod.thumbnail = prod.thumbnail
                data.stock ? prod.stock = data.stock : prod.stock = prod.stock

                resp = "updateProduct: done"
                fs.writeFileSync(this.path, JSON.stringify(this.products,null,2))
            }

        }
        return resp
    }

    deleteProduct(id){
        let resp = "deleteProduct: error"
        if(this.ks != "Datos irrecuperables"){
            let prod = this.products.find(producto => producto._id == id)
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