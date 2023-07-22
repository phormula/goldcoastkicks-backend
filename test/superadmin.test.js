require('dotenv').config();
const chai = require('chai');
const chaiHttp = require('chai-http');
const { describe, it } = require('mocha');
const server = require('../app');
const { faker } = require('@faker-js/faker');

// // before(async () => {
// //   await knex(knexConfig[process.env.NODE_ENV])
// //     .migrate.latest()
// //     .then(function () {
// //       return knex(knexConfig[process.env.NODE_ENV]).seed.run();
// //     });
// // });

// // after(async () => {
// //   await knex(knexConfig[process.env.NODE_ENV]).migrate.rollback([], true);
// // });

chai.should();
chai.use(chaiHttp);

const testUser = {
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: 'customer',
};
const testVendor = {
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: 'vendor',
};
const testAdmin = {
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: 'admin',
};
const testSuperAdmin = {
  first_name: faker.name.firstName(),
  last_name: faker.name.lastName(),
  email: faker.internet.email(),
  password: faker.internet.password(),
  role: 'super-admin',
};

let token;

describe('POST /api/auth/login', () => {
  it('should return tokens for super-admin with 200 status code', (done) => {
    const payload = { email: 'phormulabackup@gmail.com', password: 'password' };
    chai
      .request(server)
      .post('/api/auth/login')
      .send(payload)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        // Check response
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('token').a('string');
        res.body.should.have.property('refreshToken').a('string');
        res.body.should.have.property('id');
        res.body.should.have.property('first_name').eql('Evans');
        res.body.should.have.property('last_name').eql('Teiko');
        res.body.should.have.property('email').eql(payload.email);
        res.body.should.have.property('created_at');
        // Set token
        token = res.body.token;
        done();
      });
  });
});

describe('GET /api/mail-templates', () => {
  it('should return mail templates with 200 status code', (done) => {
    chai
      .request(server)
      .get('/api/mail-templates')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
  });
});

describe('POST /api/super-admin/register', () => {
  it('should create new user as customer and return tokens', (done) => {
    chai
      .request(server)
      .post('/api/super-admin/register')
      .set('Authorization', `Bearer ${token}`)
      .send(testUser)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        // Check response
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('token').a('string');
        res.body.should.have.property('refreshToken').a('string');
        res.body.should.have.property('id');
        res.body.should.have.property('first_name').eql(testUser.first_name);
        res.body.should.have.property('last_name').eql(testUser.last_name);
        res.body.should.have.property('email').eql(testUser.email);
        res.body.should.have.property('created_at');
        done();
      });
  });
});

describe('POST /api/super-admin/register', () => {
  it('should create new user as vendor and return tokens', (done) => {
    chai
      .request(server)
      .post('/api/super-admin/register')
      .set('Authorization', `Bearer ${token}`)
      .send(testVendor)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        // Check response
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('token').a('string');
        res.body.should.have.property('refreshToken').a('string');
        res.body.should.have.property('id');
        res.body.should.have.property('first_name').eql(testVendor.first_name);
        res.body.should.have.property('last_name').eql(testVendor.last_name);
        res.body.should.have.property('email').eql(testVendor.email);
        res.body.should.have.property('created_at');
        done();
      });
  });
});

describe('POST /api/super-admin/register', () => {
  it('should create new user as admin and return tokens', (done) => {
    chai
      .request(server)
      .post('/api/super-admin/register')
      .set('Authorization', `Bearer ${token}`)
      .send(testAdmin)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        // Check response
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('token').a('string');
        res.body.should.have.property('refreshToken').a('string');
        res.body.should.have.property('id');
        res.body.should.have.property('first_name').eql(testAdmin.first_name);
        res.body.should.have.property('last_name').eql(testAdmin.last_name);
        res.body.should.have.property('email').eql(testAdmin.email);
        res.body.should.have.property('created_at');
        done();
      });
  });
});

describe('POST /api/super-admin/register', () => {
  it('should create new user as super-admin and return tokens', (done) => {
    chai
      .request(server)
      .post('/api/super-admin/register')
      .set('Authorization', `Bearer ${token}`)
      .send(testSuperAdmin)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        // Check response
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('token').a('string');
        res.body.should.have.property('refreshToken').a('string');
        res.body.should.have.property('id');
        res.body.should.have.property('first_name').eql(testSuperAdmin.first_name);
        res.body.should.have.property('last_name').eql(testSuperAdmin.last_name);
        res.body.should.have.property('email').eql(testSuperAdmin.email);
        res.body.should.have.property('created_at');
        done();
      });
  });
});

describe('GET /api/auth/me', () => {
  it('should return current user with 200 status code', (done) => {
    chai
      .request(server)
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        // Check response
        res.should.have.status(200);
        res.body.should.be.a('object');
        // res.body.should.have.property('id');
        // res.body.should.have.property('firstName').eql(testUser.firstName);
        // res.body.should.have.property('lastName').eql(testUser.lastName);
        // res.body.should.have.property('email').eql(testUser.email);
        // res.body.should.have.property('createdAt');
        // res.body.should.have.property('updatedAt');
        done();
      });
  });
});

describe('PUT /api/auth/me', () => {
  it('should update authenticated user', (done) => {
    const payload = { first_name: 'New_First', last_name: 'New_Last' };
    chai
      .request(server)
      .put('/api/auth/me')
      .send(payload)
      .set('Authorization', `Bearer ${token}`)
      .end((err, res) => {
        if (err) {
          throw err;
        }
        // Check response
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('success').eql(true);
        done();
      });
  });
});

// // describe('DELETE /auth/me', () => {
// //   it('should delete authenticated user', (done) => {
// //     chai.request(server)
// //       .delete('/auth/me')
// //       .set('Authorization', `Bearer ${token}`)
// //       .end((err, res) => {
// //         if (err) {
// //           throw err;
// //         }
// //         // Check response
// //         res.should.have.status(204);
// //         done();
// //       });
// //   });
// // });
