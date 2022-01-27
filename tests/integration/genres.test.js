const mongoose = require('mongoose');
const request = require('supertest');
const { Genre } = require('../../models/genre');
const { User } = require('../../models/user');
let server;

describe('api/genres', () => {
  beforeEach(() => { server = require('../../index'); });
  afterEach(async () => {
    await server.close();
    await Genre.remove({});
  });
  describe('GET /', () => {
    it('should get all genres', async () => {
      await Genre.collection.insertMany([
        { name: "Genre1" },
        { name: "Genre2" },
      ])

      const res = await request(server).get('/api/genres')
      expect(res.status).toBe(200)
      expect(res.body.length).toBe(2)
      expect(res.body.some(g => g.name === 'Genre1')).toBeTruthy()
    })
  });

  describe('GET /:id', () => {
    it('should get genre with id', async () => {
      const genre = new Genre({ name: 'genre1' })
      await genre.save()

      const res = await request(server).get(`/api/genres/${genre._id}`)
      expect(res.status).toBe(200)
      expect(res.body).toHaveProperty('name', genre.name)
    })

    it('should return 404 if invalid id is passed ', async () => {
      const res = await request(server).get('/api/genres/1')

      expect(res.status).toBe(404);
    })

    it('should return 404 if ID was not found ', async () => {
      const id = mongoose.Types.ObjectId()

      const res = await request(server).get('/api/genres/' + id)

      expect(res.status).toBe(404);
    })
  });

  describe('POST /', () => {
    let name;
    let token;

    const exec = async () => {
      return await request(server)
        .post('/api/genres')
        .set('x-auth-token', token)
        .send({ name });
    }

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1'
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''
      const res = await exec();
      expect(res.status).toBe(401)
    });

    it('should return 400 if genre is less than 5 characters', async () => {
      name = '1234'

      const res = await exec();

      expect(res.status).toBe(400)
    });

    it('should return 400 if genre is more than 50 characters', async () => {

      name = new Array(52).join('a') // tạo dãy có 51 kí tự
      const res = await exec();

      expect(res.status).toBe(400)
    })

    it('should save the genre if it is valid', async () => {

      const res = await exec();

      const genre = await Genre.find({ name: 'genre1' })

      expect(genre).not.toBeNull();
      expect(genre[0]).toHaveProperty('_id')
    });

    it('should return the genre if it is valid', async () => {

      const res = await exec();

      expect(res.body).toHaveProperty('_id');
      expect(res.body).toHaveProperty('name', 'genre1')
    })
  });

  describe('PUT /:id', () => {
    let id = mongoose.Types.ObjectId().toHexString();
    let token = ''
    let name = 'genre1'

    const exec = async () => {
      return await request(server)
        .put('/api/genres/'+ id)
        .set('x-auth-token', token)
        .send({ name: name });

    }
    beforeEach(() => {
      token = new User().generateAuthToken();
      name = 'genre1';
    })

    it('should return 401 if client is not logged in', async () => {
      token = ''
      const res = await exec();

      expect(res.status).toBe(401)
    })

    it('should return 400 if characters is less than 5', async () => {
      name = '1234';
      const res = await exec();
      expect(res.status).toBe(400)
    })

    it('should return 400 if characters is more than 50', async () => {
      name = new Array(52).join('a');
      const res = await exec()

      expect(res.status).toBe(400)
    })

    it('should return 404 if id is not found', async () => {

      const res = await exec()
      expect(res.status).toBe(404)
    })

    it('should update genre if id is valid', async () => {
      const genre1 = await Genre.collection.insertOne({ name: 'genre1' })
      // console.log(genre1)
      name = 'new_genre'
      id = genre1.insertedId
      const res = await exec()

      expect(res.body._id).toEqual(String(genre1.insertedId));
      expect(res.body.name).toEqual(name);
    })

    it('should return new genre if id is valid', async () => {
      const genre1 = await Genre.collection.insertOne({ name: 'genre1' })
      name = 'new_genre';
      id = genre1.insertedId;
      const res = await exec();

      expect(res.body._id).toEqual(String(genre1.insertedId));
      expect(res.body).toHaveProperty('_id', String(genre1.insertedId));
    })
  })
});
