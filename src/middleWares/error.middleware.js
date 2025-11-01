const ApiError = require('../utils/ApiError');



const errorHandler = (err, req, res, next)=>{
    let statusCode = 500;
    let message = "Internal Server Error";
    let errors = [];


if (process.env.NODE_ENV ==='development' ){
    console.error("---GLOBAL ERROR HANDLER---");
    console.error(err);
    console.error("--------------------------");    
}
if (err instanceof ApiError){
    statusCode = err.statusCode;
    message = err.message;
    errors = err.errors;
}

res.status(statusCode).json({
    success: false,
    message: message,
    errors: errors,

    stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
})
}

module.exports = errorHandler