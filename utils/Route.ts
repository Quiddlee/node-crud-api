/* eslint-disable */
import { Req } from '../types/types';
import { ExtendedRes } from './Api';

class Route {
  private route: string;

  private req: Req;

  private res: ExtendedRes;

  constructor(route: string, req: Req, res: ExtendedRes) {
    this.route = route;
    this.req = req;
    this.res = res;
  }

  get(cb: (req: Req, res: ExtendedRes) => void) {
    const baseURL = `http://${this.req.headers.host}/`;
    const endpoint = this.req?.url ?? '';

    const { pathname } = new URL(endpoint, baseURL);

    if (this.route === pathname) {
      cb(this.req, this.res);
    }
  }
}

export default Route;
