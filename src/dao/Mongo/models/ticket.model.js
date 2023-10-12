import {model, Schema, Types} from "mongoose";

const ticketCollection = 'tickets'

const ticketSchema = new Schema({
    purchase_datetime: Object,
    amount: Number,
    purchaser: String
})

export const ticketModel = model(ticketCollection, ticketSchema);