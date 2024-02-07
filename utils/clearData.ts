import { users } from '../data/data';

/**
 * Clears the users data by removing all elements.
 * @return {void} - Returns nothing.
 */
const clearData = () => {
  users.splice(0);
};

export default clearData;
