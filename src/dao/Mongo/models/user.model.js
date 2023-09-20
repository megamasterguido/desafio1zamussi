import {model, Schema, Types} from 'mongoose'

const userCollection = 'users'

const userSchema = new Schema({
    first_name: {type: String, required: true, index: true},
    last_name: {type: String, required: true, index: true},
    photo: {type: String, default:'https://www.logolynx.com/images/logolynx/03/039b004617d1ef43cf1769aae45d6ea2.png'},
    mail: {type: String, index: true, required: true, unique: true},
    age: Number,
    role: {type: String, enum: ['user','admin'], default: 'user'},
    password: {type: String, required: true},
    cart: {type: Types.ObjectId, ref: "carts"}
})

export const userModel = model(userCollection, userSchema)