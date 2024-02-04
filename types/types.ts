import { IncomingMessage } from 'http';

import { HttpMethods } from './enums.js';
import { JsonFn, Res, StatusFn } from '../utils/response.js';

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
};

export type UserList = User[];

export type Req = IncomingMessage;

export type RequestBody = Record<string, string> | null;

export type ExtendedRes = Res & {
  json: JsonFn;
  status: StatusFn;
};

export type ExtendedReq = Req & {
  route: { [key: string]: string | null };
  body: RequestBody;
};

export type Cb = (req: ExtendedReq, res: ExtendedRes) => void;

export type RouteTable = Record<string, Record<HttpMethods, Cb>>;

export type MiddlewareQueue = (Cb | RouteTable)[];

export type HandlersTable =
  | Record<string, Record<HttpMethods, Cb>>
  | Record<string, never>;
