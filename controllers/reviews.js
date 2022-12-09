const Camp = require('../models/Camps')
const User = require('../models/User')
const Review = require('../models/Reviews')
const AppError = require('../err')

module.exports.reviewDelete = async function (req, res, next) {
    const { camp_id, id } = req.params;
    try {
        const data = await Camp.findById(camp_id)
        if (!data) {
            next(new AppError('Failed to delete'))
        } else {
            await Camp.findByIdAndUpdate(camp_id, { $pull: { reviews: id } })
            await Review.findByIdAndDelete(id)
            req.flash('error', 'Review deleted')
            res.redirect(`/post/${data._id}`)
        }
    } catch (error) {
        next(new AppError('Something not good', 500))
    }
}

module.exports.createReview = async function (req, res, next) {
    console.log(req.params);
    const { id } = req.params
    try {
        const data = await Camp.findById(id)
        if (!data) {
            next(new AppError('Failed to add review', 404))
        } else {
            const review = new Review(req.body)
            review.author = req.user._id
            data.reviews.push(review)
            review.camps.push(data)
            await data.save()
            await review.save()
            req.flash('success', 'Review has been posted')
            res.redirect(`/post/${data._id}`)
        }
    } catch (error) {
        next(new AppError('Something went wrong', 500))
    }
}
