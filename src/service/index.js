import ProductDaoMongo from '../dao/Mongo/classes/productDao.js'
import CartDaoMongo from '../dao/Mongo/classes/cartDao.js'
import UserDaoMongo from '../dao/Mongo/classes/authDao.js'
import program from '../process.js'
import UserManager from '../dao/FS/managers/UserManager.js'
import CartManager from '../dao/FS/managers/CartManager.js'
import ProductManager from '../dao/FS/managers/ProductManager.js'


let productService
let cartService
let userService

let service = program.opts().service

if(service === "FS"){
    productService = new ProductManager()
    cartService = new CartManager()
    userService = new UserManager()
}
else{
    productService = new ProductDaoMongo()
    cartService = new CartDaoMongo()
    userService = new UserDaoMongo()
}

export {
    productService,
    cartService,
    userService
}