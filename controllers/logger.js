const Logger = function(req, res, next){
    if(req.isAuthenticated()){
        next()
    }else{
        req.session.redirects = req.originalUrl
        req.flash('error', 'you must be signed in')
        res.redirect('/user/login')
    }
}

module.exports = Logger