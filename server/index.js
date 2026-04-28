import express from "express"
import dotenv from "dotenv"
import cors from "cors"
import connectDB from "./config/db.js"
import authRoutes from "./routes/auth.js"
import eventRoutes from "./routes/events.js"
import bookingRoutes from "./routes/booking.js"


dotenv.config({quiet:true})

const app = express()
const port = process.env.PORT || 8000

app.use(express.json())
app.use(cors())
app.use(express.json())


app.use("/api/auth",authRoutes)
app.use("/api/event",eventRoutes)
app.use("/api/bookings",bookingRoutes)


connectDB()

app.listen(port,()=>{
    console.log(`Server is running on PORT : ${port}`)
})