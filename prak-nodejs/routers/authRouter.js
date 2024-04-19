const express = require("express")
const path = require("path")

const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const authMiddleware = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/", (req, res) => {
    res.redirect("/registration")
})
router.get("/registration", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/registration.html"))
})

router.post("/registration", async (req, res) => {
    const { email, password } = req.body

    const candidate = await User.findOne({ email })

    if (candidate) {
        return res.sendFile(
            path.join(__dirname, "../public/errorRegistration.html")
        )

        // return res.status(400).json({
        //     message: `Користувач з такою ел. адресою ${email} всже існує!`,
        // })
    }

    const hashPassword = bcrypt.hashSync(password, 7)
    const user = new User({ email, password: hashPassword })
    await user.save()
    return res.json({ message: "Користувача було створено" })
})

router.get("/login", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"))
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res
                .status(404)
                .json({ message: "Такого користувача не існує!" })
        }

        const isPassValid = bcrypt.compareSync(password, user.password)
        if (!isPassValid) {
            return res.status(400).json({ message: "Невірний пароль" })
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        })
        res.cookie("token", token, { maxAge: 24 * 60 * 60 * 1000 }) // 1 день в мілісекундах
        res.redirect("/home")
        // res.json({
        //     token,
        //     user: {
        //         id: user.id,
        //         email: user.email,
        //     },
        // })
    } catch (e) {
        console.log(e)
        res.send({ message: "Server error" })
    }
})

router.get("/getcookie", (req, res) => {
    const token = req.cookies.token
    res.json({ token: token })
})

router.get("/home", authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/home.html"))
})

router.get("/changePassword", authMiddleware, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/changePassword.html"))
})

router.get("/out", authMiddleware, (req, res) => {
    res.clearCookie("token")
    res.redirect("/login")
})

module.exports = router
