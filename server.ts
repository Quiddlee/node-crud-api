import 'dotenv/config';
import http from 'http';

import { getUser, getUserList } from './controllers/usersController';
import Api from './utils/Api';

// TODO: handle not found route

const server = http.createServer((request, response) => {
  const api = new Api(request, response);

  api.route('/api/users').get(getUserList);
  api.route('/api/users/:id').get(getUser);
});

const port = Number(process.env.PORT);
const host = process.env.HOST;
server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  process.stdout.write(`App running on port ${port}...`);
});
