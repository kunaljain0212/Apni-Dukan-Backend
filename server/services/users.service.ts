import User from '../models/user';
import jwt from 'jsonwebtoken';

class UsersService {
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
