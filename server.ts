import 'dotenv/config';
import {
  createUser,
  deleteUser,
  getUser,
  getUserList,
  notFound,
  updateUser,
  validateId,
} from './controllers/usersController';
import Api from './utils/Api';

const api = new Api();

const port = Number(process.env.PORT);
const host = process.env.HOST;
api.listen(port, host, () => {
  // eslint-disable-next-line no-console
  console.log(`App running on port ${port}...`);
});

api.use(validateId);
api.route('/api/users').get(getUserList).post(createUser);
api.route('/api/users/:id').get(getUser).put(updateUser).delete(deleteUser);
api.use(notFound);
