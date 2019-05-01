
global.loged=false;

module.exports.authenticationMiddleware = () =>{
    return function (req, res, next) {
        if (global.loged) {
            return next()
        } else {
            // console.log("You Are Not Authenticated");
            res.render("login", {
                msg: "Please Login"
            });
        }
    }
};
