import { IncomingMessage } from 'http';

export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
};

export type UserList = User[];

export type Req = IncomingMessage;
