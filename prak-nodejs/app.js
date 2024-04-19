const express = require("express")
const mongoose = require("mongoose")
require("dotenv").config()
const cookieParser = require("cookie-parser")

const authRouter = require("./routers/authRouter.js")

const app = express()

const PORT = process.env.PORT || 3001
const MONGODB_URL = process.env.MONGODB_URL

mongoose
    .connect(MONGODB_URL)
    .then(() => console.log("Connected to DB"))
    .catch((error) => console.log(error))

app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(authRouter)

app.use(express.static(__dirname + "/public"))
app.listen(PORT, () => {
    console.log(`Server starting on port ${PORT}`)
})
