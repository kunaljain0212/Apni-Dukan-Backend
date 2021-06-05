import formidable from 'formidable';
// const _ = require("lodash");
import fs from 'fs';
import Product from '../models/product';

export const getProductById = (req, res, next, id) => {
  Product.findById(id)
    .populate('category')
    .exec((error, product) => {
      if (error) {
        return res.status(400).json({
          error: 'Product not found in DB',
        });
      }
      req.product = product;
      next();
    });
};

export const createProduct = (req, res) => {
  const form = formidable.IncomingForm();
  form.keepExtensions = true;
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

    const product = new Product(fields);
    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: 'File size too big!',
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          error: 'Product not saved in DB',
        });
      }
      res.json(product);
    });
  });
};

export const getProduct = (req, res) => {
  req.product.photo = undefined;
  return res.json(req.product);
};

export const photo = (req, res, next) => {
  if (req.product.photo.data) {
    res.set('Content-Type', req.product.photo.contentType);
    return res.send(req.product.photo.data);
  }
  next();
};

export const updateProduct = (req, res) => {
  const form = formidable.IncomingForm();
  form.keepExtensions = true;
  form.parse(req, (error, fields, file) => {
    if (error) {
      return res.status(400).json({
        error: 'Problem updating product!',
      });
    }

    let { product } = req;
    // product = _.extend(product, fields);
    product = Object.assign(product, fields);
    console.log(product);

    if (file.photo) {
      if (file.photo.size > 3000000) {
        return res.status(400).json({
          error: 'File size too big!',
        });
      }
      product.photo.data = fs.readFileSync(file.photo.path);
      product.photo.contentType = file.photo.type;
    }

    product.save((error, product) => {
      if (error) {
        return res.status(400).json({
          error: 'Updation failed in DB',
        });
      }
      res.json(product);
    });
  });
};

export const deleteProduct = (req, res) => {
  const { product } = req;
  product.remove((error, deletedProduct) => {
    if (error) {
      return res.status(400).json({
        error: 'Product not deleted from DB',
      });
    }
    res.json({
      message: `${deletedProduct.name} deleted from DB`,
    });
  });
};

export const getAllProducts = (req, res) => {
  const limit = req.query.limit ? parseInt(req.query.limit) : 8;
  const sortBy = req.query.sortBy ? req.query.sortBy : '_id';

  Product.find()
    .select('-photo')
    .populate('category')
    .sort([[sortBy, 'asc']])
    .limit(limit)
    .exec((error, products) => {
      if (error) {
        return res.status(400).json({
          error: 'No products found',
        });
      }
      res.json(products);
    });
};

export const updateInventory = (req, res, next) => {
  const myOperations = req.body.order.products.map((prod) => ({
    updateOne: {
      filter: { _id: prod._id },
      update: { $inc: { stock: -prod.count, sold: +prod.count } },
    },
  }));

  // eslint-disable-next-line no-unused-vars
  Product.bulkWrite(myOperations, {}, (error, _) => {
    if (error) {
      return res.status(400).json({
        error: 'Inventory updation failed',
      });
    }
    next();
  });
};

export const getAllUniqueCategories = (req, res) => {
  // console.log("came in")
  Product.distinct('category', {}, (erroror, category) => {
    if (erroror) {
      return res.status(400).json({
        erroror: 'No category found for product',
      });
    }
    res.json(category);
  });
};
