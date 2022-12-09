const express = require('express')
const Router = express.Router({ mergeParams:true })
const controllers = require('../controllers/reviews')

const logger = require('../controllers/logger')



Router.post('/', logger ,controllers.createReview)

module.exports = Router;