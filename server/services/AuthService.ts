import User from '../models/user';
import jwt from 'jsonwebtoken';

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
    try {
      const user = await User.create({ name, lastName, email, password });
      return { name: user.name, email: user.email, id: user._id };
    } catch (error) {
      throw error;
    }
  }

  /**
   * Login service
   * @param email email of user
   * @param password password of user
   * @returns token, id, name, email and role
   */
  async login(email: string, password: string) {
    try {
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
    } catch (error) {
      throw error;
    }
  }
}

export default new UsersService();
