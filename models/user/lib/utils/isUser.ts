import { RequestBody } from '../../../../types/types';
import { RequestUser } from '../../usersModel';
import { REQUIRED_USER_FIELDS } from '../const';

const isUser = (body: RequestBody | RequestUser): body is RequestUser => {
  if (!body) return false;
  return REQUIRED_USER_FIELDS.every((field) =>
    Object.keys(body).includes(field),
  );
};

export default isUser;
