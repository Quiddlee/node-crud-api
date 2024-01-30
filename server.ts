import 'dotenv/config';
import http from 'http';

import * as uuid from 'uuid';

import { users } from './data/data';
import { StatusCode } from './types/enums';
import Api from './utils/Api';

// TODO: handle not found route

const server = http.createServer((request, response) => {
  const api = new Api(request, response);

  api.route('/api/users').get((_, res) => {
    res.status(StatusCode.SUCCESS).json(users);
  });

  api.route('/api/users/:id').get((req, res) => {
    const { id } = req.route;

    if (!uuid.validate(id)) {
      res.status(StatusCode.BAD_REQUEST).json({
        status: 'fail',
        message: 'The provided id is not valid uuid',
      });

      return;
    }

    const user = users.find((usr) => usr.id === id);

    if (!user) {
      res.status(StatusCode.NOT_FOUND).json({
        status: 'fail',
        message: 'User not found',
      });

      return;
    }

    res.status(StatusCode.SUCCESS).json(user);
  });
});

const port = Number(process.env.PORT);
const host = process.env.HOST;
server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});
