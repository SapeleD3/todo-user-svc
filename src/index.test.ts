import app from './app';
import mongoose from 'mongoose';
import request from 'supertest';

beforeAll((done) => {
  mongoose.connect(
    'mongodb://localhost:27017/payhippoJestDB',
    { useNewUrlParser: true, useUnifiedTopology: true },
    () => done()
  );
});

afterAll((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe('Register user to todo /users', () => {
  it('responds with json', function (done) {
    request(app)
      .post('/user/register')
      .send({ email: 'test@test.com', password: '123456' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });

  it('should ask for password field', function (done) {
    request(app)
      .post('/user/register')
      .send({ email: 'john' })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(422)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
});

let token: string;
describe('login user to todo /users', () => {
  it('respond with token', function (done) {
    //login the user
    request(app)
      .post('/user/login')
      .send({ email: 'test@test.com', password: '123456' })
      .set('Accept', 'application/json')
      .expect(200)
      .end(function (err, res) {
        token = res.body.data.token;
        if (err) return done(err);
        return done();
      });
  });
});

describe('get auth user data', () => {
  it('respond with user details', function (done) {
    request(app)
      .get('/user')
      .expect('Content-Type', /json/)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .end(function (err, res) {
        if (err) return done(err);
        return done();
      });
  });
});
