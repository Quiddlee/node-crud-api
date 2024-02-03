import { HttpMethods } from '../types/enums';
import { Cb } from '../types/types';

class Route {
  private readonly route: string;

  private readonly routeTable:
    | Record<string, Partial<Record<HttpMethods, Cb>>>
    | Record<string, never> = {};

  constructor(
    route: string,
    routeTable: Record<string, Record<HttpMethods, Cb>> | Record<string, never>,
  ) {
    this.route = route;
    this.routeTable = routeTable;
  }

  get(cb: Cb) {
    this.routeTable[this.route] = {
      ...this.routeTable[this.route],
      [HttpMethods.GET]: cb,
    };
    return this;
  }

  post(cb: Cb) {
    this.routeTable[this.route] = {
      ...this.routeTable[this.route],
      [HttpMethods.POST]: cb,
    };
    return this;
  }

  put(cb: Cb) {
    this.routeTable[this.route] = {
      ...this.routeTable[this.route],
      [HttpMethods.PUT]: cb,
    };
    return this;
  }

  delete(cb: Cb) {
    this.routeTable[this.route] = {
      ...this.routeTable[this.route],
      [HttpMethods.DELETE]: cb,
    };
    return this;
  }
}

export default Route;
