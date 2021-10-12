/* eslint-disable eqeqeq */
import { Request, Response, NextFunction } from 'express';
import formidable from 'formidable';
import cloudinary from 'cloudinary';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import Product from '../models/product';

export const getProductById = async (
  req: IRequest,
  res: Response,
  next: NextFunction,
  id: string
): Promise<any> => {
  try {
    const product = await Product.findById(id).populate('category');
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
    const form = new formidable.IncomingForm();
    (cloudinary as any).config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_SECRET,
    });
    form.parse(req, (error, fields, file) => {
      if (error) {
        throw {
          statusCode: 400,
          message: 'Problem creating product!',
        };
      }

      const { name, description, price, stock, category } = fields;

      if (!name || !description || !price || !stock || !category) {
        throw {
          statusCode: 400,
          message: 'Fields can not be empty!',
        };
      }
      if (file.photo as formidable.File) {
        if ((file.photo as formidable.File).size > 3000000) {
          throw {
            statusCode: 400,
            message: 'File size too big!',
          };
        }
        cloudinary.v2.uploader.upload(
          (file.photo as formidable.File).path,
          { quality: '40' },
          async (cloudError, result) => {
            if (cloudError) {
              throw {
                statusCode: 400,
                message: 'Product not saved in DB!',
              };
            }
            // eslint-disable-next-line no-param-reassign
            fields.photo = result?.secure_url as string;
            const product = new Product(fields);
            const savedProduct = await product.save();
            return res.json(savedProduct);
          }
        );
      }
    });
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
    const form = new formidable.IncomingForm();

    (cloudinary as any).config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.CLOUD_API_KEY,
      api_secret: process.env.CLOUD_SECRET,
    });
    form.parse(req, (error, fields, file) => {
      if (error) {
        throw {
          statusCode: 400,
          message: 'Problem updating product!',
        };
      }

      let { product } = req;
      product = Object.assign(product, fields);

      if (file.photo as formidable.File) {
        if ((file.photo as formidable.File).size > 3000000) {
          throw {
            statusCode: 400,
            message: 'File size too big!',
          };
        }
        cloudinary.v2.uploader.upload(
          (file.photo as formidable.File).path,
          { quality: '40' },
          async (cloudError, result) => {
            if (cloudError) {
              throw {
                statusCode: 400,
                message: 'Product not saved in DB!',
              };
            }
            // eslint-disable-next-line no-param-reassign
            product.photo = result?.secure_url as string;
            const savedProduct = await product.save();
            return res.json(savedProduct);
          }
        );
      }
    });
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
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
    const sortBy = req.query.sortBy ? req.query.sortBy : '_id';
    const products = await Product.find()
      .populate('category')
      .sort([[sortBy, 'asc']])
      .limit(limit);
    if (products.length === 0) {
      throw new Error('No products found');
    }
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
    const myOperations = req.body.order.products.map((prod: any) => ({
      updateOne: {
        filter: { _id: prod._id },
        update: { $inc: { stock: -prod.count, sold: +prod.count } },
      },
    }));
    Product.bulkWrite(myOperations, {});
    return next();
  } catch (error) {
    return res.status(400).json({
      error: 'Inventory updation failed',
    });
  }
};

export const getAllUniqueCategories = async (_: Request, res: Response): Promise<any> => {
  try {
    const category = await Product.distinct('category', {});
    return res.json(category);
  } catch (error) {
    return res.status(400).json({
      error: 'No category found for product',
    });
  }
};
