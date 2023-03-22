// import { Sequelize } from "sequelize";
const {Sequelize} = require('sequelize')
// import db from "../config/Database.js";
const db = require('../config/Database.js');

const {DataTypes} = Sequelize

const dataSiswa = db.define('daat',{
    urut:{
        type : DataTypes.STRING,
        primaryKey:true,
        autoIncrement:true,
        field:'urut'
    },
    nis:{
        type : DataTypes.STRING,
        field:'NO'
    },
    nisn:{
        field:'NISN',
        type : DataTypes.STRING
    },
    jk:{
        field:'JK',
        type : DataTypes.STRING
    },
    kelas:{
        field:'KELAS',
        type : DataTypes.STRING
    },
    pilihan:{
        field:'pilihan',
        type : DataTypes.INTEGER
    },
    nama:{
        type : DataTypes.STRING
    },
},{
    timestamps:false,
    tableName:'datakeseluruhan',
    initialAutoIncrement:'urut'
})

const template = db.define('daat',{
    urut:{
        type : DataTypes.STRING,
        allowNull:false,
        field:'urut'
    },
    nis:{
        type : DataTypes.STRING,
        field:'NO'
    },
    nisn:{
        field:'NISN',
        type : DataTypes.STRING
    },
    jenis_kelamin:{
        field:'JK',
        type : DataTypes.STRING
    },
    kelas:{
        field:'KELAS',
        type : DataTypes.STRING
    },
    nama:{
        type : DataTypes.STRING
    },
},{
    timestamps:false,
    tableName:'template',
    initialAutoIncrement:'urut'
})

const admin = db.define('admin',{
    name:{
        type : DataTypes.STRING
    },
    email:{
        type : DataTypes.STRING
    },
    password:{
        type : DataTypes.STRING
    },
    refresh_token:{
        type : DataTypes.TEXT,
    },
},{
    tableName:'admins',
    timestamps:false
})

const mapel = db.define('mapel',{
    kelompok:{
        type : DataTypes.STRING
    },
    mapel1:{
        type : DataTypes.STRING
    },
    mapel2:{
        type : DataTypes.STRING
    },
    mapel3:{
        type : DataTypes.STRING
    },
    mapel4:{
        type : DataTypes.STRING
    },
    mapel5:{
        type : DataTypes.STRING
    },
    mapel6:{
        type : DataTypes.STRING
    },
    url:{
        type : DataTypes.TEXT
    },
    kode:{
        type : DataTypes.INTEGER
    },
    jumlah:{
        type : DataTypes.INTEGER
    },
},{
    tableName:'mapel',
    timestamps:false
})

const info = db.define('info',{
    infoName:{
        type : DataTypes.STRING
    },
    value:{
        type : DataTypes.STRING
    },
},{
    tableName:'info',
    timestamps:false
})

const users = db.define('user',{
    name:{
        type : DataTypes.STRING
    },
    email:{
        type : DataTypes.STRING
    },
    password:{
        type : DataTypes.STRING
    },
    refresh_token:{
        type : DataTypes.TEXT,
        field:'remember_token'
    },
},{
    freezeTableName:true,
    tableName:'users'
})

module.exports = {users,  dataSiswa, admin, info, mapel, template }