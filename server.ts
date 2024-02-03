import 'dotenv/config';
import {
  createUser,
  deleteUser,
  getUser,
  getUserList,
  notFound,
  updateUser,
  validateBody,
} from './controllers/usersController';
import Api from './utils/Api';
import { validateId } from './utils/validateId';

const api = new Api();
const port = Number(process.env.PORT);
const host = process.env.HOST;

api.use(validateId).use(validateBody);
api.route('/api/users').get(getUserList).post(createUser);
api.route('/api/users/:id').get(getUser).put(updateUser).delete(deleteUser);
api.use(notFound);

api.listen(port, host, () => {
  process.stdout.write(`App running on port ${port}...`);
});
