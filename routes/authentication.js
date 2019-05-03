
module.exports =authenticationMiddleware = () =>{
    return function (req, res, next) {
        // console.log( req.session.userId+" user id");
        if (req.session.userId !== undefined) {
            return next()
        } else {
            // console.log("You Are Not Authenticated");
            res.render("login", {
                msg: "Please Login",
                title:'Maths Tution | Anthony Raj'
            });
        }
    }
};
