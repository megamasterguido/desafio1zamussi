import CustomRouter from "../router.js"
import productController from "../../controllers/product.controller.js"


class ProductRouter extends CustomRouter{
    init(){
        this.get('/',
            ['user'],
            productController.getProducts
        )

        this.get('/:pid',
            ['user'],
            productController.getProduct
        )

        this.post('/',
            ['admin'],
            productController.addProduct
        )

        this.put('/:pid',
            ['user'],
            productController.updateProduct
        )

        this.delete('/:pid',
            ['user'],
            productController.deleteProduct
            )
    }
}


export default new ProductRouter()