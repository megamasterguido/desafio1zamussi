export default class UserDTO{
    constructor(user){
        this._id = user._id
        this.cart = user.cart
        this.role = user.role
        this.mail = user.mail
    }
}