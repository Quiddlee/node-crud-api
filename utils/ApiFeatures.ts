import { Req } from '../types/types';
// eslint-disable-next-line import/order
import Response, { JsonFn, Res, StatusFn } from './Response';

export type ExtendedRes = Res & {
  json: JsonFn;
  status: StatusFn;
};

class ApiFeatures {
  private req: Req;

  private res: ExtendedRes;

  private routeStr: string = '';

  constructor(req: Req, res: Res) {
    const response = new Response(res);

    this.req = req;
    this.res = this.extendRes(res, response.json, response.status);
  }

  route(route: string) {
    this.routeStr = route;
    return this;
  }

  get(cb: (req: Req, res: ExtendedRes) => void) {
    const baseURL = `http://${this.req.headers.host}/`;
    const endpoint = this.req?.url ?? '';

    const { pathname } = new URL(endpoint, baseURL);

    if (this.routeStr === pathname) {
      cb(this.req, this.res);
    }
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

export default ApiFeatures;
