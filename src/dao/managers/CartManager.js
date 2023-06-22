import fs from 'fs'

export default class CartManager{
    constructor(path){
        this.carts = []
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
                this.carts = JSON.parse(archivo)
                resp = "Datos recuperados"
                for(const cart in this.carts){
                    if(cart._id >= this.lastId){
                        this.lastId = cart._id+1
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

    addCart(){
        let resp
        for(let item in cart){
            if(item._id == undefined || item.quantity == undefined){
                resp = "addCart: error"
            }
        }
        if(resp != "addCart: error"){
            this.lastId = this.updateId()
            this.lastId++
            resp = this.lastId
            this.carts.push({_id: resp, products: cart})
            fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2))
        }
        return resp
    }

    getCarts(){
        let resp = "getCarts: error"
        if(this.ks != "Datos irrecuperables"){
            this.carts.length == 0? resp = "Not found" : resp = this.carts
        }
        return resp
    }

    getCartById(id){
        let resp = "getCartsById: error"
        let find = this.carts.find(cart => cart._id == id)
        if(this.ks != "Datos irrecuperables"){
            find == undefined? resp = "Not found" : resp = find
        }
        
        return resp
    }

    addProduct(cid, pid, units){
        let resp = this.getCartById(cid)
        if(typeof(resp) != 'string'){
            try{
                let prods = fs.readFileSync("src/data/products.json")
                prods = JSON.parse(prods)
                let findProd = prods.find(prod => prod._id == pid)
                if(findProd){

                    if(units > findProd.stock){
                        resp = "addProduct: No se pueden agregar tantas unidades"
                    }
                    else{
                        findProd.stock -= +units
                        let find = resp.products.find(prod => prod._id == pid)
                        if(find){
                            find.units += +units
                        }
                        else{
                            resp.products.push({_id: pid, units: +units})
                        }
                        fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2))
                        fs.writeFileSync("src/data/products.json", JSON.stringify(prods, null, 2))
                    }
                }
                else{
                    resp = "addProduct: Producto no encontrado"
                }
            }
            catch{
                resp = "addProduct: Datos de productos irrecuperables"
            }
            
        }
        else if (resp == "getCartsById: error"){
            resp = "addProduct: error"
        }
        
        return resp
    }

    deleteProduct(cid, pid, units){
        let resp = this.getCartById(cid)
        
        if(typeof(resp) != 'string'){
            let find = resp.products.find(prod => prod._id == pid)
            if(find){
                
                if(units > find.units){
                    resp = "deleteProduct: No se pueden quitar tantas unidades"
                }
                else{
                    find.units -= units

                    try{
                        let prods = fs.readFileSync("src/data/products.json")
                        prods = JSON.parse(prods)
                        let findProd = prods.find(prod => prod._id == pid)
                        findProd.stock += units
                        fs.writeFileSync("src/data/products.json", JSON.stringify(prods, null, 2))
                    }
                    catch{
                        console.error("deleteProduct: No se pudo encontrar el articulo en la base de datos, pero se retiro igualmente del carrito.")
                    }

                    if(find.units == 0){
                        resp.products.splice(resp.products.indexOf(find),1)
                    }
                    fs.writeFileSync(this.path, JSON.stringify(this.carts,null,2))
                }

            }
            else{
                resp = "deleteProduct: Producto no encontrado en el carrito"
            }
        }
        else if (resp == "getCartsById: error"){
            resp = "deleteProduct: error"
        }
        
        return resp
    }
}