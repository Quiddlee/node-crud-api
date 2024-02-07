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
import { StatusCode } from '../types/enums';
import App from '../utils/app';
import { validateId } from '../utils/validateId';

const app = new App();

app.use(validateId);
app.route('/api/users').get(getUserList).post(createUser);
app.route('/api/users/:id').get(getUser).put(updateUser).delete(deleteUser);
app.use(notFound);

const server = supertest(app.createServer());
const uploadUserData = {
  age: 24,
  username: 'Wassup',
  hobbies: ['check', 'test', 'cool'],
};
let uploadUserId = '';

describe('Test scenario 1', () => {
  it('GET api/users', async () => {
    const res = await server.get('/api/users').expect(StatusCode.SUCCESS);
    expect(res.body).toMatchObject({
      status: 'success',
      data: [],
    });
  });

  it('POST api/users', async () => {
    const res = await server
      .post('/api/users')
      .send(uploadUserData)
      .expect(StatusCode.CREATED);

    expect(res.body).toStrictEqual({
      status: 'success',
      data: { ...uploadUserData, id: res.body.data.id },
    });

    uploadUserId = res.body.data.id;
  });

  it('GET api/users/{userId}', async () => {
    const res = await server
      .get(`/api/users/${uploadUserId}`)
      .expect(StatusCode.SUCCESS);

    expect(res.body).toStrictEqual({
      status: 'success',
      data: { ...uploadUserData, id: uploadUserId },
    });
  });
});
