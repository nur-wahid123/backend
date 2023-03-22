// import users, { dataSiswa, admin, info, mapel, template } from "../model/UserModel.js";
const {users,  dataSiswa, admin, info, mapel, template } = require('../model/UserModel.js')
// import bcrypt, { hash } from 'bcrypt'
const bcrypt = require('bcrypt')
// import jwt from 'jsonwebtoken'
const jwt = require('jsonwebtoken')
// import { Sequelize } from "sequelize";
const { Sequelize } = require('sequelize')
// import xlsx from 'xlsx'
const xlsx = require('xlsx')
// import fs from 'fs'
const fs = require('fs')
// import path from 'path'
const path = require('path')


const LoginAdmin = async (req, res) => {
    try {
        const user = await admin.findAll({
            where: {
                email: req.body.email
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password)
        if (!match) return res.status(404).json({ msg: "Wrong Password" })
        const userId = user[0].id
        const name = user[0].name
        const email = user[0].email
        const accessToken = jwt.sign({ userId, name, email }, process.env.COBA_BRO_OKE, {
            expiresIn: '20s'
        })
        const refreshToken = jwt.sign({ userId, name, email }, process.env.ALHAMDULILLAH_BRO, {
            expiresIn: '1d'
        })
        // return res.json(process.env)
        await admin.update({ refresh_token: refreshToken }, {
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
        res.status(401).json({ msg: "Email Tidak Ditemukan" })
    }

}

const ambilData = async (req, res) => {
    const siswao = await dataSiswa.findAll()
    return res.json(siswao)
}

const LogoutAdmin = async (req, res) => {
    const resfreToken = req.cookies.refreshToken
    if (!resfreToken) return res.sendStatus(204)
    const user = await admin.findAll({
        where: {
            refresh_token: resfreToken
        }
    })
    if (!user[0]) return res.sendStatus(204)
    const userId = user[0].id
    await admin.update({ refresh_token: null }, {
        where: {
            id: userId
        }
    })
    res.clearCookie('refreshToken')
    return res.sendStatus(200)
}

const Register = async (req, res) => {
    try {
        const { name, email, password, confPassword } = req.body
        if (password !== confPassword) return res.status(400).json({ msg: "Password dan confirm password tidak cocok" })
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(password, salt)
        try {
            await admin.create({
                name: name,
                password: hashPassword,
                email: email,
            })
            res.json({ msg: "Register Berhasil" })
        } catch (error) {
            console.log(error)
        }
    } catch (err) {
        console.log(err)
    }
}

const hapusSiswa = async (req, res) => {
    try {

        const a = await dataSiswa.findAll({
            where: {
                nis: req.body.nis
            }
        })
        await dataSiswa.destroy({
            where: {
                nis: req.body.nis
            }
        })
        await users.destroy({
            where: {
                email: req.body.nis
            }
        })
        return res.json({ msg: `Data Siswa ${a[0].nama} Berhasil Dihapus` })
    } catch (error) {
        return res.json({ msg: `Data Siswa dengan NIS ${req.body.nis} tidak ditemukan` })
    }
}

const hapusPilihan = async (req, res) => {
    try {
        const a = await dataSiswa.findAll({
            where: {
                nis: req.body.nis
            }
        })
        await dataSiswa.update({
            pilihan: 0
        }, {
            where: {
                nis: req.body.nis
            }
        })
        return res.json({ msg: `Pilihan siswa ${a[0].nama} berhasil dihapus` })

    } catch (error) {
        return res.json({ msg: `Pilihan siswa berhasil dihapus` })

    }
}

const cariSiswa = async (req, res) => {
    try {
        let b = req.body.nis
        b = b.toUpperCase()
        const a = await dataSiswa.findAll({
            where: Sequelize.or(
                { nis: { [Sequelize.Op.like]: `%${b}%` } },
                { nisn: { [Sequelize.Op.like]: `%${b}%` } },
                { nama: { [Sequelize.Op.like]: `%${b}%` } }
            )

        });
        return res.json(a)

    } catch (error) {
        return res.sendStatus(404)
    }
}

const mapelo = async (req, res) => {
    const a = await mapel.findAll()
    return res.json(a)
}

const download = async (req, res) => {
    const currentDirectory = process.cwd();

    // Define the path to the output file
    try {
        // Fetch data from your database using your model
        const data = await dataSiswa.findAll({});

        // Convert the data to an array of objects
        const jsonData = JSON.parse(JSON.stringify(data));

        // Create a new workbook and add a worksheet
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(jsonData);

        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Write the workbook to a file
        const file = path.join(currentDirectory, 'output.xlsx');
        xlsx.writeFile(workbook, file);

        // Send the file as a response
        res.download(file, (error) => {
            if (error) res.status(403).send(error);

            // Delete the file after sending it
            fs.unlinkSync(file);
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error bro');
    }
}

const updateMapel = async (req, res) => {
    try {
        await mapel.update(req.body, {
            where: {
                id: req.body.id
            }
        })
        return res.json("Update Berhasil")
    } catch (error) {
        return res.json("Update Gagal")
    }
}

const hapusMapel = async (req, res) => {
    await mapel.destroy({
        where: {
            id: req.body.id
        }
    })
    return res.json("Kelompok Mapel " + req.body.kelompok + " Berhasil dihapus")
}

const tambahMapel = async (req, res) => {
    const a = await mapel.findAll({
        attributes:['kode']
    })
    a.forEach(element => {
        if(req.body.kode == element.kode) return res.sendStatus(401)
    });
    for (const key in req.body) {
        if (req.body[key] == '') req.body[key] = 0;
    }
    await mapel.create(req.body)
    return res.json("Pembuatan Kelompok Mapel Baru berhasil")
}

const siswa = async (req, res) => {
    if(req.file == null) return res.json(1)
    let b = req.file.originalname
    b = b.split('.')
    if(b[b.length-1] !== 'xls' || b[b.length-1]  !== 'xlsx') return res.json(2)
    try {
        const workbook = xlsx.readFile(req.file.path);
        const worksheet = workbook.Sheets['Sheet1'];
        const data = xlsx.utils.sheet_to_json(worksheet);
        dataSiswa.destroy({ truncate: true })
        users.destroy({ truncate: true })
        for (const row of data) {
            if(row.nisn === null || row.nis === null || row.nama === null || row.jenis_kelamin === null || row.kelas === null ) return
            try {
                const pw = row.nisn.toString()
                const salt = await bcrypt.genSalt()
                const hashPassword = await bcrypt.hash(pw, salt)
                

                await dataSiswa.create({
                    nama: row.nama,
                    jk: row.jenis_kelamin,
                    nis: row.nis,
                    nisn: row.nisn,
                    kelas: row.kelas,
                })

                await users.create({
                    name: row.nama,
                    email: row.nis,
                    password: hashPassword,
                })

            } catch (error) {
                console.error(error)
            }
        }
        return res.json(5)
    } catch (error) {
        return res.json("Halo Bro")
    }
}

const siswa2 = async (req, res) => {
    try {
        const pw = req.body.nisn.toString()
        const salt = await bcrypt.genSalt()
        const hashPassword = await bcrypt.hash(pw, salt)
        // return res.json(req.body)

        await dataSiswa.create({
            nama: req.body.nama,
            jk: req.body.jk,
            nis: req.body.nis,
            nisn: req.body.nisn,
            kelas: req.body.kelas,
        })

        await users.create({
            name: req.body.nama,
            email: req.body.nis,
            password: hashPassword,
        })

    } catch (error) {
        console.error(error)
        return res.json("Halo Bro")
    }
}

const downloadTemplate = async (req, res) => {
    const currentDirectory = process.cwd();

    // Define the path to the output file
    try {
        // Fetch data from your database using your model
        const data = await template.findAll({
            attributes: ['nama', 'nis', 'nisn', 'jenis_kelamin', 'kelas']
        });
        // res.status(500).send(data);

        // Convert the data to an array of objects
        const jsonData = JSON.parse(JSON.stringify(data));

        // Create a new workbook and add a worksheet
        const workbook = xlsx.utils.book_new();
        const worksheet = xlsx.utils.json_to_sheet(jsonData);

        // Add the worksheet to the workbook
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

        // Write the workbook to a file
        const file = path.join(currentDirectory, 'template.xlsx');
        xlsx.writeFile(workbook, file);

        // Send the file as a response
        res.download(file, (error) => {
            if (error) res.status(403).send(error);

            // Delete the file after sending it
            fs.unlinkSync(file);
        });

    } catch (error) {
        console.error(error);
        res.status(500).send('Internal server error broj');
    }
}

const atur = async (req, res) => {
    console.log(req.body);
    if (req.body.selectedFile != '') {
        await info.update({
            value: req.body.selectedFile
        }, {
            where: {
                id: 2
            }
        })
    }
    if (req.body.text != '') {
        const b = req.body.text
        await info.update({
            value: b
        }, {
            where: {
                id: 1
            }
        })
    }
    const c = req.body.tanggal
    await info.update({
        value: c
    }, {
        where: {
            id: 3
        }
    })
    return res.json(0)
}

const forInfo = async (req, res) => {
    const a = await info.findAll()
    return res.json(a)
}

module.exports = { LoginAdmin, siswa, mapelo, download, tambahMapel, hapusMapel, updateMapel, Register, ambilData, cariSiswa, LogoutAdmin, hapusSiswa, hapusPilihan, downloadTemplate, siswa2, atur, forInfo } 