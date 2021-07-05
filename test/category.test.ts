import { expect } from 'chai';
import { describe, it } from 'mocha';
import request from 'supertest';
import { app as Server } from '../server/app';
import User from '../server/models/user';
import Category from '../server/models/category';

describe('Admin: Category Requests', () => {
  let app: request.SuperAgentTest;
  let token: string;
  let _id: string;
  let categoryId: string;
  before(async () => {
    app = await request.agent(Server);
    await User.create({
      name: 'Test',
      lastName: 'Test',
      email: 'test@gmail.com',
      password: 'testPassword',
      role: 1,
    });
    const response = await app
      .post('/api/signin')
      .send({ email: 'test@gmail.com', password: 'testPassword' });

    token = response.body.token;
    _id = response.body._id;
  });

  after(async () => {
    await User.deleteMany({ email: 'test@gmail.com' });
    await Category.deleteMany({ _id: categoryId });
  });

  it('should give back a success and create a new category: POST', async () => {
    const response = await app
      .post(`/api/category/create/${_id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ name: 'Test' });
    categoryId = response.body.category._id;
    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys('category');
    expect(response.body.category).to.have.all.keys('name', '_id', 'createdAt', 'updatedAt', '__v');
    expect(response.body.category.name).to.be.a('string');
    expect(response.body.category._id).to.be.a('string');
    expect(response.body.category.createdAt).to.be.a('string');
    expect(response.body.category.updatedAt).to.be.a('string');
    expect(response.body.category.__v).to.be.a('number');
  });

  it('should give back a success and return the particular category: GET', async () => {
    const response = await app.get(`/api/category/${categoryId}`);

    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys('name', '_id', 'createdAt', 'updatedAt', '__v');
    expect(response.body.name).to.be.a('string');
    expect(response.body._id).to.be.a('string');
    expect(response.body.createdAt).to.be.a('string');
    expect(response.body.updatedAt).to.be.a('string');
    expect(response.body.__v).to.be.a('number');
  });

  it('should give back a success and return all categories: GET', async () => {
    const response = await app.get(`/api/categories/all`);

    expect(response.body).to.be.an('Array');
    expect(response.status).to.equal(200);
    expect(response.body[0]).to.have.all.keys('name', '_id', 'createdAt', 'updatedAt', '__v');
    expect(response.body[0].name).to.be.a('string');
    expect(response.body[0]._id).to.be.a('string');
    expect(response.body[0].createdAt).to.be.a('string');
    expect(response.body[0].updatedAt).to.be.a('string');
    expect(response.body[0].__v).to.be.a('number');
  });

  it('should give back a success and update the particular category: PUT', async () => {
    const response = await app
      .put(`/api/category/${categoryId}/update/${_id}`)
      .set('Authorization', `bearer ${token}`)
      .send({ name: 'Test2' });

    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys('name', '_id', 'createdAt', 'updatedAt', '__v');
    expect(response.body.name).to.be.a('string');
    expect(response.body.name).to.be.equal('Test2');
    expect(response.body._id).to.be.a('string');
    expect(response.body.createdAt).to.be.a('string');
    expect(response.body.updatedAt).to.be.a('string');
    expect(response.body.__v).to.be.a('number');
  });

  it('should give back a success and update the particular category: DELETE', async () => {
    const response = await app
      .delete(`/api/category/${categoryId}/delete/${_id}`)
      .set('Authorization', `bearer ${token}`);

    expect(response.body).to.be.an('object');
    expect(response.status).to.equal(200);
    expect(response.body).to.have.all.keys('message');
    expect(response.body.message).to.be.a('string');
    expect(response.body.message).to.include('SUCCESSFULLY DELETED');
  });
});
