import 'dotenv/config';
import cluster from 'cluster';
import http from 'http';
import { availableParallelism } from 'node:os';

import {
  createUser,
  deleteUser,
  getUser,
  getUserList,
  notFound,
  updateUser,
} from './controllers/usersController';
import db from './db/db';
import { Routes } from './types/enums';
import { WorkerMessage } from './types/types';
import App from './utils/app';
import forwardRequest from './utils/forwardRequest';
import isMulti from './utils/isMulti';
import { validateId } from './utils/validateId';

const { isPrimary } = cluster;

const numCPUs = availableParallelism();
const port = Number(process.env.PORT);
const host = process.env.HOST;
const workerPorts: number[] = [];
const isMultiMode = isMulti();
const isMasterProcess = isPrimary && isMultiMode;
let currentWorkerNum = 0;

if (isMasterProcess) {
  // Master process // load balancer code
  http
    .createServer((req, res) => {
      const workerCreds = {
        hostname: host,
        port: workerPorts[currentWorkerNum],
      };

      forwardRequest(req, res, workerCreds);

      if (currentWorkerNum === workerPorts.length - 1) {
        currentWorkerNum = 0;
        return;
      }
      currentWorkerNum += 1;
    })
    .listen(port, host, () => {
      process.stdout.write(`The load balancer is running on port ${port}...\n`);
    });

  for (let i = 1; i < numCPUs; i += 1) {
    const workersPort = port + i;
    const worker = cluster.fork({ PORT: workersPort });
    workerPorts.push(workersPort);

    worker.on('message', (msg: WorkerMessage) => {
      if (!('command' in msg)) return;

      const workerArgs = msg.args;
      const dbAction = db[msg.command];
      dbAction(...workerArgs).then((data) => {
        worker.send({ res: data });
      });
    });
  }
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
