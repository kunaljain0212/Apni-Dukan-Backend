/* eslint-disable eqeqeq */
import { Request, Response, NextFunction } from 'express';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import ProductsService from '../services/ProductService';

export const getProductById = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
  id: string
): Promise<any> => {
  try {
    const product = await ProductsService.getProductById(id);
    req.product = product;
    return next();
  } catch (error) {
    return res.status(400).json({
      error: 'Product not found in DB',
    });
  }
};

// eslint-disable-next-line consistent-return
export const createProduct = async (req: Request, res: Response): Promise<any> => {
  try {
    const product = await ProductsService.createProduct(req);
    return res.json(product);
  } catch (error: any) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(400).json({ error: 'Database error occured' });
  }
};

export const getProduct = (req: IRequest, res: Response): any => {
  return res.json(req.product);
};

// eslint-disable-next-line consistent-return
export const updateProduct = async (req: IRequest, res: Response): Promise<any> => {
  try {
    const product = await ProductsService.updateProduct(req);
    res.json(product);
  } catch (error: any) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }
    return res.status(400).json({ error: 'Database error occured' });
  }
};

export const deleteProduct = async (req: IRequest, res: Response): Promise<any> => {
  try {
    const { product } = req;
    const deletedProduct = await product.remove();
    return res.json({
      message: `${deletedProduct.name} deleted from DB`,
    });
  } catch (error) {
    return res.status(400).json({
      error: 'Product not deleted from DB',
    });
  }
};

export const getAllProducts = async (req: IRequest, res: Response): Promise<any> => {
  try {
    const products = await ProductsService.getAllProducts(req.query.limit, req.query.sortBy);
    return res.json(products);
  } catch (error) {
    return res.status(400).json(error);
  }
};

export const updateInventory = async (
  req: IRequest,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    await ProductsService.updateInventory(req.body.order.products);
    return next();
  } catch (error) {
    return res.status(400).json({
      error: 'Inventory updation failed',
    });
  }
};

export const getAllUniqueCategories = async (_: Request, res: Response): Promise<any> => {
  try {
    const category = await ProductsService.getAllUniqueCategories();
    return res.json(category);
  } catch (error) {
    return res.status(400).json({
      error: 'No category found for product',
    });
  }
};
