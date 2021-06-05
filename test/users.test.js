import { expect } from 'chai';
import { describe, it } from 'mocha';
import request from 'supertest';
import { app as Server } from '../server/app';
import User from '../server/models/user';

describe('User: SignIn Request', () => {
  let app;
  before(async () => {
    app = await request.agent(Server);
    await User.create({
      name: 'Test',
      lastName: 'Test',
      email: 'test@gmail.com',
      password: 'testPassword',
    });
  });

  after(async () => {
    await User.deleteMany({ email: 'test@gmail.com' });
  });

  it('should give back a success since correct credentials: POST', async () => {
    const response = await app
      .post('/api/signin')
      .send({ email: 'test@gmail.com', password: 'testPassword' });

    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys(
      'token',
      '_id',
      'name',
      'email',
      'role'
    );
    expect(response.body.token).to.be.a('string');
    expect(response.body._id).to.be.a('string');
    expect(response.body.name).to.be.a('string');
    expect(response.body.email).to.be.a('string');
    expect(response.body.role).to.be.a('number');
  });

  it('should give back a error since wrong email: POST', async () => {
    const response = await app
      .post('/api/signin')
      .send({ email: 'tes@gmail.com', password: 'testPassword' });

    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(400);
    expect(response.body).to.have.all.keys('error');
    expect(response.body.error).to.be.a('string');
  });

  it('should give back a error since wrong password', async () => {
    const response = await app
      .post('/api/signin')
      .send({ email: 'test@gmail.com', password: 'testpassword' });

    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(401);
    expect(response.body).to.have.all.keys('error');
    expect(response.body.error).to.be.a('string');
  });

  it('should give back a error since empty fields', async () => {
    const response = await app
      .post('/api/signin')
      .send({ email: '', password: '' });

    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(422);
    expect(response.body).to.have.all.keys('error');
    expect(response.body.error).to.be.a('string');
  });
});

describe('User: SignUp Request', () => {
  let app;
  before(async () => {
    app = await request.agent(Server);
  });

  after(async () => {
    await User.deleteMany({ email: 'test@gmail.com' });
  });

  it('should give back a success since correct details', async () => {
    const response = await app.post('/api/signup').send({
      name: 'Test',
      lastName: 'Test',
      email: 'test@gmail.com',
      password: 'testPassword',
    });

    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys('id', 'name', 'email');
    expect(response.body.id).to.be.a('string');
    expect(response.body.name).to.be.a('string');
    expect(response.body.email).to.be.a('string');
  });

  it('should give back a error since empty fields', async () => {
    const response = await app.post('/api/signup').send({
      name: '',
      lastName: '',
      email: '',
      password: '',
    });

    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(422);
    expect(response.body).to.have.all.keys('error');
    expect(response.body.error).to.be.a('string');
  });
});
