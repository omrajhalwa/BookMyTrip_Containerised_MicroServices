const { StatusCodes } = require('http-status-codes');
const {BookingService} = require('../services');

const { SuccessResponse,ErrorResponse} = require('../utils/common');

const inMemDb={};

async function createBooking(req ,res) {
    try{

        const emailId = req.headers['emailid'];
        console.log(emailId);
        if(!emailId){
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message:'User is not logged in'});
        }
        console.log(req);
       console.log(JSON.parse(Object.keys(req.body)[0]));
       const object = JSON.parse(Object.keys(req.body)[0]);

       const response = await BookingService.createBooking({
        flightId: object.flightId,
        userId: object.userId,
        noOfSeats : object.noOfSeats
       });

       SuccessResponse.data = response;

       return res
                .status(StatusCodes.OK)
                .json(SuccessResponse);
    }catch(error){
        ErrorResponse.error = error;


        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}


async function makePayment(req, res) {
   
    try {
        
        console.log(JSON.parse(Object.keys(req.body)[0]));
        const object = JSON.parse(Object.keys(req.body)[0]);

        const emailId = req.headers['emailid'];

        if(!emailId){
            return res
            .status(StatusCodes.BAD_REQUEST)
            .json({message:'User is not logged in'});
        }

        const idempotencyKey = req.headers['x-idempotency-key'];
           console.log(idempotencyKey);
        if(!idempotencyKey){
            return res
                     .status(StatusCodes.BAD_REQUEST)
                     .json({message:'idempotency key missing'});
        }


        if(inMemDb[idempotencyKey]){
            return res
                     .status(StatusCodes.BAD_REQUEST)
                     .json({message:'Cannot retry on a successful payment'});
        }

        const response = await BookingService.makePayment({
            totalCost: object.totalCost,
            userId : object.userId,
            bookingId:object.bookingId,
            emailId:emailId
        })
        
        inMemDb[idempotencyKey] = idempotencyKey;
        SuccessResponse.data = response;

        return res.
                  status(StatusCodes.OK)
                  .json(SuccessResponse);
    } catch (error) {
        ErrorResponse.error = error;
        
        return res
        .status(StatusCodes.INTERNAL_SERVER_ERROR)
        .json(ErrorResponse);
    }
}

module.exports = {
    createBooking,
    makePayment
}





