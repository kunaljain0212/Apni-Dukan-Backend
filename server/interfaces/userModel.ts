import { Document, Model } from 'mongoose';

export interface IUser extends Document {
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
  securePassword: (plainPassword: string) => string;
  // eslint-disable-next-line no-unused-vars
  authenticate: (plainPassword: string) => boolean;
}

export type IUserInstanceCreation = Model<IUser>;
