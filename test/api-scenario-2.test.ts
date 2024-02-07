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
import { Routes, StatusCode } from '../types/enums';
import App from '../utils/app';
import clearData from '../utils/clearData';
import { validateId } from '../utils/validateId';

const app = new App();

app.use(validateId);
app.route(Routes.USERS).get(getUserList).post(createUser);
app.route(Routes.USERS_ID).get(getUser).put(updateUser).delete(deleteUser);
app.use(notFound);

const server = supertest(app.createServer());
const updatedUserData = {
  age: 12,
  username: 'updated name',
  hobbies: ['updated hobby 1', 'updated hobby 2', 'updated hobby 3'],
};
const uploadUserId = '';

describe('Test scenario 2', () => {
  afterAll(clearData);

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

  it('GET api/users/{userId} should return user not found', async () => {
    const res = await server
      .get(`${Routes.USERS}/${uploadUserId}`)
      .expect(StatusCode.NOT_FOUND);

    expect(res.body).toStrictEqual({
      status: 'fail',
      message: 'User not found',
    });
  });

  it('PUT api/users/{userId} should return user not found', async () => {
    const res = await server
      .put(`${Routes.USERS}/${uploadUserId}`)
      .send(updatedUserData)
      .expect(StatusCode.NOT_FOUND);

    expect(res.body).toStrictEqual({
      status: 'fail',
      message: 'User not found',
    });
  });

  it('DELETE api/users/{userId} should return user not found', async () => {
    const res = await server
      .delete(`${Routes.USERS}/${uploadUserId}`)
      .expect(StatusCode.NOT_FOUND);

    expect(res.body).toStrictEqual({
      status: 'fail',
      message: 'User not found',
    });
  });
});
