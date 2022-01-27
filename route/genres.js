const { Genre, validate } = require('../models/genre')
const express = require('express');
const router = express.Router()

router.get('/', async (req, res) => {
  const genres = await Genre.find()
  res.send(genres)
})

router.get('/:id', async (req, res) => {
  try {
      const genre = await Genre.findById(req.params.id)
      console.log(genre)
      res.send(genre)
  } catch (error) {
      res.status(404).send(error.message)
  }
})

router.post('/', async (req, res) => {
  // validate
  console.log(req.body)
  const result = validate(req.body)
  if (result.error) return res.status(400).send(result.error.details[0].message)
  // create
  const genre = new Genre({
      name: req.body.name,
  })
  // save
  try {
      const result2 = await genre.save()
      res.send(result2)        
  } catch (error) {
      console.log(1111)
      res.status(400).send(error.message)
  }
})


router.put('/:id', async (req, res) => {
  // get genre
  const  { error }  = validate(req.body)
  // console.log(error)
  if (error) return res.status(400).send(error.details[0].message)
  
  let genre = {}
  try {
      genre = await Genre.findById(req.params.id )
      console.log(genre)
  } catch (error) {
      res.status(404).send(error.message)
  }
  // validate
  // update
  genre.name = req.body.name
  const result = await genre.save()
  res.send(result)
})

router.delete('/:id', async (req, res) => {
  // get genre
  const result = await Genre.findOneAndDelete({_id: req.params.id})
  res.send(result)
})

module.exports = router