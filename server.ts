import 'dotenv/config';
import http from 'http';

import { users } from './data/data';
import { StatusCode } from './types/enums';

const server = http.createServer((req, res) => {
  const baseURL = `http://${req.headers.host}/`;
  const endpoint = req?.url ?? '/api';
  const { pathname } = new URL(endpoint, baseURL);

  if (pathname === '/api/users')
    res
      .writeHead(StatusCode.SUCCESS, { 'Content-type': 'application/json' })
      .end(JSON.stringify(users));

  if (pathname === '/api/users')
    res
      .writeHead(StatusCode.SUCCESS, { 'Content-type': 'application/json' })
      .end(JSON.stringify(users));
});

const port = Number(process.env.PORT);
const host = process.env.HOST;
server.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});
