import fs from 'fs'

export default class ProductManager{
    constructor(){
        this.products = []
        this.lastId = 0
        this.path = "src/dao/FS/data/products.json"
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
                this.products.forEach(prod => {
                    if(prod._id >= this.lastId){
                        this.lastId = prod._id
                    }
                })
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

    getProducts = (limit, page, title) => {
        limit = parseInt(limit)
        page = parseInt(page)
        let resp = {
            docs:[],
            totalDocs: this.products.length,
            limit: limit,
            totalPages: 0,
            page: page,
            pagingCounter: 1 + limit*(page-1),
            hasPrevPage: false,
            hasNextPage: true,
            prevPage: null,
            nextPage: 2
        }

        resp.totalPages = Math.ceil(resp.totalDocs/limit)

        for(let i = resp.pagingCounter - 1; i < resp.pagingCounter + limit - 1; i++){
            resp.docs.push(this.products[i])
        }

        resp.hasPrevPage = resp.page == 1? false : true
        resp.hasNextPage = resp.page == resp.totalPages? false : true

        resp.prevPage = resp.hasPrevPage ? parseInt(resp.page) - 1 : null
        resp.nextPage = resp.hasNextPage ? parseInt(resp.page) + 1 : null

        return resp
    }

    getProduct = (pid) => {
        let resp = this.products.find(prod => prod._id == pid)
        return resp
    }

    addProduct = (title, description = '', price = 0, thumbnail = "https://th.bing.com/th/id/R.085fa773f6d278ccc06e31bb2ac8d795?rik=jjgfRStSU7Zpfw&pid=ImgRaw&r=0", stock = 0) => {
        this.lastId++
        this.products.push({_id: this.lastId, title: title, description: description, price: price, thumbnail: thumbnail, stock: stock})
        
        fs.writeFileSync(this.path, JSON.stringify(this.products,null,2))

        return this.getProduct(this.lastId)
    }

    updateProduct = (pid, data) => {
        let resp = {before: '', after: ''}
        let prod = this.products.find(producto => producto._id == pid)

        resp.before = JSON.parse(JSON.stringify(prod))

        data.title ? prod.title = data.title : prod.title = prod.title
        data.description ? prod.description = data.description : prod.description = prod.description
        data.price ? prod.price = data.price : prod.price = prod.price
        data.thumbnail ? prod.thumbnail = data.thumbnail : prod.thumbnail = prod.thumbnail
        data.stock ? prod.stock = data.stock : prod.stock = prod.stock
        fs.writeFileSync(this.path, JSON.stringify(this.products,null,2), 'utf-8')

        resp.after = prod
        return resp
    }

    deleteProduct = (pid) => {
        const prod = this.getProduct(pid)
        const indice = this.products.indexOf(prod)
        this.products.splice(indice, 1)
        
        fs.writeFileSync(this.path, JSON.stringify(this.products,null,2))
    }
}