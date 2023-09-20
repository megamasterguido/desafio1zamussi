import cartController from "../../controllers/cart.controller.js"
import CustomRouter from "../router.js"

class CartRouter extends CustomRouter{
    init(){
        this.get(
            '/bills/:cid',
            ['user'],
            cartController.getBill
        )
        
        this.get('/',
            ['user'],
            cartController.getCarts
            )
        
        this.get('/:cid',
            ['user'],
            cartController.getCart
            )
        
        this.post('/',
            ['user'],
            cartController.addCart
            )
        
        this.put("/:cid/products/:pid/:units",
            ['user'],
            cartController.addProduct
            )

        this.delete("/:cid/products/:pid/:units",
            ['user'],
            cartController.deleteProduct
            )

        this.delete("/:cid",
            ['user'],
            cartController.deleteCart
        )
    }
}

export default new CartRouter()
