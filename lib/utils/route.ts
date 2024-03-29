import { HttpMethods } from '../../types/enums';
import {
  Cb,
  HandlersTable,
  MiddlewareQueue,
  RouteTable,
} from '../../types/types';

class Route {
  private readonly route: string;

  private readonly routeTable: RouteTable;

  private readonly middlewareQueue: MiddlewareQueue;

  public constructor(
    route: string,
    routeTable: HandlersTable,
    middlewareQueue: MiddlewareQueue,
  ) {
    this.route = route;
    this.routeTable = routeTable;
    this.middlewareQueue = middlewareQueue;
  }

  public get(cb: Cb) {
    this.routeTable[this.route] = {
      ...this.routeTable[this.route],
      [HttpMethods.GET]: cb,
    };

    const isRouteTableAlreadyInMiddleware = this.middlewareQueue.some((m) =>
      Object.is(this.routeTable, m),
    );

    if (isRouteTableAlreadyInMiddleware) return this;
    this.middlewareQueue.push(this.routeTable);
    return this;
  }

  public post(cb: Cb) {
    this.routeTable[this.route] = {
      ...this.routeTable[this.route],
      [HttpMethods.POST]: cb,
    };

    const isRouteTableAlreadyInMiddleware = this.middlewareQueue.some((m) =>
      Object.is(this.routeTable, m),
    );

    if (isRouteTableAlreadyInMiddleware) return this;
    this.middlewareQueue.push(this.routeTable);
    return this;
  }

  public put(cb: Cb) {
    this.routeTable[this.route] = {
      ...this.routeTable[this.route],
      [HttpMethods.PUT]: cb,
    };

    const isRouteTableAlreadyInMiddleware = this.middlewareQueue.some((m) =>
      Object.is(this.routeTable, m),
    );

    if (isRouteTableAlreadyInMiddleware) return this;
    this.middlewareQueue.push(this.routeTable);
    return this;
  }

  public delete(cb: Cb) {
    this.routeTable[this.route] = {
      ...this.routeTable[this.route],
      [HttpMethods.DELETE]: cb,
    };

    const isRouteTableAlreadyInMiddleware = this.middlewareQueue.some((m) =>
      Object.is(this.routeTable, m),
    );

    if (isRouteTableAlreadyInMiddleware) return this;
    this.middlewareQueue.push(this.routeTable);
    return this;
  }
}

export default Route;
