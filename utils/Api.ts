import Response, { Res } from './Response';
import Route from './Route';
import { ExtendedRes, Req } from '../types/types';

class Api {
  private readonly req: Req;

  private readonly res: ExtendedRes;

  constructor(req: Req, res: Res) {
    this.req = req;
    this.res = this.extendRes(res);
  }

  route(route: string) {
    return new Route(route, this.req, this.res);
  }

  use(cb: (req: Req, res: ExtendedRes) => void) {
    if (!this.res.writableEnded) cb(this.req, this.res);
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
