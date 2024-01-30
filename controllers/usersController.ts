import * as uuid from 'uuid';

import { users } from '../data/data';
import { StatusCode } from '../types/enums';
import { ExtendedReq, ExtendedRes } from '../types/types';

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
