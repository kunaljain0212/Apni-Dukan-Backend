/* eslint-disable func-names */
import mongoose from 'mongoose';
import crypto from 'crypto';
import uuid from 'uuid';
import { IUser } from 'server/interfaces/UserModel';

const uuidv1 = uuid.v1;

const userSchema = new mongoose.Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      maxlength: 32,
      trim: true,
    },
    lastname: {
      type: String,
      maxlength: 32,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      required: true,
      unique: true,
    },
    userinfo: {
      type: String,
      trim: true,
    },
    encry_password: {
      type: String,
      required: true,
    },
    salt: String,
    role: {
      type: Number,
      default: 0,
    },
    purchases: {
      type: Array,
      default: [],
    },
  },
  { timestamps: true }
);

userSchema.methods = {
  securePassword(plainPassword: string) {
    if (!plainPassword) return '';
    try {
      return crypto.createHmac('sha256', this.salt).update(plainPassword).digest('hex');
    } catch (err) {
      return '';
    }
  },

  authenticate(plainPassword: string) {
    return this.securePassword(plainPassword) === this.encry_password;
  },
};

userSchema
  .virtual('password')
  .set(function (this: IUser, password: string) {
    this._password = password;
    this.salt = uuidv1();
    this.encry_password = this.securePassword(password);
  })
  // eslint-disable-next-line no-unused-vars
  .get(function (this: IUser) {
    return this._password;
  });

export default mongoose.model<IUser>('User', userSchema);
