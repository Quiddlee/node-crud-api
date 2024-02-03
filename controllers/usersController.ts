import * as uuid from 'uuid';

import { users } from '../data/data';
import findMissingFields from '../models/user/utils/findMissingFields';
import isUser from '../models/user/utils/isUser';
import { StatusCode } from '../types/enums';
import { ExtendedReq, ExtendedRes, Req, User } from '../types/types';

export const validateId = (req: ExtendedReq, res: ExtendedRes) => {
  const { id } = req.route;

  if (!id || uuid.validate(id)) return;

  res.status(StatusCode.BAD_REQUEST).json({
    status: 'fail',
    message: 'The provided id is not valid uuid',
  });
};

export const getUserList = (_req: ExtendedReq, res: ExtendedRes) => {
  res.status(StatusCode.SUCCESS).json(users);
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

  res.status(StatusCode.SUCCESS).json(user);
};

export const createUser = (req: ExtendedReq, res: ExtendedRes) => {
  const { body } = req;

  if (!body || !isUser(body)) {
    const missingFields = findMissingFields(body);

    res.status(StatusCode.BAD_REQUEST).json({
      status: 'fail',
      message: `The provided data is missing required fields (${missingFields.join(', ')})`,
    });

    return;
  }

  const user = { id: uuid.v4(), ...body };
  users.push(user);

  res.status(StatusCode.CREATED).json({
    status: 'success',
    data: user,
  });
};

export const updateUser = (req: ExtendedReq, res: ExtendedRes) => {
  const {
    body,
    route: { id },
  } = req;

  if (!body || !isUser(body)) {
    const missingFields = findMissingFields(body);

    res.status(StatusCode.BAD_REQUEST).json({
      status: 'fail',
      message: `The provided data is missing required fields (${missingFields.join(', ')})`,
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

  const updatedUser = { ...relatedUser, ...body } as User;
  users[relatedUserIndex] = updatedUser;

  res.status(StatusCode.SUCCESS).json({
    status: 'success',
    data: updatedUser,
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

  delete users[userDeleteIndex];

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
