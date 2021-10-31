import jwt from 'jsonwebtoken';
import User from '../models/user';
import otpModel from '../models/otp';
import { otpGenerator } from '../utils/otpGenerator';
import MailerService from './MailerService';

class UsersService {
  /**
   * Signup service
   * @param name name of user
   * @param lastName last name of user
   * @param email email of user
   * @param password password of user
   * @returns name, email, id
   */
  async signup(name: string, lastName: string, email: string, password: string) {
    const user = await User.create({ name, lastName, email, password });
    return { name: user.name, email: user.email, id: user._id };
  }

  /**
   * Login service
   * @param email email of user
   * @param password password of user
   * @returns token, id, name, email and role
   */
  async login(email: string, password: string) {
    const user = await User.findOne({ email });
    if (!user) {
      throw {
        statusCode: 400,
        message: 'USER not found!',
      };
    }

    if (!user.authenticate(password)) {
      throw {
        statusCode: 401,
        message: 'CREDENTIALS DO NOT MATCH!',
      };
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.SECRET || ''
    );

    return { token, _id: user._id, name: user.name, email: user.email, role: user.role };
  }

  /**
   * social login service
   * @param email email id of user
   * @param name name of user
   * @param picture avatar of user
   * @returns token, user object
   */
  async socialLogin(email: string, name: string, picture: string) {
    try {
      var user = await User.findOne({ email });
      if (user) {
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.SECRET || ''
        );
        var { _id, name, email, role } = user;
        return {
          token,
          user: {
            _id,
            name,
            email,
            role,
          },
        };
      } else {
        user = await User.create({
          name,
          email,
          avatar: picture,
        });
        const token = jwt.sign(
          {
            _id: user._id,
          },
          process.env.SECRET || ''
        );
        var { _id, name, email, role } = user;
        return {
          token,
          user: {
            _id,
            name,
            email,
            role,
          },
        };
      }
    } catch (error: any) {
      throw { statusCode: 400, error: error.message };
    }
  }

  /**
   * Function which stores otp of user and send email
   * @param email email id of user
   */
  async forgotPassword(email: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw { status: 400, message: 'User not found' };

      const otpFind = await otpModel.findById(email);

      if (otpFind) {
        const currentTime: any = new Date();
        if (currentTime - otpFind.updatedAt < 300000) {
          // less than 5 minutes = 300000 milliseconds
          throw { status: 400, message: 'Please Request after 5 minutes' };
        }

        if (otpFind.counter >= 3) {
          throw { status: 400, message: 'Maximum OTP request limit reached. Try after 1 hour' };
        }
      }
      const otp = otpGenerator();

      const promises = [];

      promises.push(
        otpModel.updateOne({ _id: email }, { otp }, { upsert: true, setDefaultsOnInsert: true })
      );
      promises.push(MailerService.sendPasswordResetEmail(user.email, user.name, otp));
      await Promise.all(promises);
    } catch (err) {
      throw err;
    }
  }

  /**
   * Reset password of user after verifying otp
   * @param email email id of the user
   * @param otp otp
   * @param password password of the user
   */
  async resetPassword(email: string, otp: number, password: string) {
    try {
      const user = await User.findOne({ email });
      if (!user) throw { status: 400, message: 'User not found' };

      const otpFind = await otpModel.findById(email);

      if (!otpFind) throw { status: 400, message: 'Please request for a new OTP first' };

      if (otpFind.otp !== otp) throw { status: 400, message: 'Invalid OTP' };

      const promises = [];
      promises.push(
        User.findOneAndUpdate(
          { email },
          {
            password,
          }
        )
      );
      promises.push(otpModel.findOneAndDelete({ email }));
      await Promise.all(promises);
    } catch (err) {
      throw err;
    }
  }
}

export default new UsersService();
