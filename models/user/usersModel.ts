export type User = {
  id: string;
  username: string;
  age: number;
  hobbies: string[] | [];
};

export type RequestUser = Omit<User, 'id'>;

export type UserList = User[];

export type UserId = User['id'];
