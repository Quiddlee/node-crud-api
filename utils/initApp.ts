import App from './app';
import { validateId } from './validateId';
import {
  createUser,
  deleteUser,
  getUser,
  getUserList,
  notFound,
  updateUser,
} from '../controllers/usersController';
import { Routes } from '../types/enums';

const host = process.env.HOST;

const initApp = () => {
  const app = new App();
  const port = Number(process.env.PORT);

  app.use(validateId);
  app.route(Routes.USERS).get(getUserList).post(createUser);
  app.route(Routes.USERS_ID).get(getUser).put(updateUser).delete(deleteUser);
  app.use(notFound);

  app.listen(port, host, () => {
    process.stdout.write(`App running on port ${port}...\n`);
  });
};

export default initApp;
