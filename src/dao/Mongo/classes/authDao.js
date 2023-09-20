import { userModel } from "../models/user.model.js";

class authDaoMongo{
    constructor(){
        this.userModel = userModel
    }

    getUser = async (uid) => {
        return await userModel.findById(uid)
    }

    signIn = async (mail) => {
        return await userModel.findOne({mail: mail})
    }

    addUser = async (data) => {
        return await userModel.create(data)
    }
}

export default authDaoMongo