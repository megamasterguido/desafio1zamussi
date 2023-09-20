import {productModel} from "../models/product.model.js"

class ProductsDaoMongo{
    constructor(){
        this.productModel = productModel
    }
    getProducts = async(limit, page, title) => {
        return await this.productModel.paginate(
                        {title},
                        {limit, page}
                        )
    }
    getProduct = async(pid) => {
        return await this.productModel.findById(pid)
    }
    addProduct = async(title, description, price, thumbnail, stock) => {
        return await productModel.create({
                        title,
                        description,
                        price,
                        thumbnail,
                        stock
                    })
    }
    updateProduct = async (pid, nuevo) => {
        let resp = {before: '', after: ''}
        let one = await productModel.findByIdAndUpdate(pid, nuevo)
        resp.before = one
        one = await productModel.find({_id: pid})
        resp.after = one
        return resp

    }
    deleteProduct = async (pid) => {
        await productModel.findByIdAndDelete(pid)
    }
}

export default ProductsDaoMongo