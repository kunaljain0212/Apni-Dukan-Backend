import { expect } from 'chai';
import { describe, it } from 'mocha';
import request from 'supertest';
import { app as Server } from '../server/app';
import User from '../server/models/user';

describe('User SignIn Request', () => {
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

  it('should give back a success', async () => {
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
});
