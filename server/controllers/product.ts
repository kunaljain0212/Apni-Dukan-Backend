/* eslint-disable eqeqeq */
import { Request, Response, NextFunction } from 'express';
import formidable from 'formidable';
import cloudinary from 'cloudinary';
import { IRequest } from 'server/interfaces/ExtendedRequest';
import { IProduct } from 'server/interfaces/ProductModel';
import Product from '../models/product';

export const getProductById = (
  req: IRequest,
  res: Response,
  next: NextFunction,
  id: string
): any => {
  Product.findById(id)
    .populate('category')
    .exec((error, product) => {
      if (error) {
        return res.status(400).json({
          error: 'Product not found in DB',
        });
      }
      req.product = product;
      return next();
    });
};

export const createProduct = (req: Request, res: Response): any => {
  const form = new formidable.IncomingForm();

  (cloudinary as any).config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET,
  });
  // eslint-disable-next-line consistent-return
  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: 'Problem creating product!',
      });
    }

    const { name, description, price, stock, category } = fields;

    if (!name || !description || !price || !stock || !category) {
      return res.status(400).json({
        error: 'Fields can not be empty',
      });
    }
    if (file.photo as formidable.File) {
      if ((file.photo as formidable.File).size > 3000000) {
        return res.status(400).json({
          error: 'File size too big!',
        });
      }
      cloudinary.v2.uploader.upload(
        (file.photo as formidable.File).path,
        { quality: '40' },
        // eslint-disable-next-line consistent-return
        (cloudError, result) => {
          if (cloudError) {
            return res.status(400).json({
              error: 'Product not saved in DB',
            });
          }
          // eslint-disable-next-line no-param-reassign
          fields.photo = result?.secure_url as string;
          const product = new Product(fields);

          product.save((saveError, savedProduct) => {
            if (saveError) {
              return res.status(400).json({
                error: 'Product not saved in DB',
              });
            }
            return res.json(savedProduct);
          });
        }
      );
    }
  });
};

export const getProduct = (req: IRequest, res: Response): any => {
  return res.json(req.product);
};

export const updateProduct = (req: IRequest, res: Response): any => {
  const form = new formidable.IncomingForm();

  (cloudinary as any).config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_SECRET,
  });
  // eslint-disable-next-line consistent-return
  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: 'Problem updating product!',
      });
    }

    let { product } = req;
    product = Object.assign(product, fields);

    if (file.photo as formidable.File) {
      if ((file.photo as formidable.File).size > 3000000) {
        return res.status(400).json({
          error: 'File size too big!',
        });
      }
      cloudinary.v2.uploader.upload(
        (file.photo as formidable.File).path,
        { quality: '40' },
        // eslint-disable-next-line consistent-return
        (cloudError, result) => {
          if (cloudError) {
            return res.status(400).json({
              error: 'Product not saved in DB',
            });
          }
          // eslint-disable-next-line no-param-reassign
          product.photo = result?.secure_url as string;
          product.save((saveError: any, savedProduct: IProduct) => {
            if (saveError) {
              return res.status(400).json({
                error: 'Updation failed in DB',
              });
            }
            return res.json(savedProduct);
          });
        }
      );
    }
  });
};

export const deleteProduct = (req: IRequest, res: Response): any => {
  const { product } = req;
  product.remove((error: any, deletedProduct: IProduct) => {
    if (error) {
      return res.status(400).json({
        error: 'Product not deleted from DB',
      });
    }
    return res.json({
      message: `${deletedProduct.name} deleted from DB`,
    });
  });
};

export const getAllProducts = (req: IRequest, res: Response): any => {
  const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 8;
  const sortBy = req.query.sortBy ? req.query.sortBy : '_id';

  Product.find()
    .populate('category')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((error, products) => {
      if (error) {
        return res.status(400).json({
          error: 'Error connecting to DB',
        });
      }
      if (products.length === 0) {
        return res.status(400).json({
          error: 'No products found',
        });
      }
      return res.json(products);
    });
};

export const updateInventory = (req: IRequest, res: Response, next: NextFunction): any => {
  const myOperations = req.body.order.products.map((prod: any) => ({
    updateOne: {
      filter: { _id: prod._id },
      update: { $inc: { stock: -prod.count, sold: +prod.count } },
    },
  }));

  Product.bulkWrite(myOperations, {}, (error, _updatedInventory) => {
    if (error) {
      return res.status(400).json({
        error: 'Inventory updation failed',
      });
    }
    return next();
  });
};

export const getAllUniqueCategories = (_req: Request, res: Response): any => {
  Product.distinct('category', {}, (erroror, category) => {
    if (erroror) {
      return res.status(400).json({
        erroror: 'No category found for product',
      });
    }
    return res.json(category);
  });
};
