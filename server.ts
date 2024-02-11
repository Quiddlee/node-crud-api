import 'dotenv/config';
import cluster from 'cluster';
import http from 'http';

import defineNextWorker from './utils/defineNextWorker';
import forwardRequest from './utils/forwardRequest';
import initApp from './utils/initApp';
import initWorkers from './utils/initWorkers';
import isMulti from './utils/isMulti';

const { isPrimary } = cluster;

const port = Number(process.env.PORT);
const host = process.env.HOST;
const isMultiMode = isMulti();
const isMasterProcess = isPrimary && isMultiMode;
let workerPorts: number[] = [];

if (isMasterProcess) {
  // Master process | load balancer code
  workerPorts = initWorkers();

  http
    .createServer((req, res) => {
      const workerCreds = defineNextWorker(workerPorts);
      forwardRequest(req, res, workerCreds);
    })
    .listen(port, host, () => {
      process.stdout.write(`The load balancer is running on port ${port}...\n`);
    });
} else {
  initApp();
}
