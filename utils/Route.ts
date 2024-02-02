import { HttpMethods } from '../types/enums';
import { Cb, ExtendedReq, ExtendedRes, Req, RequestBody } from '../types/types';

class Route {
  private readonly route: string;

  private readonly req: ExtendedReq;

  private readonly res: ExtendedRes;

  private readonly endpoint: string;

  private readonly baseUrl: string;

  private isPending: boolean = false;

  private middlewareQueue: Cb[] = [];

  constructor(route: string, req: Req, res: ExtendedRes) {
    this.route = route;
    this.req = <ExtendedReq>req;
    this.res = res;

    this.endpoint = req?.url ?? '';
    this.baseUrl = `http://${req.headers.host}/`;

    this.injectId();
  }

  get(cb: Cb) {
    if (this.req.method !== HttpMethods.GET) return this;

    if (this.isDynamyc()) {
      const routeWithoutId = this.excludeId(this.route);
      const endpointWithoutId = this.excludeId(this.endpoint);
      const { pathname } = new URL(endpointWithoutId, this.baseUrl);

      if (routeWithoutId === pathname) {
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

  post(cb: Cb) {
    if (this.req.method !== HttpMethods.POST) return this;

    const { pathname } = new URL(this.endpoint, this.baseUrl);

    if (this.route === pathname) {
      this.getBody().then((body) => {
        this.req.body = <RequestBody>body;
        cb(this.req, this.res);
        this.isPending = false;
        this.middlewareQueue.forEach((callback) =>
          callback(this.req, this.res),
        );
      });
    }

    return this;
  }

  put(cb: Cb) {
    if (this.req.method !== HttpMethods.PUT) return this;

    if (this.isDynamyc()) {
      const routeWithoutId = this.excludeId(this.route);
      const endpointWithoutId = this.excludeId(this.endpoint);
      const { pathname } = new URL(endpointWithoutId, this.baseUrl);

      if (routeWithoutId === pathname) {
        this.getBody()
          .then((body) => {
            this.req.body = <RequestBody>body;
            cb(this.req, this.res);
          })
          .finally(() => {
            this.isPending = false;
            this.middlewareQueue.forEach((callback) =>
              callback(this.req, this.res),
            );
          });
      }

      return this;
    }

    const { pathname } = new URL(this.endpoint, this.baseUrl);

    if (this.route === pathname) {
      this.getBody().then((body) => {
        this.req.body = <RequestBody>body;
        cb(this.req, this.res);
        this.isPending = false;
        this.middlewareQueue.forEach((callback) =>
          callback(this.req, this.res),
        );
      });
    }

    return this;
  }

  delete(cb: Cb) {
    if (this.req.method !== HttpMethods.DELETE) return this;

    if (this.isDynamyc()) {
      const routeWithoutId = this.excludeId(this.route);
      const endpointWithoutId = this.excludeId(this.endpoint);
      const { pathname } = new URL(endpointWithoutId, this.baseUrl);

      if (routeWithoutId === pathname) {
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

  use(cb: Cb) {
    if (!this.res.writableEnded && this.isPending) {
      this.middlewareQueue.push(cb);
      return this;
    }

    if (!this.res.writableEnded) cb(this.req, this.res);
    return this;
  }

  private getBody() {
    this.isPending = true;

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
    const routeWithoutId = this.excludeId(this.route);
    const endpointWithoutId = this.excludeId(this.endpoint);
    const { pathname } = new URL(endpointWithoutId, this.baseUrl);

    const isDynamic = routeWithoutId === pathname;

    this.req.route = {
      [this.getId(this.route)]: isDynamic
        ? this.getId(this.req?.url ?? '')
        : null,
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
}

export default Route;
