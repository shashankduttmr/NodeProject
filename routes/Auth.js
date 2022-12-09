const express = require('express')
const Router = express.Router()
const User = require('../models/User')
const passport = require('passport')
const user = require('../controllers/Auth')

Router.get('/register', user.register)

Router.post('/register', user.PostRegister)

Router.get('/login', user.login)

Router.post('/login', passport.authenticate('local', { failureFlash: true, failureRedirect: '/user/login'}), user.PostLogin)

Router.get('/logout', user.logout)


module.exports = Router