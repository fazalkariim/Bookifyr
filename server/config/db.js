import mongoose from "mongoose";

const connectDB = async ()=>{
    try {
        const connect = await mongoose.connect(process.env.MONGODB_URI)
        console.log(`Connected to DataBase : ${connect.connection.port}`)
    } catch (error) {
        console.log("Error while connecting to DataBase",error)
    }
}

export default connectDB;

