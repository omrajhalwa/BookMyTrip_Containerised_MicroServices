
const airplane = require('../models/airplane');
const CrudRepository = require('./crud-repository');
const {City}=require('../models')
class CityRepository extends CrudRepository{
       constructor(){
          super(City);    
       }
}

module.exports = CityRepository;