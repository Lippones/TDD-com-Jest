const express = require('express')
const app = express()

const bcrypt = require('bcrypt')
const jwt = require("jsonwebtoken")
const jwtConfig = require("../jwt.config.json")

const User = require('./models/User')
const e = require('express')

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.post('/user', async (req, res) => {
    const { name, email, password } = req.body
    if (name === "" || email === "" || password === "") {
        return res.status(400).json({ error: "Invalid username or password" })
    }
    try {
        const result = await User.findOne({ email })

        if (result == null) {
            const salt = await bcrypt.genSalt(10)
            const hash = await bcrypt.hash(password, salt)
            const newUser = new User({
                name,
                email,
                password: hash
            })

            await newUser.save()
            res.status(201).json({ email })
        } else {
            res.status(400).json({ error: 'Usuario já cadastrado' })
        }

    } catch (error) {
        res.status(500).json({ error })
        console.log(error)
    }
})

app.post('/auth', async (req, res) => {
    const { email, password } = req.body
    if (email.trim() == "" || password.trim() == "") {
        res.status(400).json()
        return
    }
    try {
        const result = await User.findOne({ email: email })
        if (result != null) {
            const authPass = await bcrypt.compare(password, result.password)
            if (authPass) {
                jwt.sign({ email }, jwtConfig.secret, { expiresIn: '48h' }, (err, token) => {
                    if (err) {
                        res.sendStatus(500)
                        console.log(err)
                    } else {
                        res.status(200).json({ token })
                    }
                })
                return
            } else {
                res.status(401).json()
                return
            }
        } else {
            res.status(401).json({ error: "User not found" })
            return
        }
    } catch (err) {
        res.sendStatus(500)
        console.log(err)
    }
})

app.delete('/user/:email', async (req, res) => {
    await User.deleteOne({ email: req.params.email })
    res.status(200).json({})
})

module.exports = app