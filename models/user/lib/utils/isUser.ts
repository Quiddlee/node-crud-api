import { User } from '../../usersModel';
import { REQUIRED_USER_FIELDS } from '../const';

const isUser = (
  body: Record<string, string> | Omit<User, 'id'>,
): body is Omit<User, 'id'> => {
  return REQUIRED_USER_FIELDS.every((field) =>
    Object.keys(body).includes(field),
  );
};

export default isUser;
