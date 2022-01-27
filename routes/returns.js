const Joi = require('joi');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate')
const { Rental } = require('../models/rental');
const express = require('express');
const { Movie } = require('../models/movie');
const router = express.Router();

router.post('/', [auth, validate(validateReturn)], async (req, res) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);
  if (!rental) return res.status(404).send('no found for this customer/movie');
  // console.log(rental);
  if (rental.dateReturned) return res.status(400).send('rental already processed');
  
  rental.return();


  await rental.save();

  // const movie = await Movie.findById(req.body.movieId);
  // if (movie) {
  //   movie.numberInStock += 1;
  //   await movie.save();
  // }

  await Movie.updateOne({ _id: req.body.movieId }, { $inc: { numberInStock: 1 } });

  // console.log(rental);

  return res.status(200).send(rental);

})

function validateReturn(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required()
  }

  return Joi.validate(req, schema);
}

module.exports = router;

