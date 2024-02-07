import 'dotenv/config';
import {
  createUser,
  deleteUser,
  getUser,
  getUserList,
  notFound,
  updateUser,
} from './controllers/usersController';
import { Routes } from './types/enums';
import App from './utils/app';
import { validateId } from './utils/validateId';

const app = new App();
const port = Number(process.env.PORT);
const host = process.env.HOST;

app.use(validateId);
app.route(Routes.USERS).get(getUserList).post(createUser);
app.route(Routes.USERS_ID).get(getUser).put(updateUser).delete(deleteUser);
app.use(notFound);

app.listen(port, host, () => {
  process.stdout.write(`App running on port ${port}...`);
});
