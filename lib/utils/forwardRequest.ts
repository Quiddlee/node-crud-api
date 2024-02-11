import http from 'http';

import { Res } from './response';
import { Req, WorkerRequestData } from '../../types/types';

/**
 * Forwards the request to the worker with the given data.
 * @param {Req} req - The incoming request object.
 * @param {Res} res - The outgoing response object.
 * @param {WorkerRequestData} workerData - The data of the worker to forward the request to.
 */
const forwardRequest = (req: Req, res: Res, workerData: WorkerRequestData) => {
  const options = {
    hostname: workerData.hostname,
    port: workerData.port,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };

  const proxy = http.request(options, (workerRes) => {
    res.writeHead(workerRes.statusCode as number, workerRes.headers);
    workerRes.pipe(res);
  });

  req.pipe(proxy);
};

export default forwardRequest;
