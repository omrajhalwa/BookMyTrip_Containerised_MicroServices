const {StatusCodes} = require('http-status-codes');



const info=(req,res)=>{
   // console.log(req.headers['emailid']);
    return res.status(StatusCodes.OK).json({
        success:true,
        message:"api is live and ready",
        error:{},
        data:{ }
    })
}

module.exports={

     info
};