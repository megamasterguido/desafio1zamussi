export default class CartRepository{
    constructor(dao){
        this.dao = dao
    }

    getBill = async (cid) => {
        return await this.dao.getBill(cid)
    }
    
    getCarts = async (limit) => {
        return await this.dao.getCarts(limit)
    }

    getCart = async (cid) => {
        return await this.dao.getCart(cid)
    }

    addCart = async () => {
        return await this.dao.addCart()
    }
    
    addProduct = async (cid, pid, units) => {
        return await this.dao.addProduct(cid, pid, units)
    }

    deleteProduct = async (cid, pid, units) => {
        return await this.dao.deleteProduct(cid, pid, units)
    }
    
    deleteCart = async (cid) => {
        return await this.dao.deleteCart(cid)
    }

    purchase = async (purchase_datetime, amount, purchaser, cid) => {
        return await this.dao.purchase(purchase_datetime, amount, purchaser, cid)
    }
}