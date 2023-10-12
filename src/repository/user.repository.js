export default class UserRepository{
    constructor(dao){
        this.dao = dao
    }

    addUser = async (data) => {
        return await this.dao.addUser(data)
    }

    getUser = async (uid) => {
        return await this.dao.getUser(uid)
    }
    
    signIn = async (mail) => {
        return await this.dao.signIn(mail)
    }
}