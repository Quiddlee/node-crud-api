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

api.use(validateId);
api.route('/api/users').get(getUserList).post(createUser);
api.route('/api/users/:id').get(getUser).put(updateUser).delete(deleteUser);
api.use(notFound);

api.listen(port, host, () => {
  process.stdout.write(`App running on port ${port}...`);
});
