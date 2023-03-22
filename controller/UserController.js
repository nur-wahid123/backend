// import users, { dataSiswa, mapel } from "../model/UserModel.js";
const {esers, dataSiswa,mapel} = require('./../model/UserModel.js')
// import bcrypt from 'bcrypt'
const bcrypt = require('bcrypt');
const jwt =require('jsonwebtoken')


const getUsers = async (req, res) => {
    try {
        const user = await dataSiswa.findAll({
            where: {
                nis: req.body.nis
            }
        })
        return res.json(user)
    } catch (err) {
        console.log(err)
    }
}

const Login = async (req, res) => {
    try {
        const user = await users.findAll({
            where: {
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if (!match) return res.status(404).json({ msg: "Wrong Password" })
        const userId = user[0].id
        const name = user[0].name
        const email = user[0].email
        const accessToken = jwt.sign({ userId, name, email }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '20s'
        })
        const refreshToken = jwt.sign({ userId, name, email }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        })
        await users.update({ refresh_token: refreshToken }, {
            where: {
                id: userId
            }
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        })
        res.json({ accessToken })
    } catch (error) {
        res.status(404).json({ msg: "email tidak ditemukan" })
    }
}

const Logout = async (req, res) => {
    const resfreToken = req.cookies.refreshToken
    if (!resfreToken) return res.sendStatus(204)
    const user = await users.findAll({
        where: {
            refresh_token: resfreToken
        }
    })
    if (!user[0]) return res.sendStatus(204)
    const userId = user[0].id
    await users.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}

const Submit = async (req, res) => {
    await dataSiswa.update({
        pilihan: req.body.pilihan
    }, {
        where: {
            urut: req.body.id
        }
    })
    return res.json({msg:"Data Berhasil di update"})
}

const sisa = async (req, res) => {
    const a = await dataSiswa.count({
        where: {
            pilihan: req.body.kode
        }
    })
    return res.json(a)
}

module.exports = { Logout, getUsers, Login, Submit, sisa }

