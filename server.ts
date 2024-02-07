import 'dotenv/config';
import {
  createUser,
  deleteUser,
  getUser,
  getUserList,
  notFound,
  updateUser,
} from './controllers/usersController';
import App from './utils/app';
import { validateId } from './utils/validateId';

const app = new App();
const port = Number(process.env.PORT);
const host = process.env.HOST;

// TODO: encapsulate routes in enum
app.use(validateId);
app.route('/api/users').get(getUserList).post(createUser);
app.route('/api/users/:id').get(getUser).put(updateUser).delete(deleteUser);
app.use(notFound);

app.listen(port, host, () => {
  process.stdout.write(`App running on port ${port}...`);
});
