import { IRequest } from 'server/interfaces/ExtendedRequest';
import Category from '../models/category';
import { ICategory } from '../interfaces/CategoryModel';

class CategoryService {
  /**
   * function to create a new category
   * @param category category object
   * @returns category
   */
  createCategory(category: ICategory): Promise<any> {
    return Category.create(category);
  }

  /**
   * function to return all categories
   * @returns All categories
   */
  getAllCategories(): Promise<any> {
    return Promise.resolve(Category.find());
  }

  /**
   * function to update category
   * @param req req body
   * @returns updated category
   */
  updateCategory(req: IRequest) {
    const { category } = req;
    category.name = req.body.name;
    return category.save();
  }

  /**
   * function to remove category
   * @param req req body
   * @returns removed category
   */
  removeCategory(req: IRequest) {
    const { category } = req;
    return category.remove();
  }
}
export default new CategoryService();
