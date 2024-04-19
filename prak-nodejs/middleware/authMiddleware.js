const jwt = require("jsonwebtoken")
const path = require("path")

module.exports = (req, res, next) => {
    try {
        const token = req.cookies.token
        if (!token) {
            // res.status(401).json({ message: "Token not found" })
            res.status(401).sendFile(
                path.join(__dirname, "../public/errorAuth.html")
            )
        } else {
            req.user = jwt.verify(token, process.env.SECRET_KEY)
            next()
        }
    } catch (e) {
        console.log(e)
        res.send({ message: "Server error" })
    }
}
