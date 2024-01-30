import Response, { JsonFn, Res, StatusFn } from './Response';
import Route from './Route';
import { ExtendedRes, Req } from '../types/types';

class Api {
  private req: Req;

  private res: ExtendedRes;

  constructor(req: Req, res: Res) {
    const response = new Response(res);

    this.req = req;
    this.res = this.extendRes(res, response.json, response.status);
  }

  route(route: string) {
    return new Route(route, this.req, this.res);
  }

  private extendRes(res: Res, json: JsonFn, status: StatusFn) {
    return Object.defineProperties(res, {
      json: {
        value: json,
      },
      status: {
        value: status,
      },
    }) as ExtendedRes;
  }
}

export default Api;
