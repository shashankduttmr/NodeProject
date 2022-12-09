const Camp = require('../models/Camps')
const AppError = require('../err')
const User = require('../models/User')
const {cloudinary} = require('../Cloud/config')
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding')
const pro = process.env.mapBox
const test = mbxGeocoding({accessToken:pro})

module.exports.home = async function(req, res, next){
    try {
        const data = await Camp.find({})
        if(!data){
            next(new AppError('Failed to retrive data', 404))
        }else{
            res.render('home', {data})
        }
    } catch (error) {
        next(new AppError('Something went wrong', 500))
    }   
}

module.exports.create = function (req, res) {
    res.render('new')
}

module.exports.getEditPage = async function (req, res) {
    try {
        const { id } = req.params;
        const data = await Camp.findById(id)
        if (!data) {
            next(new AppError('Failed to Update', 500))
        } else {
            res.render('edit', { data })
        }
    } catch (error) {
        next(new AppError('SOmething went wrong', 500))
    }
}

module.exports.update = async function (req, res, next) {
    try {
        const { id } = req.params
        const data = await Camp.findById(id)
        console.log(req.body);
        if (!data) {
            next(new AppError('Failed to Update', 500))
        } else {
            const imgss = req.files.map((e)=>({url:e.path, filename:e.filename}))
            data.img.push(...imgss)
            await data.save()
            await Camp.findByIdAndUpdate(id, req.body, { runValidators: true })
            if(req.body.deleteImages){
                for(let x = 0; x < req.body.deleteImages.length; x++){
                    await cloudinary.uploader.destroy(req.body.deleteImages[x])
                }
                await data.updateOne({$pull:{img:{filename:{$in:req.body.deleteImages}}}})
            }
            req.flash('success', 'You have updated this post')
            res.redirect(`/post/${id}`)
        }
    } catch (error) {
        next(new AppError('Something went wrong', 500))
    }
}

module.exports.newCamp = async function (req, res, next) {
    const data = await test.forwardGeocode({
        query: req.body.name+',' +req.body.location,
        limit: 1
    }).send()
    try {
        const yelp = new Camp(req.body)
        if (!yelp) {
            next(new AppError('Failed to make a Post', 404))
        } else {
            yelp.author = req.user._id
            yelp.img = req.files.map(e=>({url:e.path, filename:e.filename}))
            yelp.geomatry = data.body.features[0].geometry
            req.user.farm.push(yelp)
            await req.user.save()
            await yelp.save()
            req.flash('success', 'You have made a Post')
            res.redirect(`/post/${yelp._id}`)
        }
    } catch (error) {
        console.log(error);
        next(new AppError('Something went wrong', 500))
    }
}

module.exports.show = async function (req, res, next) {
    try {
        const { id } = req.params
        const data = await Camp.findById(id).populate({
            path:'reviews',
            populate:{
                path:'author'
            }
        }).populate('author')
        if (!data) {
            req.flash('error', 'not found')
            next(new AppError('Place not found', 404))
        } else {
            res.render('show', { data })
        }
    } catch (error) {
        next(new AppError('Something went wrong', 500))
    }
}

module.exports.deletecamp = async function(req, res, next){
    try {
        const {id} = req.params
        const data = await Camp.findById(id)
        if(!data){
            next(new AppError('Failed to Delete', 404))
        }else{
            await Camp.findByIdAndDelete(id)
            console.log(req.user._id);
            await User.findByIdAndUpdate(req.user._id, {$pull:{farm:id}})
            console.log(data.img);
            if(data.img.length){
                for(let x = 0; x < data.img.length; x++){
                    await cloudinary.uploader.destroy(data.img[x].filename)
                }
            }
            req.flash('error', 'You Have deleted a Farm')
            res.redirect('/post')
        }
    } catch (error) {
        console.log(error);
        next(new AppError('Something went wrong', 500))
    }
}