const express = require('express')
const Router = express.Router({mergeParams:true})

Router.get('/', function(req, res){
    res.cookie('name', 'shashank dutt')
    res.render('index')
})

module.exports = Router