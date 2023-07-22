const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it, before } = require('mocha');
const knexConfig = require('../knexfile');
const knex = require('knex');
const server = require('../app');

chai.should();
chai.use(chaiHttp);

before(async () => {
  await knex(knexConfig[process.env.NODE_ENV])
    .migrate.latest()
    .then(function () {
      return knex(knexConfig[process.env.NODE_ENV]).seed.run();
    });
});

describe('GET /', () => {
  it('should return homepage with 200 status code', (done) => {
    chai
      .request(server)
      .get('/')
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

// describe('GET /health', () => {
//   it('should return 200', (done) => {
//     chai.request(server)
//       .get('/health')
//       .end((err, res) => {
//         res.should.have.status(200);
//         res.body.should.have.property('success').eql(true);
//         done();
//       });
//   });
// });
