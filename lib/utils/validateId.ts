import * as uuid from 'uuid';

import { StatusCode } from '../../types/enums';
import { ExtendedReq, ExtendedRes } from '../../types/types';

/**
 * Validates the id in the request route and sends a JSON response with a 400 status code if it is not a valid uuid.
 * @param {ExtendedReq} req - The incoming request object, which contains the id in the route property.
 * @param {ExtendedRes} res - The outgoing response object, which is used to send the JSON response.
 */
export const validateId = (req: ExtendedReq, res: ExtendedRes) => {
  const id = req.route?.id;

  if (!id || uuid.validate(id)) return;

  res.status(StatusCode.BAD_REQUEST).json({
    status: 'fail',
    message: 'The provided id is not valid uuid',
  });
};
