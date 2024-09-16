const { StatusCodes } = require('http-status-codes');
const { FlightRepository } = require('../repositories');
const AppError = require('../utils/errors/app-error');
const { Op } = require('sequelize');

const flightRepository = new FlightRepository();

async function createFlight(data) {
  try {
    const flight = await flightRepository.create(data);
    // console.log(airplane);
    return flight;
  } catch (error) {
    console.log(error);
    if (error.name == 'SequelizeValidationError') {
      let explanation = [];
      error.errors.forEach((err) => {
        explanation.push(err.message);
      })
      console.log(explanation);
      throw new AppError(explanation, StatusCodes.BAD_REQUEST);
    }

    throw new AppError('Cannot create a new Flight object', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}



async function getAllFlights(query) {
  let customFilter = {};
  // trips=MUM-DEL
  let sortFilter = [];
  const endingTripTime = " 23:59:00";
  if (query.trips) {
    [departureAirportId, arrivalAirportId] = query.trips.split("-");
    customFilter.departureAirportId = departureAirportId;
    customFilter.arrivalAirportId = arrivalAirportId;
  }
  // console.log(customFilter); 

  if (query.price) {
    [minPrice, maxPrice] = query.price.split("-");
    customFilter.price = {
      [Op.between]: [(minPrice == undefined) ? 0 : minPrice, (maxPrice == undefined) ? 20000 : maxPrice]
    }
  }

  if (query.travellers) {
    customFilter.totalSeats = {
      [Op.gte]: query.travellers
    }
  }
  console.log(query.tripDate)
  if (query.tripDate) {
    customFilter.departureTime = {
      [Op.between]: [query.tripDate, query.tripDate + endingTripTime]
    }
  }
 
  if(query.sort){
     const params = query.sort.split(',');
     const sortFilters = params.map((param) => param.split('_'));
     sortFilter = sortFilters;
  }


  try {

    const flights = await flightRepository.getAllFlights(customFilter , sortFilter);

    return flights;
  } catch (error) {
    //  console.log(error);
    throw new AppError('Cannot fetch data of all the flights', StatusCodes.INTERNAL_SERVER_ERROR);
  }
}

async function getFlight(id){
  try {
    console.log(id);
    const flight=await flightRepository.getFlight(id);
    return flight; 
} catch (error) {
  console.log(error);
    if(error.statusCode === StatusCodes.NOT_FOUND){
        throw new AppError('The flight you requested is not present', error.statusCode);
    }
    throw new AppError('Cannot fetch data of all the flight',StatusCodes.INTERNAL_SERVER_ERROR);
}
}


async function updateSeats(data) {
   try {
     const response = await flightRepository.updateRemainingSeats(data.flightId, data.seats , data.dec);
     return response;
   } catch (error) {
   // console.log(error);
    throw new AppError('Cannot update data of the flight',StatusCodes.INTERNAL_SERVER_ERROR);
   }
}

module.exports = {
  createFlight,
  getAllFlights,
  getFlight,
  updateSeats

}