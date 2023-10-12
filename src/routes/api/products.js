import CustomRouter from "../router.js"
import productController from "../../controllers/product.controller.js"


class ProductRouter extends CustomRouter{
    init(){
        this.get('/',
            [],
            productController.getProducts
        )

        this.get('/:pid',
            [],
            productController.getProduct
        )

        this.post('/',
            ['admin'],
            productController.addProduct
        )

        this.put('/:pid',
            ['admin'],
            productController.updateProduct
        )

        this.delete('/:pid',
            ['admin'],
            productController.deleteProduct
            )
    }
}


export default new ProductRouter()