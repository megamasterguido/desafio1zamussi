import ProductDaoMongo from './dao/Mongo/classes/productDao.js'
import CartDaoMongo from './dao/Mongo/classes/cartDao.js'
import UserDaoMongo from './dao/Mongo/classes/authDao.js'
import program from './process.js'
import UserManager from './dao/FS/managers/UserManager.js'
import CartManager from './dao/FS/managers/CartManager.js'
import ProductManager from './dao/FS/managers/ProductManager.js'
import mongoose from 'mongoose'
import config from './config.js'


let productDAO
let cartDAO
let userDAO

let service = program.opts().service

switch (service) {
    case "FS":
        productDAO = ProductManager
        cartDAO = CartManager
        userDAO = UserManager
        break;

    default:
        mongoose.connect(config.link_mongo)
        productDAO = ProductDaoMongo
        cartDAO = CartDaoMongo
        userDAO = UserDaoMongo
        break;
}

export {
    productDAO,
    cartDAO,
    userDAO
}