import * as uuid from 'uuid';

import { users } from '../data/data';
import findMissingFields from '../models/user/utils/findMissingFields';
import isUser from '../models/user/utils/isUser';
import { StatusCode } from '../types/enums';
import { ExtendedReq, ExtendedRes, User } from '../types/types';

export const getUserList = (_req: ExtendedReq, res: ExtendedRes) => {
  res.status(StatusCode.SUCCESS).json(users);
};

export const getUser = (req: ExtendedReq, res: ExtendedRes) => {
  const { id } = req.route;

  if (!uuid.validate(id)) {
    res.status(StatusCode.BAD_REQUEST).json({
      status: 'fail',
      message: 'The provided id is not valid uuid',
    });

    return;
  }

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

export const createUser = (
  req: ExtendedReq,
  res: ExtendedRes,
  error?: Error,
) => {
  if (error) {
    res.status(StatusCode.BAD_REQUEST).json({
      status: 'error',
      message: error.message,
    });

    return;
  }

  const { body } = req;

  if (!body || !isUser(body)) {
    const missingFields = findMissingFields(body);

    res.status(StatusCode.BAD_REQUEST).json({
      status: 'fail',
      message: `The provided data is missing neccessary fields (${missingFields.join(', ')})`,
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
