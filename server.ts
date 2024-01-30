import 'dotenv/config';
import http from 'http';

import {
  createUser,
  getUser,
  getUserList,
} from './controllers/usersController';
import Api from './utils/Api';

// TODO: handle not found route

const server = http.createServer((request, response) => {
  const api = new Api(request, response);

  api.route('/api/users').get(getUserList).post(createUser);
  api.route('/api/users/:id').get(getUser);
});

const port = Number(process.env.PORT);
const host = process.env.HOST;
server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});
