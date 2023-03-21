import users, { admin } from "../model/UserModel.js";
import jwt from 'jsonwebtoken'

export const refreshToken = async (req, res) => {
    try {
        const resfreToken = req.cookies.refreshToken
        if(!resfreToken) return res.sendStatus(401)
        const user = await users.findAll({
            where:{
                refresh_token : resfreToken
            }
        })
        if(!user[0]) return res.sendStatus(403)
        jwt.verify(resfreToken,process.env.REFRESH_TOKEN_SECRET,(err,decoded)=>{
            if(err) return res.sendStatus(403)
            const usrId = user[0].id
            const name = user[0].name
            const email = user[0].email
            const accessToken = jwt.sign({usrId,name,email},process.env.ACCESS_TOKEN_SECRET,{
                expiresIn : '15s'
            })
            res.json({ accessToken })
        })
    } catch (error) {
        console.log(error)
    }
}
export const refreshTokenAdmin = async (req, res) => {
    try {
        const resfreToken = req.cookies.refreshToken
        if(!resfreToken) return res.sendStatus(401)
        const user = await admin.findAll({
            where:{
                refresh_token : resfreToken
            }
        })
        if(!user[0]) return res.sendStatus(402)
        jwt.verify(resfreToken,process.env.ALHAMDULILLAH_BRO,(err,decoded)=>{
            // return res.json(process.env)
            if(err) return res.sendStatus(403)
            const usrId = user[0].id
            const name = user[0].name
            const email = user[0].email
            const accessToken = jwt.sign({usrId,name,email},process.env.COBA_BRO_OKE,{
                expiresIn : '15s'
            })
            res.json({ accessToken })
        })
    } catch (error) {
        console.log(error)
    }
}