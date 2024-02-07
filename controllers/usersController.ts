import * as uuid from 'uuid';

import { users } from '../data/data';
import findMissingFields from '../models/user/lib/utils/findMissingFields';
import isUser from '../models/user/lib/utils/isUser';
import { User } from '../models/user/usersModel';
import { StatusCode } from '../types/enums';
import { ExtendedReq, ExtendedRes, Req } from '../types/types';

// TODO: add JSDoc comments
// TODO: add emoji response

export const getUserList = (_req: ExtendedReq, res: ExtendedRes) => {
  res.status(StatusCode.SUCCESS).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

export const getUser = (req: ExtendedReq, res: ExtendedRes) => {
  const { id } = req.route;

  const user = users.find((usr) => usr.id === id);

  if (!user) {
    res.status(StatusCode.NOT_FOUND).json({
      status: 'fail',
      message: 'User not found',
    });

    return;
  }

  res.status(StatusCode.SUCCESS).json({
    status: 'success',
    data: {
      user,
    },
  });
};

export const createUser = (req: ExtendedReq, res: ExtendedRes) => {
  const { body } = req;

  if (!body || !isUser(body)) {
    const missingFields = findMissingFields(body).join(', ');

    res.status(StatusCode.BAD_REQUEST).json({
      status: 'fail',
      message: `The provided data is missing required fields (${missingFields})`,
    });

    return;
  }

  const user = <User>{ id: uuid.v4(), ...body };
  users.push(user);

  res.status(StatusCode.CREATED).json({
    status: 'success',
    data: {
      user,
    },
  });
};

export const updateUser = (req: ExtendedReq, res: ExtendedRes) => {
  const {
    body,
    route: { id },
  } = req;

  if (!body || !isUser(body)) {
    const missingFields = findMissingFields(body).join(', ');

    res.status(StatusCode.BAD_REQUEST).json({
      status: 'fail',
      message: `The provided data is missing required fields (${missingFields})`,
    });

    return;
  }

  const relatedUser = users.find((usr) => usr.id === id);
  const relatedUserIndex = users.findIndex((usr) => usr.id === id);

  if (!relatedUser) {
    res.status(StatusCode.NOT_FOUND).json({
      status: 'fail',
      message: 'User not found',
    });

    return;
  }

  const updatedUser = (<User>{ ...relatedUser, ...body }) as User;
  users[relatedUserIndex] = updatedUser;

  res.status(StatusCode.SUCCESS).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
};

export const deleteUser = (req: ExtendedReq, res: ExtendedRes) => {
  const { id } = req.route;

  const userDeleteIndex = users.findIndex((usr) => usr.id === id);

  if (userDeleteIndex === -1) {
    res.status(StatusCode.NOT_FOUND).json({
      status: 'fail',
      message: 'User not found',
    });

    return;
  }

  users.splice(userDeleteIndex, 1);

  res.status(StatusCode.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
};

export const notFound = (_req: Req, res: ExtendedRes) => {
  res.status(StatusCode.NOT_FOUND).json({
    status: 'fail',
    message: 'The route does not exist',
  });
};
