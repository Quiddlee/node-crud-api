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
import { HOST, PORT } from './lib/const';
import App from './lib/utils/app';
import defineNextWorker from './lib/utils/defineNextWorker';
import forwardRequest from './lib/utils/forwardRequest';
import initWorkers from './lib/utils/initWorkers';
import isMulti from './lib/utils/isMulti';
import { validateId } from './lib/utils/validateId';
import { Routes } from './types/enums';

const { isPrimary } = cluster;
const isMultiMode = isMulti();
const isMasterProcess = isPrimary && isMultiMode;
let workerPorts: number[] = [];

if (isMasterProcess) {
  workerPorts = initWorkers();

  http
    .createServer((req, res) => {
      const workerCreds = defineNextWorker(workerPorts);
      forwardRequest(req, res, workerCreds);
    })
    .listen(PORT, HOST, () => {
      process.stdout.write(`The load balancer is running on port ${PORT}...\n`);
    });
} else {
  const app = new App();

  app.use(validateId);
  app.route(Routes.USERS).get(getUserList).post(createUser);
  app.route(Routes.USERS_ID).get(getUser).put(updateUser).delete(deleteUser);
  app.use(notFound);

  app.listen(PORT, HOST, () => {
    process.stdout.write(`App running on port ${PORT}...\n`);
  });
}
