const express = require("express")
const path = require("path")

const User = require("../models/User")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")
const {
    checkToken,
    checkTokenAndRedirect,
} = require("../middleware/authMiddleware")

const router = express.Router()

router.get("/", (req, res) => {
    res.redirect("/registration")
})
router.get("/registration", checkTokenAndRedirect("/home"), (req, res) => {
    res.sendFile(path.join(__dirname, "../public/registration.html"))
})

router.post("/registration", async (req, res) => {
    const { email, password } = req.body

    const candidate = await User.findOne({ email })

    if (candidate) {
        return res
            .status(400)
            .sendFile(path.join(__dirname, "../public/errorRegistration.html"))

        // return res.status(400).json({
        //     message: `Користувач з такою ел. адресою ${email} всже існує!`,
        // })
    }

    const hashPassword = bcrypt.hashSync(password, 7)
    const user = new User({ email, password: hashPassword })
    await user.save()
    return res.redirect("/login")

    // return res.json({ message: "Користувача було створено", redirect: "/login" })
})

router.get("/login", checkTokenAndRedirect("/home"), (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"))
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        if (!user) {
            return res
                .status(400)
                .sendFile(path.join(__dirname, "../public/errorLogin.html"))
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
    } catch (e) {
        console.log(e)
        res.send({ message: "Server error" })
    }
})

router.get("/changePassword", checkToken, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/changePassword.html"))
})

router.post("/changePassword", checkToken, async (req, res) => {
    const { password, confirmPassword } = req.body
    const token = req.cookies.token

    const decodedToken = jwt.verify(token, process.env.SECRET_KEY)
    const userID = decodedToken.id

    if (password != confirmPassword) {
        return res.json({ message: "Паролі не співпадають!" })
    }

    const hashPassword = bcrypt.hashSync(password, 7)
    await User.findByIdAndUpdate({ _id: userID }, { password: hashPassword })

    // return res.json({
    //     message: "Пароль змінено",
    //     redirect: "/home",
    // })

    res.sendFile(path.join(__dirname, "../public/afterChangePassword.html"))
})

router.get("/getcookie", (req, res) => {
    const token = req.cookies.token
    res.json({ token: token })
})

router.get("/home", checkToken, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/home.html"))
})

router.get("/out", checkToken, (req, res) => {
    res.clearCookie("token")
    res.redirect("/login")
})

module.exports = router
