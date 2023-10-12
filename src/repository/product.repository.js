export default class ProductRepository{
    constructor(dao){
        this.dao = dao
    }

    getProducts = async (limit, page, title) => {
        return await this.dao.getProducts(limit, page, title)
    }
    
    getProduct = async (pid) => {
        return await this.dao.getProduct(pid)
    }

    addProduct = async (
        title,
        description,
        price,
        thumbnail,
        stock) => {
        return await this.dao.addProduct(
            title,
            description,
            price,
            thumbnail,
            stock)
    }

    deleteProduct = async (pid) => {
        return await this.dao.deleteProduct(pid)
    }
    
    updateProduct = async (pid, nuevo) => {
        return await this.dao.updateProduct(pid, nuevo)
    }
}