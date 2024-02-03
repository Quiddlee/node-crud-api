import * as uuid from 'uuid';

import { StatusCode } from '../types/enums';
import { ExtendedReq, ExtendedRes } from '../types/types';

export const validateId = (req: ExtendedReq, res: ExtendedRes) => {
  const { id } = req.route;

  if (!id || uuid.validate(id)) return;

  res.status(StatusCode.BAD_REQUEST).json({
    status: 'fail',
    message: 'The provided id is not valid uuid',
  });
};
