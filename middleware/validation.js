import { validationResult } from "express-validator";

export const validate = (req, res, next)=>{
    const errors = validationResult(req);

    //success
    if(errors.isEmpty())
        return next();

    //error
    return res.status(422).json({
        errors:errors.array().map(error=>{return {[error.param]:error.msg}})
    })
}