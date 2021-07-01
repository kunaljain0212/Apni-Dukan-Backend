export default interface UserModel {
  name: string;
  lastname: string;
  email: string;
  userinfo: string;
  // eslint-disable-next-line camelcase
  encry_password: string;
  _password: string;
  salt: string;
  role: number;
  purchases: [unknown];
  // eslint-disable-next-line no-unused-vars
  securePassword: (arg0: string) => string;
  // eslint-disable-next-line no-unused-vars
  authenticate: (this: UserModel, plainPassword: string) => boolean;
}
