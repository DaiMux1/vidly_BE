const mongoose = require('mongoose');
const moment = require('moment');
const { Rental } = require('../../models/rental');
const request = require('supertest');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movie');


describe('/api/returns', () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  const exec = () => {
    return request(server)
      .post('/api/returns')
      .set('x-auth-token', token)
      .send({ customerId, movieId });
  }

  beforeEach(async () => {
    server = require('../../index');
    customerId = mongoose.Types.ObjectId();
    movieId = mongoose.Types.ObjectId();
    token = new User().generateAuthToken();

    rental = new Rental({
      customer: {
        _id: customerId,
        name: '12345',
        phone: '12345'
      },
      movie: {
        _id: movieId,
        title: '12345',
        dailyRentalRate: 2
      }
    });

    await rental.save()
  })

  afterEach(async () => {
    await server.close();
    await Rental.remove({})
  })

  it('should 401 if token is not provided', async () => {
    token = '';

    const res = await exec();

    expect(res.status).toBe(401)
  })

  it('should 400 if customerId is not provided', async () => {

    customerId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  })

  it('should 400 if movieId is not provided', async () => {
    movieId = '';

    const res = await exec();

    expect(res.status).toBe(400);
  })

  it('should 404 if no rental found for this customer/movie', async () => {
    customerId = mongoose.Types.ObjectId();

    const res = await exec();

    expect(res.status).toBe(404);
  })

  it('should 400 if rental already processed', async () => {
    rental.dateReturned = Date.now();
    await rental.save();
    // console.log(result);

    const res = await exec();

    expect(res.status).toBe(400);
  })

  it('should 200 if valid request', async () => {

    const res = await exec();

    expect(res.status).toBe(200);
  });

  it('should set the return date if valid', async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = Date.now() - rentalInDb.dateReturned
    // console.log(diff)

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('dateReturned');
    expect(diff).toBeLessThan(10 * 1000);
  })

  it('should calculate the rental if valid', async () => {
    rental.dateOut = moment().add(-7, 'days').toDate();
    await rental.save();

    const res = await exec();
    // console.log(res.body);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('rentalFee');
    expect(res.body.rentalFee).toBe(14);
  })

  it('should increase the movie stock if valid', async () => {
    const movie = new Movie({
      _id: movieId,
      title: '12345',
      genre: {name: '12345'},
      numberInStock: 5,
      dailyRentalRate: 2,
    })

    await movie.save();

    const res = await exec();

    let newStockMovie = await Movie.findById(movieId)

    await Movie.remove({})

    expect(newStockMovie.numberInStock).toBe(6);
  })

  it('should return the rental if input is valid',async () => {
    const res = await exec();

    console.log(typeof rental._id);

    const rentalInDb = await Rental.findById(rental._id);

    // expect(res.body).toMatchObject(rentalInDb);
    // expect(res.body).toHaveProperty('dateOut');
    // expect(res.body).toHaveProperty('dateReturned');
    // expect(res.body).toHaveProperty('rentalFee');

    expect(Object.keys(res.body)).toEqual(expect.arrayContaining(['dateOut', 'dateReturned', 'rentalFee']))

  })

  
});
