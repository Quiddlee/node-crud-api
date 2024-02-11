import 'dotenv/config';
import cluster from 'cluster';
import http from 'http';

import {
  createUser,
  deleteUser,
  getUser,
  getUserList,
  notFound,
  updateUser,
} from './controllers/usersController';
import { Routes } from './types/enums';
import App from './utils/app';
import defineNextWorker from './utils/defineNextWorker';
import forwardRequest from './utils/forwardRequest';
import initWorkers from './utils/initWorkers';
import isMulti from './utils/isMulti';
import { validateId } from './utils/validateId';

const { isPrimary } = cluster;

const port = Number(process.env.PORT);
const host = process.env.HOST;
const isMultiMode = isMulti();
const isMasterProcess = isPrimary && isMultiMode;
let workerPorts: number[] = [];

if (isMasterProcess) {
  // Master process // load balancer code
  workerPorts = initWorkers();

  http
    .createServer((req, res) => {
      const workerCreds = defineNextWorker(workerPorts);
      forwardRequest(req, res, workerCreds);
    })
    .listen(port, host, () => {
      process.stdout.write(`The load balancer is running on port ${port}...\n`);
    });
} else if (isMultiMode) {
  // Worker's code
  const app = new App();
  const workerPort = Number(process.env.PORT);

  app.use(validateId);
  app.route(Routes.USERS).get(getUserList).post(createUser);
  app.route(Routes.USERS_ID).get(getUser).put(updateUser).delete(deleteUser);
  app.use(notFound);

  app.listen(workerPort, host, () => {
    process.stdout.write(`App running on port ${workerPort}...\n`);
  });
} else {
  // Base app
  const app = new App();

  app.use(validateId);
  app.route(Routes.USERS).get(getUserList).post(createUser);
  app.route(Routes.USERS_ID).get(getUser).put(updateUser).delete(deleteUser);
  app.use(notFound);

  app.listen(port, host, () => {
    process.stdout.write(`App running on port ${port}...`);
  });
}
