import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import authRoute from './routes/Auth.js'
import roomRoute from './routes/Rooms.js'
import hotelRoute from './routes/Hotals.js'
import userRoute from './routes/User.js'
import cookieParser from 'cookie-parser';


dotenv.config()


const port = process.env.PORT

const app = express()

app.use(cookieParser())

app.use(express.json())
app.use(cors())


app.use('/api/auth', authRoute)
app.use('/api/rooms', roomRoute)
app.use('/api/hotels', hotelRoute)
app.use('/api/user', userRoute)



app.use((err, req, res, next) => {
    const ErrorStatus = err.status || 500
    const ErrorMessage = err.message || "Somethings is wrong"
    res.status(ErrorStatus).json({
        success: false,
        status: ErrorStatus,
        message: ErrorMessage,
        stack: err.stack

    })


})

mongoose.connect(process.env.DATABASE).then(() => console.log("Database connected successfully"))
    .catch((err) => console.log("error", err))

app.listen(port, () => {
    console.log(`Our server are running on port ${port}`)
})