import {productDAO, cartDAO, userDAO} from "./factory.js"
import UserRepository from "./repository/user.repository.js"
import CartRepository from "./repository/cart.repository.js"
import ProductRepository from "./repository/product.repository.js"

let productService = new ProductRepository(new productDAO())
let cartService = new CartRepository(new cartDAO())
let userService = new UserRepository(new userDAO())

export {
    productService,
    cartService,
    userService
}