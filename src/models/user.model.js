import {model, Schema} from 'mongoose'

const userCollection = 'users'

const userSchema = new Schema({
    name: {type: String, required: true, index: true},
    photo: {type: String, default:'https://www.logolynx.com/images/logolynx/03/039b004617d1ef43cf1769aae45d6ea2.png'},
    mail: {type: String, index: true, required: true, unique: true},
    age: Number,
    role: {type: Number, default: 0},
    password: {type: String, required: true}
})

export const userModel = model(userCollection, userSchema)