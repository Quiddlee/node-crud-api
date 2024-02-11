import cluster from 'cluster';

import * as uuid from 'uuid';

import { RequestUser, UserId, UserList } from '../models/user/usersModel';
import { DBCommands } from '../types/enums';
import connectDB from '../utils/connectDB';
import isMulti from '../utils/isMulti';

const isWorkerThread = isMulti() && !cluster.isPrimary;

class DB {
  private readonly users: UserList = [];

  public getUserList = async () => {
    if (isWorkerThread) {
      return connectDB<UserList>(DBCommands.GET_USER_LIST);
    }

    return this.users;
  };

  public getUser = async (id: UserId | null) => {
    if (isWorkerThread) {
      return connectDB<UserList>(DBCommands.GET_USER, id);
    }

    const user = this.users.find((usr) => usr.id === id) ?? null;
    return user;
  };

  public createUser = async (userData: RequestUser) => {
    if (isWorkerThread) {
      return connectDB<UserList>(DBCommands.CREATE_USER, userData);
    }

    const user = { id: uuid.v4(), ...userData };
    this.users.push(user);
    return user;
  };

  public updateUser = async (id: UserId | null, userData: RequestUser) => {
    if (isWorkerThread) {
      return connectDB<UserList>(DBCommands.UPDATE_USER, id, userData);
    }

    const relatedUser = this.users.find((usr) => usr.id === id);
    if (!relatedUser) return null;

    const relatedUserIndex = this.users.findIndex((usr) => usr.id === id);
    const updatedUser = { ...relatedUser, ...userData };
    this.users[relatedUserIndex] = updatedUser;

    return updatedUser;
  };

  public deleteUser = async (id: UserId | null) => {
    if (isWorkerThread) {
      return connectDB<UserList>(DBCommands.DELETE_USER, id);
    }

    const userDeleteIndex = this.users.findIndex((usr) => usr.id === id);
    if (userDeleteIndex === -1) return false;
    this.users.splice(userDeleteIndex, 1);
    return true;
  };

  public clearData = () => {
    this.users.splice(0);
  };
}

export default new DB();
