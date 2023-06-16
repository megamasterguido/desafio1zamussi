import mongoose from "mongoose";

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: {type:String, required: true},
    description: {type:String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type:String, default: "https://th.bing.com/th/id/R.085fa773f6d278ccc06e31bb2ac8d795?rik=jjgfRStSU7Zpfw&pid=ImgRaw&r=0"},
    stock: {type: Number, default: 10}
})

export const productModel = mongoose.model(productCollection, productSchema);