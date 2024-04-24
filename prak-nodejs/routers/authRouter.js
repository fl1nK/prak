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
        return res.status(400).json({
            error: "Користувач з такою електроною адресою вже існує!",
        })
    }

    const hashPassword = bcrypt.hashSync(password, 7)
    const user = new User({ email, password: hashPassword })
    await user.save()

    res.status(200).json({
        message: "Користувача було успішно створено!",
    })
})

router.get("/login", checkTokenAndRedirect("/home"), (req, res) => {
    res.sendFile(path.join(__dirname, "../public/login.html"))
})

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body
        const user = await User.findOne({ email })

        const isPassValid = bcrypt.compareSync(password, user.password)
        if (!isPassValid || !user) {
            return res.status(400).json({
                error: "Невірниа ел. пошта чи пароль, повторіть спробу!",
            })
        }

        const token = jwt.sign({ id: user.id }, process.env.SECRET_KEY, {
            expiresIn: "1h",
        })
        res.cookie("username", email, { maxAge: 60 * 60 * 1000 })
        res.cookie("token", token, { maxAge: 60 * 60 * 1000 }) // 1 день в мілісекундах
        res.json({ message: "Користувач успішно авторизований!" })
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
        return res.status(400).json({ message: "Паролі не співпадають!" })
    }

    const hashPassword = bcrypt.hashSync(password, 7)
    await User.findByIdAndUpdate({ _id: userID }, { password: hashPassword })

    res.status(400).json({ message: "Пароль успішно змінено!" })
})

router.get("/home", checkToken, (req, res) => {
    res.sendFile(path.join(__dirname, "../public/home.html"))
})

router.get("/out", checkToken, (req, res) => {
    res.clearCookie("token")
    res.clearCookie("username")
    res.redirect("/login")
})

router.get("/test", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/test.html"))
})

router.post("/test", (req, res) => {
    const { name } = req.body
    res.json({ message: `Дані успішно отримані: ${name}` })
})

module.exports = router
