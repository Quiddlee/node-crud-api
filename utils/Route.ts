import { ExtendedReq, ExtendedRes, Req } from '../types/types';

class Route {
  private readonly route: string;

  private readonly req: ExtendedReq;

  private readonly res: ExtendedRes;

  private readonly endpoint: string;

  private readonly baseUrl: string;

  constructor(route: string, req: Req, res: ExtendedRes) {
    this.route = route;
    this.req = this.extendReq(req);
    this.res = res;

    this.endpoint = req?.url ?? '';
    this.baseUrl = `http://${req.headers.host}/`;
  }

  get(cb: (req: ExtendedReq, res: ExtendedRes) => void) {
    if (this.isDynamyc()) {
      const routeWithoutId = this.excludeId(this.route);
      const endpointWithoutId = this.excludeId(this.endpoint);
      const { pathname } = new URL(endpointWithoutId, this.baseUrl);

      if (routeWithoutId === pathname) {
        this.injectId();
        cb(this.req, this.res);
      }

      return;
    }

    const { pathname } = new URL(this.endpoint, this.baseUrl);

    if (this.route === pathname) {
      cb(this.req, this.res);
    }
  }

  private injectId() {
    this.req.route = {
      [this.getId(this.route)]: this.getId(this.endpoint),
    };
  }

  private getId(url: string) {
    return url.slice(url.lastIndexOf('/') + 1).replace(':', '');
  }

  private excludeId(url: string) {
    return url.slice(0, url.lastIndexOf('/'));
  }

  private isDynamyc() {
    return this.route.slice(this.route.lastIndexOf('/') + 1).startsWith(':');
  }

  private extendReq(req: Req) {
    return <ExtendedReq>{
      ...req,
      route: {},
    };
  }
}

export default Route;
