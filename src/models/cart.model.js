import {model, Schema, Types} from "mongoose";

const cartCollection = 'carts'

const cartSchema = new Schema({
    products: [
        {
            _id:{type:Types.ObjectId, ref:"products"},
            units: Number
        }
    ]
})

export const cartModel = model(cartCollection, cartSchema);