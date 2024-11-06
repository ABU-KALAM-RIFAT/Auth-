import express from "express"
import dotenv from "dotenv"

import connectdatabase from "./config/db.js"
import userRegisterRoutes from "./routes/authRoutes.js"
import userLoginRoutes from "./routes/authRoutes.js"

//express app
const app = express()

//config dotenv
dotenv.config()

//middleware
app.use(express.json())

//connect database
connectdatabase();

//port from .env
const PORT = process.env.PORT || 5000;

//import register routes
app.use("/api/routes/users", userRegisterRoutes )

//import login routes
app.use("/api/routes/users", userLoginRoutes )

//server setup
app.listen(PORT, ()=>{
   console.log(`your server is running at http://localhost:${PORT}`)
})