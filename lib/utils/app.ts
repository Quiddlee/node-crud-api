import http, { Server } from 'http';

import Response, { Res } from './response';
import Route from './route';
import { HttpMethods } from '../../types/enums';
import {
  Cb,
  ExtendedReq,
  ExtendedRes,
  HandlersTable,
  MiddlewareQueue,
  Req,
  RequestBody,
} from '../../types/types';

class App {
  private readonly handlersTable: HandlersTable = {};

  private readonly middlewareQueue: MiddlewareQueue = [];

  private req: ExtendedReq = <ExtendedReq>{};

  private res: ExtendedRes = <ExtendedRes>{};

  public server: Server = <Server>{};

  public createServer() {
    this.server = http.createServer(this.handleRequest);
    return this.server;
  }

  public listen(port: number, host: string, cb?: () => void) {
    this.server = http.createServer(this.handleRequest).listen(port, host, cb);
  }

  public route(route: string) {
    return new Route(route, this.handlersTable, this.middlewareQueue);
  }

  public use(cb: Cb) {
    this.middlewareQueue.push(cb);
    return this;
  }

  private handleRequest = (req: Req, res: Res) => {
    this.req = this.extendReq(req);
    this.res = this.extendRes(res);

    const requestEndpoint = req?.url ?? '';
    const { routeHandler, routeEndpoint } =
      this.getRouteHandlerAndRouteEndpoint();

    this.injectId(routeEndpoint, requestEndpoint);

    // Getting the body is async operation. So we want to get body first,
    // then call middlewares or route handlers
    this.getBody().then(async (body) => {
      this.injectBody(body);

      // using middlewareQueue with routeTable inside.
      // In order to make sure that if .use() method called BEFORE any route
      // e.g. ID validation, we want it to run right before route handler (get, post, put...)
      for await (const middleware of this.middlewareQueue) {
        if (typeof middleware === 'function') {
          middleware(this.req, this.res);
        } else if (routeHandler) {
          await routeHandler(this.req, this.res);
        }
      }
    });
  };

  private getRouteHandlerAndRouteEndpoint() {
    const method = <HttpMethods | undefined>this.req.method;
    const endpoint = this.req?.url ?? '';
    const baseUrl = `http://${this.req.headers.host}/`;
    const { pathname } = new URL(endpoint, baseUrl);
    let routeHandler = this.handlersTable[pathname];
    let routeEndpoint =
      Object.keys(this.handlersTable).find((key) => key === pathname) ?? '';

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
      routeEndpoint = matchedDynamicRoute ?? '';
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
    return <ExtendedReq>Object.defineProperties(req, {
      route: {
        value: {},
        configurable: true,
        writable: true,
      },
      body: {
        value: null,
        configurable: true,
        writable: true,
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

  private injectBody(body: RequestBody) {
    this.req.body = body;
  }

  private injectId(route: string, endpoint: string) {
    const isDynamicRoute = route.includes(':');
    if (!isDynamicRoute) return;

    this.req.route = {
      [this.getId(route)]: this.getId(endpoint),
    };
  }

  private getId(url: string) {
    return url.slice(url.lastIndexOf('/') + 1).replace(':', '');
  }
}

export default App;
