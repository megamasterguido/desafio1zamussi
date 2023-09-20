import fs from 'fs'
import CartManager from './CartManager.js'

let carts = new CartManager()

export default class UserManager{
    constructor(){
        this.users = []
        this.lastId = 0
        this.path = "src/dao/FS/data/users.json"
        this.ks = this.init(this.path)
    }

    init(path){
        let file = fs.existsSync(path)
        let resp
        if(file){
            let archivo = fs.readFileSync(path, "UTF-8")
            try{
                this.users = JSON.parse(archivo)
                resp = "Datos recuperados"
                this.users.forEach(user => {
                    if(user._id >= this.lastId){
                        this.lastId = user._id
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

    getUser = (uid) => {
        return this.users.find(user => user._id == uid)
    }

    signIn = (mail) => {
        return this.users.find(user => user.mail == mail)
    }

    addUser = (data) => {
        this.lastId++
        let resp = {
            _id: this.lastId,
            first_name: data.first_name,
            last_name: data.last_name,
            photo: data.photo,
            mail: data.mail,
            age: data.age,
            role: data.role,
            password: data.password,
            cart: carts.addCart()
        }

        this.users.push(resp)
        fs.writeFileSync(this.path, JSON.stringify(this.users,null,2))

        return resp
    }
}