const host = process.env.HOST;
let currentWorkerNum = 0;

/**
 * Defines the next worker to forward the request to, based on the current worker number using Round-robin algorithm.
 * @param {number[]} workerPorts - An array of the all worker ports.
 * @returns {WorkerRequestData} - An object containing the hostname and port of the next worker.
 */
const defineNextWorker = (workerPorts: number[]) => {
  const isLastWorker = currentWorkerNum === workerPorts.length - 1;
  const currWorkerPort = workerPorts[currentWorkerNum];
  const workerCreds = {
    hostname: host,
    port: currWorkerPort,
  };

  if (isLastWorker) {
    currentWorkerNum = 0;
  } else {
    currentWorkerNum += 1;
  }

  return workerCreds;
};

export default defineNextWorker;
