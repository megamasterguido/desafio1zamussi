import { Router } from "express";
import config from ".././config.js";
import { userModel } from "../dao/Mongo/models/user.model.js";
import jwt from 'jsonwebtoken'

export default class CustomRouter{
    constructor(){
        this.router = Router()
        this.init()
    }

    getRouter(){
        return this.router
    }

    init(){}

    get(path, ...callbacks){
        this.router.get(path, this.applyCallBacks(callbacks))
    }

    applyCallBacks(callbacks){
        return callbacks.map((callback) => async(...params) => {
            try{
                await callback.apply(this, params)
            }
            catch(error){
                console.error(error)
                params[1].status(500).send(error)
            }
        })
    }

    generateCustomResponses = (req, res, next) => {
        res.sendSuccess = (payload, status = 200) => res.status(status).json({success: true, response: payload})
        res.sendServerError = (error, status = 500) => res.status(status).json({success: false, error: error})
        res.sendUserError = (error, status = 400) => res.status(status).json({success: false, error: error})
        next()
    }

    handlePolicies = policies => (req, res, next) => {
        if(!policies.length) return next()

        const {token} = req.cookies
        if(!token) return res.sendUserError("Error de autenticacion", 401)

        jwt.verify(
            token,
            config.jwt,
            async(error,credentials) => {
                if(error) {
                    return res.sendUserError('No autorizado')
                }
                let user = await userModel.findOne({ mail:credentials.mail })
                req.user = user
            }
        )

        switch (policies[0]) {
            case "user":
                if(req.user.role == "user"){
                    return next()
                }
                else{
                    return res.sendUserError("Error de autorizacion", 401)
                }
            case "admin":    
                if(req.user.role == "admin"){
                    return next()
                }
                else{
                    return res.sendUserError("Error de autorizacion", 401)
                }
        
            default:
                return res.sendUserError("Error de autorizacion", 401)
        }
    }

    get(path, policies, ...callbacks){
        this.router.get(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallBacks(callbacks))
    }

    post(path, policies, ...callbacks){
        this.router.post(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallBacks(callbacks))
    }
    
    put(path, policies, ...callbacks){
        this.router.put(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallBacks(callbacks))
    }
    
    delete(path, policies, ...callbacks){
        this.router.delete(path, this.generateCustomResponses, this.handlePolicies(policies), this.applyCallBacks(callbacks))
    }
}