import { IncomingMessage } from 'http';

import { DBCommands, HttpMethods } from './enums';
import { RequestUser } from '../models/user/usersModel';
import { JsonFn, Res, StatusFn } from '../utils/response';

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

export type WorkerArgs = [RequestUser & string, RequestUser];

export type WorkerMessage = {
  command: DBCommands;
  args: WorkerArgs;
};

export type WorkerRequestData = { hostname: string; port: number };
