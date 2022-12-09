const mongoose = require('mongoose')
const passportLocalMongoose = require('passport-local-mongoose')
const Schema = mongoose.Schema


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: [true, 'Email may be register try new one']
    },
    farm: [
        {
            type: Schema.Types.ObjectId,
            ref: 'Camp'
        }
    ]
})

UserSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model('User', UserSchema)