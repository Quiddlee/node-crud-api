import supertest from 'supertest';
import { afterAll, describe, expect, it } from 'vitest';

import {
  createUser,
  deleteUser,
  getUser,
  getUserList,
  notFound,
  updateUser,
} from '../controllers/usersController';
import db from '../db/db';
import { Routes, StatusCode } from '../types/enums';
import App from '../utils/app';
import { validateId } from '../utils/validateId';

const app = new App();

app.use(validateId);
app.route(Routes.USERS).get(getUserList).post(createUser);
app.route(Routes.USERS_ID).get(getUser).put(updateUser).delete(deleteUser);
app.use(notFound);

const server = supertest(app.createServer());
const uploadUserData = {
  age: 24,
  username: 'Wassup',
  hobbies: ['check', 'test', 'cool'],
};
let uploadUserId = '';

describe('Test scenario 2', () => {
  afterAll(db.clearData);

  it('GET api/users should return empty array of users', async () => {
    const res = await server.get(Routes.USERS).expect(StatusCode.SUCCESS);
    expect(res.body).toMatchObject({
      status: 'success',
      results: 0,
      data: {
        users: [],
      },
    });
  });

  it('POST api/users should create user', async () => {
    const res = await server
      .post(Routes.USERS)
      .send(uploadUserData)
      .expect(StatusCode.CREATED);
    const { id } = res.body.data.user;

    expect(res.body).toStrictEqual({
      status: 'success',
      data: {
        user: { ...uploadUserData, id },
      },
    });
    uploadUserId = id;
  });

  it('PUT api/users/{userId} should return invalid user data with missing name', async () => {
    const res = await server
      .put(`${Routes.USERS}/${uploadUserId}`)
      .send({
        age: 1,
        hobbies: [],
      })
      .expect(StatusCode.BAD_REQUEST);

    expect(res.body).toStrictEqual({
      status: 'fail',
      message: `The provided data is missing required fields (username)`,
    });
  });

  it('PUT api/users/{userId} should return invalid user data with missing name and age', async () => {
    const res = await server
      .put(`${Routes.USERS}/${uploadUserId}`)
      .send({
        hobbies: [],
      })
      .expect(StatusCode.BAD_REQUEST);

    expect(res.body).toStrictEqual({
      status: 'fail',
      message: `The provided data is missing required fields (username, age)`,
    });
  });

  it('PUT api/users/{userId} should return invalid user data with missing name, age and hobbies', async () => {
    const res = await server
      .put(`${Routes.USERS}/${uploadUserId}`)
      .send({})
      .expect(StatusCode.BAD_REQUEST);

    expect(res.body).toStrictEqual({
      status: 'fail',
      message: `The provided data is missing required fields (username, age, hobbies)`,
    });
  });
});
