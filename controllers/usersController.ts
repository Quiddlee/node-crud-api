import { isNativeError } from 'node:util/types';

import db from '../db/db';
import findMissingFields from '../models/user/lib/utils/findMissingFields';
import findWrongTypes from '../models/user/lib/utils/findWrongTypes';
import isUser from '../models/user/lib/utils/isUser';
import { StatusCode } from '../types/enums';
import { ExtendedReq, ExtendedRes, Req } from '../types/types';

// TODO: add emoji response

/**
 * Gets the list of users from the database and sends it as a JSON response.
 * @param {ExtendedReq} _req - The incoming request object, which is not used in this function.
 * @param {ExtendedRes} res - The outgoing response object, which is used to send the JSON response.
 */
export const getUserList = async (_req: ExtendedReq, res: ExtendedRes) => {
  try {
    const users = await db.getUserList();

    res.status(StatusCode.SUCCESS).json({
      status: 'success',
      results: users.length,
      data: {
        users,
      },
    });
  } catch (e) {
    if (!isNativeError(e)) return;

    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: `💥 Internal server error! (${e.message})`,
    });
  }
};

/**
 * Gets the user with the given id from the database and sends it as a JSON response.
 * @param {ExtendedReq} req - The incoming request object, which contains the id of the user in the route property.
 * @param {ExtendedRes} res - The outgoing response object, which is used to send the JSON response.
 */
export const getUser = async (req: ExtendedReq, res: ExtendedRes) => {
  try {
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
  } catch (e) {
    if (!isNativeError(e)) return;

    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: `💥 Internal server error! (${e.message})`,
    });
  }
};

/**
 * Creates a new user in the database with the given data and sends it as a JSON response.
 * @param {ExtendedReq} req - The incoming request object, which contains the user data in the body property.
 * @param {ExtendedRes} res - The outgoing response object, which is used to send the JSON response.
 */
export const createUser = async (req: ExtendedReq, res: ExtendedRes) => {
  try {
    const { body } = req;

    if (!body || !isUser(body)) {
      const missingFields = findMissingFields(body).join(', ');

      res.status(StatusCode.BAD_REQUEST).json({
        status: 'fail',
        message: `The provided data is missing required fields (${missingFields})`,
      });

      return;
    }

    const userWrongTypes = findWrongTypes(body);
    if (userWrongTypes.length !== 0) {
      const wrongTypes = userWrongTypes.join(', ');

      res.status(StatusCode.BAD_REQUEST).json({
        status: 'fail',
        message: `The provided data is containing wrong types (${wrongTypes})`,
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
  } catch (e) {
    if (!isNativeError(e)) return;

    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: `💥 Internal server error! (${e.message})`,
    });
  }
};

/**
 * Updates the user with the given id in the database with the given data and sends it as a JSON response.
 * @param {ExtendedReq} req - The incoming request object, which contains the user data in the body property and the user id in the route property.
 * @param {ExtendedRes} res - The outgoing response object, which is used to send the JSON response.
 */
export const updateUser = async (req: ExtendedReq, res: ExtendedRes) => {
  try {
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
  } catch (e) {
    if (!isNativeError(e)) return;

    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: `💥 Internal server error! (${e.message})`,
    });
  }
};

/**
 * Deletes the user with the given id from the database and sends a JSON response.
 * @param {ExtendedReq} req - The incoming request object, which contains the id of the user in the route property.
 * @param {ExtendedRes} res - The outgoing response object, which is used to send the JSON response.
 */
export const deleteUser = async (req: ExtendedReq, res: ExtendedRes) => {
  try {
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
  } catch (e) {
    if (!isNativeError(e)) return;

    res.status(StatusCode.INTERNAL_SERVER_ERROR).json({
      status: 'fail',
      message: `💥 Internal server error! (${e.message})`,
    });
  }
};

/**
 * Sends a JSON response with a 404 status code and a message indicating that the route does not exist.
 * @param {Req} _req - The incoming request object, which is not used in this function.
 * @param {ExtendedRes} res - The outgoing response object, which is used to send the JSON response.
 */
export const notFound = async (_req: Req, res: ExtendedRes) => {
  res.status(StatusCode.NOT_FOUND).json({
    status: 'fail',
    message: 'The route does not exist',
  });
};
