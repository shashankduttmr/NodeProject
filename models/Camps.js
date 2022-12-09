const mongoose = require('mongoose')

const { Schema } = require('mongoose')

const reviews = require('./Reviews')

const ImageSchema = new Schema({
    url: String,
    filename: String
})

ImageSchema.virtual('thumb').get(function(){
    return this.url.replace('/upload', '/upload/w_200');
})

const MyCamps = new Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [10, 'Price Must be greater then or equals to 10']
    },
    img: [ImageSchema],
    geomatry:{
        type: {
            type: String, // Don't do `{ location: { type: String } }`
            enum: ['Point'], // 'location.type' must be 'Point'
            required: true
          },
          coordinates: {
            type: [Number],
            required: true
          }
    },
    location: {
        type: String,
        required: [true, 'Location is mendatory']
    },
    description: {
        type: String,
        required: [true, 'You Must give description']
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
    },
    reviews: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Review'
        }
    ]
})

MyCamps.post('findOneAndDelete', async function (data) {
    if (data.reviews.length) {
        await reviews.deleteMany({ _id: { $in: data.reviews } })
    }
})



module.exports = mongoose.model('Camp', MyCamps)