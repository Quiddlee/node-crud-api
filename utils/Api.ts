import http from 'http';

import Response, { Res } from './Response';
import Route from './Route';
import { HttpMethods } from '../types/enums';
import {
  Cb,
  ExtendedReq,
  ExtendedRes,
  HandlersTable,
  MiddlewareQueue,
  Req,
  RequestBody,
} from '../types/types';

class Api {
  private readonly handlersTable: HandlersTable = {};

  private readonly middlewareQueue: MiddlewareQueue = [];

  private req: ExtendedReq = <ExtendedReq>{};

  private res: ExtendedRes = <ExtendedRes>{};

  public listen(port: number, host: string, cb: () => void) {
    http
      .createServer((req, res) => {
        const requestEndpoint = req?.url ?? '';
        const { routeHandler, routeEndpoint } =
          this.getRouteHandlerAndRouteEndpoint(req);

        this.extendReq(req);
        this.extendRes(res);
        this.injectId(routeEndpoint, requestEndpoint);

        // Getting the body is async operation. So we want to get body first,
        // then call middlewares or route handlers
        this.getBody().then((body) => {
          this.injectBody(body);
          console.log(this.req.body, this.req.route);

          // using middlewareQueue with routeTable inside.
          // In order to make sure that if .use() method called BEFORE any route
          // e.g. ID validation, we want it to run right before route handler (get, post, put...)
          this.middlewareQueue.forEach((middleware) => {
            if (typeof middleware === 'function') {
              middleware(this.req, this.res);
            } else if (routeHandler) {
              routeHandler(this.req, this.res);
            }
          });
        });
      })
      .listen(port, host, cb);
  }

  public route(route: string) {
    return new Route(route, this.handlersTable, this.middlewareQueue);
  }

  public use(cb: Cb) {
    this.middlewareQueue.push(cb);
    return this;
  }

  private getRouteHandlerAndRouteEndpoint(req: Req) {
    const method = <HttpMethods | undefined>req.method;
    const endpoint = req?.url ?? '';
    const baseUrl = `http://${req.headers.host}/`;
    const { pathname } = new URL(endpoint, baseUrl);
    let routeHandler = this.handlersTable[pathname];
    let routeEndpoint = <string>(
      Object.keys(this.handlersTable).find((key) => key === pathname)
    );

    if (!routeHandler) {
      const matchedDynamicRoute = <string>Object.keys(this.handlersTable).find(
        (key) => {
          return (
            pathname.slice(0, pathname.lastIndexOf('/')) ===
            key.slice(0, key.lastIndexOf('/'))
          );
        },
      );

      routeHandler = this.handlersTable[matchedDynamicRoute];
      routeEndpoint = matchedDynamicRoute;
    }

    return {
      routeEndpoint,
      routeHandler: routeHandler?.[method as HttpMethods],
    };
  }

  private getBody(): Promise<RequestBody> {
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

  private extendReq(req: Req) {
    this.req = <ExtendedReq>{
      ...req,
      route: {},
      body: null,
    };
  }

  private extendRes(res: Res) {
    const response = new Response(res);
    this.res = <ExtendedRes>{
      ...this.res,
      json: response.json,
      status: response.status,
    };
  }

  private injectBody(body: RequestBody) {
    this.req = <ExtendedReq>{ ...this.req, body };
  }

  private injectId(route: string, endpoint: string) {
    const isDynamicRoute = route.includes(':');
    if (!isDynamicRoute) return;

    this.req = <ExtendedReq>{
      ...this.req,
      route: {
        [this.getId(route)]: this.getId(endpoint),
      },
    };
  }

  private getId(url: string) {
    return url.slice(url.lastIndexOf('/') + 1).replace(':', '');
  }
}

export default Api;
