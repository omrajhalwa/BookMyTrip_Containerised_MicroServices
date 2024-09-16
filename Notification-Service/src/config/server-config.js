const dotenv = require("dotenv");

// give specific path of dotenv existing file......
dotenv.config({
    path:".env"
});

// console.log(process.env.PORT);
module.exports = {
    PORT:process.env.PORT,
    GMAIL_PASS:process.env.GMAIL_PASS,
    GMAIL_EMAIL:process.env.GMAIL_EMAIL,
    RABBITMQ_CHANNEL:process.env.RABBITMQ_CHANNEL
}