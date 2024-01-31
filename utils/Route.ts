import { HttpMethods } from '../types/enums';
import { ExtendedReq, ExtendedRes, Req } from '../types/types';

type Cb = (req: ExtendedReq, res: ExtendedRes) => void;

class Route {
  private readonly route: string;

  private readonly req: ExtendedReq;

  private readonly res: ExtendedRes;

  private readonly endpoint: string;

  private readonly baseUrl: string;

  constructor(route: string, req: Req, res: ExtendedRes) {
    this.route = route;
    this.req = <ExtendedReq>req;
    this.res = res;

    this.endpoint = req?.url ?? '';
    this.baseUrl = `http://${req.headers.host}/`;

    this.extendReq('route', {});
  }

  get(cb: Cb) {
    if (this.req.method !== HttpMethods.GET) return this;

    if (this.isDynamyc()) {
      const routeWithoutId = this.excludeId(this.route);
      const endpointWithoutId = this.excludeId(this.endpoint);
      const { pathname } = new URL(endpointWithoutId, this.baseUrl);

      if (routeWithoutId === pathname) {
        this.injectId();
        cb(this.req, this.res);
      }

      return this;
    }

    const { pathname } = new URL(this.endpoint, this.baseUrl);

    if (this.route === pathname) {
      cb(this.req, this.res);
    }

    return this;
  }

  async post(cb: Cb) {
    if (this.req.method !== HttpMethods.POST) return this;

    const { pathname } = new URL(this.endpoint, this.baseUrl);

    if (this.route === pathname) {
      const body = await this.getBody();
      this.extendReq('body', body);
      cb(this.req, this.res);
    }

    return this;
  }

  async put(cb: Cb) {
    if (this.req.method !== HttpMethods.PUT) return this;

    if (this.isDynamyc()) {
      const routeWithoutId = this.excludeId(this.route);
      const endpointWithoutId = this.excludeId(this.endpoint);
      const { pathname } = new URL(endpointWithoutId, this.baseUrl);

      if (routeWithoutId === pathname) {
        this.injectId();
        const body = await this.getBody();
        this.extendReq('body', body);
        cb(this.req, this.res);
      }

      return this;
    }

    const { pathname } = new URL(this.endpoint, this.baseUrl);

    if (this.route === pathname) {
      const body = await this.getBody();
      this.extendReq('body', body);
      cb(this.req, this.res);
    }

    return this;
  }

  private getBody() {
    return new Promise((resolve, reject) => {
      const bodyChunks: Uint8Array[] = [];

      this.req
        .on('data', (chunk) => {
          bodyChunks.push(chunk);
        })
        .on('error', (e) => {
          reject(e);
        })
        .on('end', () => {
          const body = Buffer.concat(bodyChunks).toString();

          if (body) {
            const parsed = JSON.parse(body);
            delete parsed?.id;
            resolve(parsed);
          } else {
            resolve(null);
          }
        })
        .on('error', (e) => {
          reject(e);
        });
    });
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

  private extendReq(field: string, value: unknown) {
    return <ExtendedReq>Object.defineProperty(this.req, field, {
      value,
      writable: true,
      configurable: true,
    });
  }
}

export default Route;
