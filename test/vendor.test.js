require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, after } = require('mocha');
const knexConfig = require('../knexfile');
const knex = require('knex');
const server = require('../app').default;
const { faker } = require('@faker-js/faker');

// before(async () => {
//   await knex(knexConfig[process.env.NODE_ENV])
//     .migrate.latest()
//     .then(function () {
//       return knex(knexConfig[process.env.NODE_ENV]).seed.run();
//     });
// });

after(async () => {
  await knex(knexConfig[process.env.NODE_ENV]).migrate.rollback([], true);
});

chai.should();
chai.use(chaiHttp);

const testVendor = {
  first_name: faker.person.firstName(),
  last_name: faker.person.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: 'vendor',
};

let token;
let id;

describe('POST api/vendor/register', () => {
  it('should create new vendor and return tokens with vendor details', (done) => {
    chai
      .request(server)
      .post('/api/vendor/register')
      .send(testVendor)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('token').a('string');
        res.body.should.have.property('refreshToken').a('string');
        res.body.should.have.property('id');
        res.body.should.have.property('first_name').eql(testVendor.first_name);
        res.body.should.have.property('last_name').eql(testVendor.last_name);
        res.body.should.have.property('email').eql(testVendor.email);
        res.body.should.have.property('created_at');
        id = res.body.id;
        done();
      });
  });
});

describe('GET /api/vendor/all', () => {
  it('should return all vendors with 200 status code', (done) => {
    chai
      .request(server)
      .get('/api/vendor/all')
      .end((err, res) => {
        if (err) {
          throw err;
        }
        res.should.have.status(200);
        done();
      });
  });
});

describe('GET /api/vendor/:id', () => {
  it('should return current added vendor with 200 status code', (done) => {
    chai
      .request(server)
      .get(`/api/vendor/${id}`)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        // Check response
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('id');
        res.body.should.have.property('first_name').eql(testVendor.first_name);
        res.body.should.have.property('last_name').eql(testVendor.last_name);
        res.body.should.have.property('email').eql(testVendor.email);
        res.body.should.have.property('created_at');
        done();
      });
  });
});
