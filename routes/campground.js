const express = require('express')
const AppError = require('../err')
const logger = require('../controllers/logger')
const isAuthor = require('../controllers/isAuthor')
const Router = express.Router()
const { MyCamp } = require('../valid')
const controllers = require('../controllers/camps')
const multer = require('multer')
const {storage} = require('../Cloud/config')
const Upload = multer({storage:storage})




const Camps = function (req, res, next) {
    const d = MyCamp.validate(req.body)
    if (d.error) {
        next(new AppError(d.error.message, 418))
    } else {
        next()
    }
}

Router.get('/', controllers.home)

Router.get('/new', logger, controllers.create)
Router.post('/new', logger, Upload.array('img'), Camps, controllers.newCamp)
Router.get('/edit/:id', logger, isAuthor ,controllers.getEditPage)
Router.put('/edit/:id', logger, isAuthor, Upload.array('img'), Camps, controllers.update)
Router.get('/:id', controllers.show)
Router.delete('/data/:id', logger, isAuthor, controllers.deletecamp)

module.exports = Router;

