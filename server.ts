import 'dotenv/config';
import http from 'http';

import * as uuid from 'uuid';

import { users } from './data/data';
import { StatusCode } from './types/enums';
import ApiFeatures from './utils/ApiFeatures';

const server = http.createServer((req, res) => {
  const baseURL = `http://${req.headers.host}/`;
  const endpoint = req?.url ?? '/api';
  const { pathname } = new URL(endpoint, baseURL);

  const api = new ApiFeatures(req, res);

  api.route('/api/users').get((_, resp) => {
    resp.status(StatusCode.SUCCESS).json(users);
  });

  // Get all users
  // if (pathname === '/api/users')
  //   res
  //     .writeHead(StatusCode.SUCCESS, { 'Content-type': 'application/json' })
  //     .end(JSON.stringify(users));
  // // Get user by id
  // else
  if (
    pathname.slice(0, pathname.lastIndexOf('/')) === '/api/users' &&
    pathname.slice(pathname.lastIndexOf('/') + 1) !== 'users'
  ) {
    const id = pathname.slice(pathname.lastIndexOf('/') + 1);

    if (!uuid.validate(id)) {
      res
        .writeHead(StatusCode.BAD_REQUEST)
        .end('The provided id is not valid uuid');
      return;
    }

    const user = users.filter((usr) => usr.id === id);

    if (!user) {
      res.writeHead(StatusCode.NOT_FOUND).end('User not found!');
      return;
    }

    res
      .writeHead(StatusCode.SUCCESS, { 'Content-type': 'application/json' })
      .end(JSON.stringify(user));
  } else {
    res.writeHead(StatusCode.SUCCESS).end('The route does not exist!');
  }
});

const port = Number(process.env.PORT);
const host = process.env.HOST;
server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});
