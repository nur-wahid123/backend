// import { Sequelize } from "sequelize";  

const {Sequelize} = require('sequelize')
// const db = new Sequelize('indra','root','',{
const db = new Sequelize('pily4743_kelas','pily4743_admin','trialbro123',{
    host:'localhost',
    dialect:'mysql'
})
module.exports = db
// export default db