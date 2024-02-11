import cluster from 'cluster';
import { availableParallelism } from 'node:os';

import db from '../../db/db';
import { WorkerMessage } from '../../types/types';

// TODO: Move port to constants
const NUM_CPUS = availableParallelism();
const port = Number(process.env.PORT);

/**
 * Initializes the cluster workers based on CPU cores with instance of the app on master PORT + n.
 * @returns {number[]} An array of the ports assigned to the workers.
 */
const initWorkers = () => {
  const workerPorts: number[] = [];

  for (let i = 1; i < NUM_CPUS; i += 1) {
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

  return workerPorts;
};

export default initWorkers;
