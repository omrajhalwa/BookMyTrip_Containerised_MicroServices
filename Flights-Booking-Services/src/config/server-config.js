const dotenv = require("dotenv");

// give specific path of dotenv existing file......
dotenv.config({
    path:".env"
});

// console.log(process.env.PORT);
module.exports = {
    PORT:process.env.PORT,
    FLIGHT_SERVICE:process.env.FLIGHT_SERVICE
}