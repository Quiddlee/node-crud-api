import { IncomingMessage } from 'http';

import { JsonFn, Res, StatusFn } from '../utils/Response';

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
};

export type UserList = User[];

export type Req = IncomingMessage;

export type ExtendedRes = Res & {
  json: JsonFn;
  status: StatusFn;
};

export type ExtendedReq = Req & {
  route: { [key: string]: string };
};
