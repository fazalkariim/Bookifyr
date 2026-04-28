import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    eventId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Event",
        required:true
    },
    status:{
        type:String,
        enum:['pending','confirmed','cancelled'],
        default:'pending'
    },

    paymentStatus:{
        type:String,
        enum:['non-paid','paid'],
        default:'non-paid'
    },
    amount:{
        type:Number,
        required:true
    }

},{timestamps:true})

export const Booking = mongoose.model("Booking",bookingSchema)