const jwt = require('jsonwebtoken');
const { CustomError } = require('./error');

const verifyToken = (req, res, next) => {
    // get token from cookies.token
    const token = req.cookies.token;
    // throw error if no token
    if (!token) {
        throw new CustomError("You are not authenticated!", 401);
    }
    // verify token
    jwt.verify(token, process.env.JWT_SECRET,async(err,data)=>{
        if (err) {
            throw new CustomError("Token is not valid!", 403);
        }
        // the userid is equal to data gotten from cookie id
        req.userId=data._id;
        console.log(req);
        next();
    });
}

module.exports = verifyToken;