const express = require('express');
const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort({ title: 1 })
  res.send(movies)
})

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);
  if (!movie) return res.status(404).send("Invalid movie.");
  res.send(movie)
})

router.post('/', [auth], async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genre.findById(req.body.genreId)
  if (!genre) return res.status(400).send("Invalid genre.")

  const movie = new Movie({
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name,
    }
  })

  await movie.save();
  res.send(movie)
})

router.put('/:id', [auth], async (req, res) => {
  const { error } = validate(req.body)
  if (error) return res.status(400).send(error.details[0].message)

  const genre = await Genre.findById(req.body.genreId)
  if (!genre) return res.status(400).send("Invalid genre")

  const movie = await Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
  }, { new: true });

  if (!movie) return res.status(404).send('The movie with given ID was not found');
  res.send(movie)
})

router.delete('/:id', [auth, admin], async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  if (!movie) return res.status(404).send("Invalid movie")
  movie.remove()
  res.send(movie)
})

module.exports = router