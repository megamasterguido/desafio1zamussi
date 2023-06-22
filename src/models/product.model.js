import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const productCollection = 'products'

const productSchema = new mongoose.Schema({
    title: {type:String, required: true, index: true},
    description: {type:String, default: ''},
    price: {type: Number, default: 0},
    thumbnail: {type:String, default: "https://th.bing.com/th/id/R.085fa773f6d278ccc06e31bb2ac8d795?rik=jjgfRStSU7Zpfw&pid=ImgRaw&r=0"},
    stock: {type: Number, default: 0}
})

productSchema.plugin(mongoosePaginate)
export const productModel = mongoose.model(productCollection, productSchema);