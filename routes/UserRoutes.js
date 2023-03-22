// import express from 'express'
const express = require('express')
const multer = require('multer');
// import multer from 'multer'
// import XLSX from 'xlsx'
// import { Logout, getUsers, Login, Submit, sisa } from './../controller/UserController.js'
const { Logout, getUsers, Login, Submit, sisa } = require('./../controller/UserController.js')
// import { LoginAdmin, siswa, mapelo, download, tambahMapel, hapusMapel, updateMapel, Register, ambilData, cariSiswa, LogoutAdmin, hapusSiswa, hapusPilihan, downloadTemplate, siswa2, atur, forInfo } from '../controller/AdminController.js'
const { LoginAdmin, siswa, mapelo, download, tambahMapel, hapusMapel, updateMapel, Register, ambilData, cariSiswa, LogoutAdmin, hapusSiswa, hapusPilihan, downloadTemplate, siswa2, atur, forInfo } = require('./../controller/AdminController.js')
// import { VerifyToken, VerifyTokenAdmin } from '../middleware/VerifyToken.js'
const { VerifyToken, VerifyTokenAdmin } = require('../middleware/VerifyToken.js')
// import { refreshToken, refreshTokenAdmin } from '../controller/RefreshToken.js'
const { refreshToken, refreshTokenAdmin } = require('../controller/RefreshToken.js')
// import path from 'path'

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, 'upload/');
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname);
    },
  });
const upload = multer({ storage:storage });
// const upload = multer({ storage: storage });

const router = express.Router()

router.post('/LoginAdmin', LoginAdmin)
router.post('/data', VerifyTokenAdmin, ambilData)
router.post('/data2', VerifyTokenAdmin, ambilData)
router.delete('/admin/logout', LogoutAdmin)
router.post('/users', VerifyTokenAdmin, Register)
router.get('/tokenAdmin', refreshTokenAdmin)
router.post('/hapusSiswa', VerifyTokenAdmin, hapusSiswa)
router.post('/hapusPilihan', VerifyTokenAdmin, hapusPilihan)
router.post('/cariSiswa', VerifyTokenAdmin, cariSiswa)
router.post('/download', VerifyTokenAdmin, download)

//route for siswa
router.post('/siswa', VerifyTokenAdmin, upload.single('file'), siswa)
router.post('/siswa2',VerifyTokenAdmin, siswa2)
router.get('/downloadTemplate', downloadTemplate)

//route for atur
router.post('/atur',VerifyTokenAdmin, atur)
router.get('/info', forInfo)


// route for mapel
router.post('/updateMapel', VerifyTokenAdmin, updateMapel)
router.post('/hapusMapel', VerifyTokenAdmin, hapusMapel)
router.post('/tambahMapel', VerifyTokenAdmin, tambahMapel)
router.post('/mapel', mapelo)
router.get('/mapel', mapelo)

//end for admin

router.post('/cariDataSiswa', VerifyToken, getUsers)
router.post('/submit', VerifyToken, Submit)
router.post('/sisa', sisa)
router.post('/login', Login)
router.delete('/logout', Logout)
router.get('/token', refreshToken)
//end for siswa


// export default router
module.exports = router