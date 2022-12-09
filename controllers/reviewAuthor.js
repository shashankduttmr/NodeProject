const reviews = require('../models/Reviews')
const camps = require('../models/Camps')

const ReviewAuthor = async function(req, res, next){
    const {camp_id, id} = req.params
    const review = await reviews.findById(id)
    const camp = await camps.findById(camp_id)
    if((review.author.equals(req.user._id) || camp.author.equals(req.user._id))){
        next()
    }else{
        req.flash('error', 'You do not have authority to to this action. ')
        res.redirect('/user/login')
    }
}

module.exports = ReviewAuthor