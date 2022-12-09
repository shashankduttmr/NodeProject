const Camp = require('../models/Camps')
const isAuthor = async function(req, res, next){
    const {id} = req.params
    const camp = await Camp.findById(id)
    if (!camp.author.equals(req.user._id)) {
        req.flash('error', 'Sorry you are not allowed')
        res.redirect(`/camp/${id}`)
    }else{
        next()
    }
}

module.exports = isAuthor