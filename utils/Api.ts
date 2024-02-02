import Response, { Res } from './Response';
import Route from './Route';
import { Cb, ExtendedReq, ExtendedRes, Req } from '../types/types';

class Api {
  private readonly req: ExtendedReq;

  private readonly res: ExtendedRes;

  constructor(req: Req, res: Res) {
    this.req = req as ExtendedReq;
    this.res = this.extendRes(res);

    this.extendReq('route', {});
    this.extendReq('body', null);
  }

  route(route: string) {
    return new Route(route, this.req, this.res);
  }

  use(cb: Cb) {
    if (!this.res.writableEnded) {
      cb(this.req, this.res);
    }
    return this;
  }

  private extendReq(field: string, value: unknown) {
    return <ExtendedReq>Object.defineProperty(this.req, field, {
      value,
      writable: true,
      configurable: true,
    });
  }

  private extendRes(res: Res) {
    const response = new Response(res);
    return <ExtendedRes>Object.defineProperties(res, {
      json: {
        value: response.json,
      },
      status: {
        value: response.status,
      },
    });
  }
}

export default Api;
