import { userService } from "../service.js";
import UserDTO from "../dao/dto/user.dto.js";

class UserController{
    constructor(){
        this.userService = userService
    }

    register = async (req, res) => {
        try{
            return res.cookie('token',req.token, {maxAge: 60 * 60 * 1000, httpOnly: true}).sendSuccess(req.user, 201)
        }
        catch(error){
            return res.sendServerError(error)
        }
    }

    login = async (req, res) => {
        try{
            return res.cookie('token',req.token, {maxAge: 60 * 60 * 1000, httpOnly: true}).sendSuccess(req.user, 202)
        }
        catch(error){
            return res.sendServerError(error)
        }
    }

    logout = async(req, res) => {
        try{
            req.session.destroy()
            return res.clearCookie('token').sendSuccess("Cierre de sesión exitoso", 202)
        }
        catch(error){
            return res.sendServerError(error)
        }
    }

    github = async (req,res)=>{}

    githubCallBack = async (req,res)=> {
        res.status(200).cookie('token',req.token, {maxAge: 60 * 60 * 1000, httpOnly: true}).redirect('/auth/github_success')
    }

    githubFail = async (req,res)=> res.status(400).json({
        success: false,
        response:'bad auth'
    })

    current = async (req, res) => {
        try{
            const usuario = new UserDTO(req.user)
            return res.sendSuccess(usuario, 201)
        }
        catch(error){
            return res.sendServerError(error)
        }
    }

    addUser = async (data) => {
        return await userService.addUser(data)
    }

    getUser = async (uid) => {
        return await userService.getUser(uid)
    }

    signIn = async (mail) => {
        return await userService.signIn(mail)
    }
}

export default new UserController()