const express = require('express');

const {BookingController} = require('../../controllers/');

const router = express.Router();

/* /api/v1/bookings
*  req.body 
*  flightId : 1
*  noOfSeats: 5
*  userId : 007
*/
router.post('/',
               BookingController.createBooking
)

router.post('/payments',
    BookingController.makePayment
)

module.exports = router;