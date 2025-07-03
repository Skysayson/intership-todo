const express = require('express')
const router = express.Router()
const db = require('../db')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

router.post('/register', async (req,res) => {
    const {email, password} = req.body

    if(!email || !password) {
        return res.status(400).json({message: 'Missing email or password'})
    }

    try {
            db.query('SELECT * FROM `user-auth` WHERE email = ?', [email], async (err, results) => {
            if (err) return res.status(500).json({message: 'db error'})
                
            if(results.length > 0) {
                return res.status(500).json({message: 'user already exists'})   
            } else {
                  const hashPassword = await bcrypt.hash(password, 10);

                db.query('INSERT INTO `user-auth` (email, password) VALUES (?,?)', [email, hashPassword], (err, result) => {
                    if (err) return res.status(500).json({message: 'error creating user', error: err})
                        res.status(200).json({message: 'successfully registered user'})
                })
            }

        })
    } catch (err) {
        if (err) return res.status(500).json({message: 'internal server error: ', err})
    }
})

router.post('/login', async (req,res) => {
    const {email, password} = req.body

    if(!email || !password) {
       return res.status(400).json({message: 'email and password cannot be empty'})
    }

    try {
        db.query('SELECT * FROM `user-auth` WHERE email = ?', [email], async (err, result) => {
            if (result.length === 0) {
                return res.status(400).json({message: "user does not exist"})
            }

            const user = result[0];

            const isMatch = await bcrypt.compare(password, user.password)

            if(!isMatch) {
                return res.status(401).json({message: 'Incorrect Password'})
            }

            const token = jwt.sign(
                {
                    id: user.id,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            )

            return res.status(200).json({token, message: 'successfully logged in', email: user.email})
        })
    } catch(err) {
        if(err) return res.status(500).json({message: 'internal server error'})
    }
})

module.exports = router