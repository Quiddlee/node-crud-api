import supertest from 'supertest';
import { describe, expect, it } from 'vitest';

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
const updatedUserData = {
  age: 12,
  username: 'updated name',
  hobbies: ['updated hobby 1', 'updated hobby 2', 'updated hobby 3'],
};
let uploadUserId = '';

describe('Test scenario 1', () => {
  it('GET api/users', async () => {
    const res = await server.get(Routes.USERS).expect(StatusCode.SUCCESS);
    expect(res.body).toMatchObject({
      status: 'success',
      data: {
        users: [],
      },
    });
  });

  it('POST api/users', async () => {
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

  it('GET api/users/{userId}', async () => {
    const res = await server
      .get(`${Routes.USERS}/${uploadUserId}`)
      .expect(StatusCode.SUCCESS);

    expect(res.body).toStrictEqual({
      status: 'success',
      data: {
        user: { ...uploadUserData, id: uploadUserId },
      },
    });
  });

  it('PUT api/users/{userId}', async () => {
    const res = await server
      .put(`${Routes.USERS}/${uploadUserId}`)
      .send(updatedUserData)
      .expect(StatusCode.SUCCESS);

    expect(res.body).toStrictEqual({
      status: 'success',
      data: {
        user: { ...updatedUserData, id: uploadUserId },
      },
    });
  });

  it('DELETE api/users/{userId}', async () => {
    const res = await server
      .delete(`${Routes.USERS}/${uploadUserId}`)
      .expect(StatusCode.NO_CONTENT);

    expect(res.body).toStrictEqual('');
  });

  it('GET api/users/{userId}', async () => {
    const res = await server
      .get(`${Routes.USERS}/${uploadUserId}`)
      .expect(StatusCode.NOT_FOUND);

    expect(res.body).toStrictEqual({
      status: 'fail',
      message: 'User not found',
    });
  });
});
