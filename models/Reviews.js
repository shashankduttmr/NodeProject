const mongoose = require('mongoose')

const {Schema} = require('mongoose')

const MyReviews = new Schema({
    rating:{
        type:Number,
        required:true,
    },
    body:{
        type:String,
        required:true
    },
    camps:[
        {
            type:Schema.Types.ObjectId,
            ref:'Camp'
        }
    ],
    author:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
})

module.exports = mongoose.model('Review', MyReviews)
