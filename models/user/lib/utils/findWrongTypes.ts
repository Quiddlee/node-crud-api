import { RequestUser } from '../../usersModel';

const findWrongTypes = (user: RequestUser) => {
  return Object.entries(user)
    .map(([key, value]) => {
      if (key === 'age' && typeof value !== 'number') {
        return key;
      }

      if (key === 'username' && typeof value !== 'string') {
        return key;
      }

      if (key === 'hobbies' && !Array.isArray(value)) {
        return key;
      }

      return null;
    })
    .filter(Boolean);
};

export default findWrongTypes;
