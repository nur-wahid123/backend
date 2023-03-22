// import jwt from 'jsonwebtoken'
const jwt = require('jsonwebtoken')

const VerifyToken = (req, res, next) => {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err) return res.sendStatus(402)
        req.email = decoded.email
        next()
    })

}
const VerifyTokenAdmin = (req, res, next) => {
    const authHeader = req.headers['authorization']
    console.log(req.headers);
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.json('Maaf token admin kosong')
    jwt.verify(token, process.env.COBA_BRO_OKE, (err, decoded) => {
        if (err) return res.json('maaf verifikasi token admin gagal')
        req.email = decoded.email
        next()
    })

}

module.exports = { VerifyToken, VerifyTokenAdmin }