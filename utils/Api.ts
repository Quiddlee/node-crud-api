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

  private extendRes(res: Res) {
    const response = new Response(res);
    return <ExtendedRes>{
      ...res,
      json: response.json,
      status: response.status,
    };
  }
}

export default Api;
