// creating an error handler
const errorHandler = (err, req, res, next) => {
    console.error(err.stack);
    // if the error seen is in the customError below
    // return the error message
    if (err instanceof CustomError){
        return res.status(err.status).json({error:err.message});
    }
    // if it 500 return internal server erroe
    return res.status(500).json({err:"Internal Sever Error!"});
}

class CustomError extends Error{
    // CustomError handles error found
    // constructor accepts message and default 500 for status
    constructor(message, status=500) {
        super(message)
        this.name = this.constructor.name
        this.status = status
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = {errorHandler, CustomError}