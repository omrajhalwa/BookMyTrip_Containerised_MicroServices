
const airplane = require('../models/airplane');
const CrudRepository = require('./crud-repository');
const { Flight } = require('../models')
const db = require('../models');
const { addRowLockOnFlights } = require('../repositories/queries')

class FlightRepository extends CrudRepository {
    constructor() {
        super(Flight);
    }

    async getAllFlights(filter, sort) {

        const response = await Flight.findAll({
            where: filter,
            order: sort,
            attributes: [
                'id', 'flightNumber', 'airplaneId', 'departureAirportId', 'arrivalAirportId',
                'arrivalTime', 'departureTime', 'price', 'boardingGate', 'totalSeats',
                'createdAt', 'updatedAt'
            ],
        });

        return response;
    }

    async getFlight(data) {
        const flight = await Flight.findOne({
            where: { id: data },
            attributes: [
                'id',
                'flightNumber',
                'airplaneId',
                'departureAirportId',
                'arrivalAirportId',
                'arrivalTime',
                'departureTime',
                'price',
                'boardingGate',
                'totalSeats',
                'createdAt',
                'updatedAt',
                // Make sure no extra spaces or empty attributes are here
            ]
        });

        return flight;
    }


    async updateRemainingSeats(flightId, seats, dec = true) {

        const transaction = await db.sequelize.transaction();

        try {

            // Row Lock
            await db.sequelize.query(addRowLockOnFlights(flightId))

            const flight = await Flight.findOne({
                where: { id: flightId },
                attributes: [
                    'id', 'flightNumber', 'airplaneId', 'departureAirportId',
                    'arrivalAirportId', 'arrivalTime', 'departureTime', 'price',
                    'boardingGate', 'totalSeats', 'createdAt', 'updatedAt',
                    // Make sure no extra spaces or empty attributes are here
                ]
            });



            if ((+dec)) {
                await flight.decrement('totalSeats', { by: seats },{transaction:transaction});

            } else {
                await flight.increment('totalSeats', { by: seats },{transaction:transaction});

            }
            await flight.save();
            
            await transaction.commit();
            return flight;

        } catch (error) {
            
            await transaction.rollback();
            throw error;

        }


    }
}

module.exports = FlightRepository;   