const { Customer, validate } = require('../models/customer')
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort({name: 1});
  res.send(customers)
})

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id)
  res.send(customer)
})

router.post("/", async (req, res) => {
  const checkInput = validate(req.body)
  if (!checkInput) return res.status(400).send(checkInput)

  let customer = new Customer({
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  })
  customer = await customer.save()
  res.send(customer)
})

router.put('/:id', async (req, res) => {
  const checkInput = validate(req.body)
  if (!checkInput) res.status(400).send(checkInput)

  const result = await Customer.findByIdAndUpdate(req.params.id, {
    isGold: req.body.isGold || false,
    name: req.body.name,
    phone: req.body.phone,
  }, {new: true})
  res.send(result)
})

router.delete('/:id', async (req, res) => {
  const result = await Customer.findByIdAndRemove(req.params.id, {
    isGold: req.body.isGold,
    name: req.body.name,
    phone: req.body.phone,
  }, {new: true})
  if (!result) return res.status(400).send(result.error.details[0].message)
  res.send(result)
})

module.exports = router