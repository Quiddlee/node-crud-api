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
} from '../types/types';

class Api {
  private readonly handlersTable: HandlersTable = {};

  private readonly middlewareQueue: MiddlewareQueue = [];

  listen(port: number, host: string, cb: () => void) {
    http
      .createServer((req: Req, res: Res) => {
        const requestHttpMethod = req.method as HttpMethods | undefined;
        const extendedReq = this.extendReq(req);
        const extendedRes = this.extendRes(res);
        const endpoint = extendedReq?.url ?? '';

        const { routeHandler, routeEndpoint } =
          this.getRouteHandlerAndRouteEndpoint(req);
        this.injectId(routeEndpoint, endpoint, extendedReq);

        this.getBody(extendedReq).then((body) => {
          extendedReq.body = <Record<string, string>>body;

          this.middlewareQueue.forEach((middleware) => {
            if (typeof middleware === 'function') {
              middleware(extendedReq, extendedRes);
            } else if (routeHandler && requestHttpMethod && routeHandler) {
              routeHandler(extendedReq, extendedRes);
            }
          });
        });
      })
      .listen(port, host, cb);
  }

  route(route: string) {
    return new Route(route, this.handlersTable, this.middlewareQueue);
  }

  use(cb: Cb) {
    this.middlewareQueue.push(cb);
    return this;
  }

  private getRouteHandlerAndRouteEndpoint(req: Req) {
    const method = req.method as HttpMethods | undefined;
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

  private getBody(req: ExtendedReq) {
    return new Promise((resolve, reject) => {
      const bodyChunks: Uint8Array[] = [];
      req
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
    return <ExtendedReq>Object.defineProperties(req, {
      route: {
        value: {},
      },
      body: {
        value: null,
      },
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

  private injectId(route: string, endpoint: string, req: ExtendedReq) {
    const isDynamic = route.includes(':');
    if (!isDynamic) return;

    req.route = {
      [this.getId(route)]: this.getId(endpoint),
    };
  }

  private getId(url: string) {
    return url.slice(url.lastIndexOf('/') + 1).replace(':', '');
  }
}

export default Api;
