const express = require('express')
const Router = express.Router()
const User = require('../models/User')
const passport = require('passport')
const AppError = require('../err')


module.exports.register = function (req, res, next) {
    if (req.user) {
        res.redirect('/')
    } else {
        res.render('users/register')
    }
}


module.exports.PostRegister = async function (req, res, next) {
    const { email, username, password } = req.body
    try {
        const user = new User({ email, username })
        const newUser = await User.register(user, password)
        req.login(newUser, function (err) {
            if (err) {
                req.flash('error', 'Login Failed')
                res.redirect('/user/login')
            } else {
                req.flash('success', 'Welcome to Yelp')
                res.redirect('/')
            }
        })
    } catch (error) {
        req.flash('error', error.message)
        res.redirect('/user/register')
    }
}

module.exports.login = function (req, res, next) {
    if (req.user) {
        res.redirect('/')
    } else {
        res.render('users/login')
    }
}

module.exports.PostLogin = async function (req, res) {
    req.flash('success', 'Welcome back again')
    const redirecturl = req.session.redirects || '/'
    console.log(`Hello ${redirecturl}`);
    console.log(`This is from ${req.session.redirects}`);
    res.redirect(redirecturl)
}


module.exports.logout = function(req, res, next){
    if(req.isAuthenticated()){
        req.logout(function (err) {
            if (err) {
                req.flash('error', 'Failed to Logout')
                res.redirect('/')
            } else {
                req.flash('success', 'GoodBye !')
                res.redirect('/')
            }
        })
    }else{
        req.flash('error', 'Something went wrong')
        res.redirect('/')
    }
}