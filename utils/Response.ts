import { IncomingMessage, ServerResponse } from 'http';

import { StatusCode } from '../types/enums';

export type Res = ServerResponse & {
  req: IncomingMessage;
};

export type JsonFn = (body: unknown) => Response;

export type StatusFn = (status?: StatusCode) => Response;

class Response {
  private statusCode: StatusCode = StatusCode.SUCCESS;

  private res: Res;

  constructor(res: Res) {
    this.res = res;
  }

  json = (body: unknown) => {
    if (this.res.writableEnded) return this;

    let responseBody = body;

    if (typeof body !== 'string') {
      responseBody = JSON.stringify(body);
    }

    this.res
      .writeHead(this.statusCode, { 'Content-type': 'application/json' })
      .end(responseBody);

    return this;
  };

  status: StatusFn = (status?: StatusCode) => {
    if (status) this.statusCode = status;
    return this;
  };
}

export default Response;
