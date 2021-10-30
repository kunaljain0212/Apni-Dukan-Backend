import jwt from 'jsonwebtoken';
import User from '../models/user';

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
}

export default new UsersService();
