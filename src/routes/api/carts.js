import cartController from "../../controllers/cart.controller.js"
import CustomRouter from "../router.js"

class CartRouter extends CustomRouter{
    init(){
        this.get(
            '/bills/:cid',
            [],
            cartController.getBill
        )
        
        this.get('/',
            [],
            cartController.getCarts
            )
        
        this.get('/:cid',
            [],
            cartController.getCart
            )
        
        this.post('/',
            [],
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
            [],
            cartController.deleteCart
        )

        this.post('/:cid/purchase',
            ['user'],
            cartController.purchase
        )
    }
}

export default new CartRouter()
