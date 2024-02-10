import db from '../db/db';
import findMissingFields from '../models/user/lib/utils/findMissingFields';
import isUser from '../models/user/lib/utils/isUser';
import { StatusCode } from '../types/enums';
import { ExtendedReq, ExtendedRes, Req } from '../types/types';

// TODO: add JSDoc comments
// TODO: add emoji response
// TODO: handle server errors

export const getUserList = async (_req: ExtendedReq, res: ExtendedRes) => {
  const users = await db.getUserList();

  res.status(StatusCode.SUCCESS).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
};

export const getUser = async (req: ExtendedReq, res: ExtendedRes) => {
  const { id } = req.route;
  const user = await db.getUser(id);

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

export const createUser = async (req: ExtendedReq, res: ExtendedRes) => {
  const { body } = req;

  if (!body || !isUser(body)) {
    const missingFields = findMissingFields(body).join(', ');

    res.status(StatusCode.BAD_REQUEST).json({
      status: 'fail',
      message: `The provided data is missing required fields (${missingFields})`,
    });

    return;
  }

  const user = await db.createUser(body);

  res.status(StatusCode.CREATED).json({
    status: 'success',
    data: {
      user,
    },
  });
};

export const updateUser = async (req: ExtendedReq, res: ExtendedRes) => {
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

  const updatedUser = await db.updateUser(id, body);

  if (!updatedUser) {
    res.status(StatusCode.NOT_FOUND).json({
      status: 'fail',
      message: 'User not found',
    });

    return;
  }

  res.status(StatusCode.SUCCESS).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
};

export const deleteUser = async (req: ExtendedReq, res: ExtendedRes) => {
  const { id } = req.route;
  const isDeleted = await db.deleteUser(id);

  if (!isDeleted) {
    res.status(StatusCode.NOT_FOUND).json({
      status: 'fail',
      message: 'User not found',
    });

    return;
  }

  res.status(StatusCode.NO_CONTENT).json({
    status: 'success',
    data: null,
  });
};

export const notFound = async (_req: Req, res: ExtendedRes) => {
  res.status(StatusCode.NOT_FOUND).json({
    status: 'fail',
    message: 'The route does not exist',
  });
};
