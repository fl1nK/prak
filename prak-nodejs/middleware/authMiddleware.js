const jwt = require("jsonwebtoken")
const path = require("path")

// Мідлвара для перевірки токену
const checkToken = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            return res
                .status(401)
                .sendFile(path.join(__dirname, "../public/errorAuth.html"))
        }
        req.user = jwt.verify(token, process.env.SECRET_KEY)
        next()
    } catch (error) {
        console.error(error)
        res.status(500).send({ message: "Server error" })
    }
}

// Функція для перевірки наявності токену і редіректу
const checkTokenAndRedirect = (redirectTo) => (req, res, next) => {
    const token = req.cookies.token
    if (token) {
        res.redirect(redirectTo)
    } else {
        next()
    }
}

module.exports = {
    checkToken,
    checkTokenAndRedirect,
}
