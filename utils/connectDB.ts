import { User, UserList } from '../models/user/usersModel';
import { DBCommands } from '../types/enums';

/**
 * Connects to the database and executes the given command with the given arguments.
 * @template - TData The type of the data to be returned, which must extend User or UserList.
 * @param {DBCommands} command - The command to be executed on the database.
 * @param {...unknown[]} args - The arguments to be passed to the command.
 * @returns {Promise<TData> | never} - A promise that resolves to the data of type TData, or throws an error if no response is received from the database.
 * @throws - Error is thrown if database returns nothing
 */
const connectDB = <TData extends User | UserList>(
  command: DBCommands,
  ...args: unknown[]
): Promise<TData> | never =>
  new Promise((resolve, reject) => {
    process.send?.({ command, args });
    process.on('message', (msg: { res: TData }) => {
      if ('res' in msg) {
        resolve(msg.res);
      } else {
        reject(new Error('Could not get response from DB!'));
      }
    });
  });

export default connectDB;
