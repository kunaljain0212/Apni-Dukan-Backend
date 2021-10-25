import { IRequest } from 'server/interfaces/ExtendedRequest';
import Category from '../models/category';

class CategoryService {
  /**
   * function to create a new category
   * @param category category object
   * @returns category
   */
  async createCategory(category: object): Promise<object> {
    return await Category.create(category);
  }

  /**
   * function to return all categories
   * @returns All categories
   */
  async getAllCategories(): Promise<object> {
    return await Category.find();
  }

  /**
   * function to update category
   * @param req req body
   * @returns updated category
   */
  async updateCategory(req: IRequest) {
    const { category } = req;
    category.name = req.body.name;
    return await category.save();
  }

  /**
   * function to remove category
   * @param req req body
   * @returns removed category
   */
  async removeCategory(req: IRequest) {
    const { category } = req;
    return await category.remove();
  }
}
export default new CategoryService();
