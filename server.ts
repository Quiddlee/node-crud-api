import 'dotenv/config';

import http from 'http';
import { URL } from 'url';

import { users } from './data/data';

const server = http.createServer((req, res) => {
  const baseURL = `http://${req.headers.host}/`;
  const endpoint = req?.url ?? '/api';
  const { pathname } = new URL(endpoint, baseURL);

  if (pathname === '/api/users')
    res
      .writeHead(200, { 'Content-type': 'application/json' })
      .end(JSON.stringify(users));
});

const port = Number(process.env.PORT);
server.listen(port, '127.0.0.1', () => {
  console.log(`App running on port ${port}...`);
});
