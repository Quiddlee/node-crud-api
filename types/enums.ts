export enum StatusCode {
  SUCCESS = 200,
  CREATED = 201,
  NO_CONTENT = 204,
  NOT_FOUND = 404,
  BAD_REQUEST = 400,
  UNAUTHORIZED = 403,
  INTERNAL_SERVER_ERROR = 500,
}

export enum HttpMethods {
  GET = 'GET',
  POST = 'POST',
  PUT = 'PUT',
  DELETE = 'DELETE',
}

export enum Routes {
  USERS = '/api/users',
  USERS_ID = '/api/users/:id',
}

export enum DBCommands {
  GET_USER_LIST = 'getUserList',
  GET_USER = 'getUser',
  CREATE_USER = 'createUser',
  UPDATE_USER = 'updateUser',
  DELETE_USER = 'deleteUser',
}
