const { StatusCodes } = require('http-status-codes');
const { UserService } = require('../services');
const { SuccessResponse, ErrorResponse } = require('../utils/common');


/**
 * 
 * POST :/signup
 * req-body {email:'@def.com' , password:"12234"}
 */
async function signup(req, res) {
    try {
        const user = await UserService.create({
            email: req.body.email,
            password:req.body.password
        });
       SuccessResponse.data=user;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error=error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse)
    }
}


async function signin(req, res) {
    try {
        const user = await UserService.signin({
            email: req.body.email,
            password:req.body.password
        });
       SuccessResponse.data=user;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error=error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse)
    }
}

async function addRoleToUser(req, res) {
    try {
        const user = await UserService.addRoletoUser({
            role: req.body.role,
            id:req.body.id
        });
       SuccessResponse.data=user;
        return res
            .status(StatusCodes.CREATED)
            .json(SuccessResponse)
    } catch (error) {
        ErrorResponse.error=error;
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR)
            .json(ErrorResponse)
    }
}


module.exports={
    signup,
    signin,
    addRoleToUser
}