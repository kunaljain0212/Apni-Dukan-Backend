const User = require("../models/user");
const Order = require("../models/order");

exports.getUserById = (req, res, next, id) => {
  User.findById(id).exec((error, user) => {
    if (error || !user) {
      res.status(400).json({
        error: "USER NOT FOUND",
      });
    }
    req.profile = user;
    next();
  });
};

exports.getUser = (req, res) => {
  //TODO password needs to be hiddden
  req.profile.encry_password = undefined;
  req.profile.salt = undefined;
  req.profile.createdAt = undefined;
  req.profile.updatedAt = undefined;
  res.json(req.profile);
};

exports.updateUser = (req, res) => {
  User.findByIdAndUpdate(
    { _id: req.profile._id },
    { $set: req.body },
    { new: true, useFindAndModify: false },
    (error, user) => {
      if (error) {
        res.status(400).json({
          error: "You are not authorized to update this information",
        });
      }
      user.encry_password = undefined;
      user.salt = undefined;
      user.createdAt = undefined;
      user.updatedAt = undefined;
      res.json(user);
    }
  );
};

exports.userPurchaseList = (req, res) => {
  Order.find({ user: req.profile._id })
    .populate("user", "_id name")
    .exec((error, order) => {
      if (error) {
        res.status(404).json({
          error: "NO ORDER IN THIS ACCOUNT",
        });
      }
      res.json(order);
    });
};

exports.pushOrderInPurchaseList = (req, res, next) => {
  let purchases = [];
  req.body.order.products.forEach((product) => {
    purchases.push({
      _id: product._id,
      name: product.name,
      description: product.description,
      category: product.category,
      quantity: product.quantity,
      amount: req.body.order.amount,
      transaction_id: req.body.order.transaction_id,
    });
  });

  //store this in DB
  User.findOneAndUpdate(
    { _id: req.profile._id },
    { $push: { purchases: purchases } },
    { new: true },
    (error, purchases) => {
      if (error) {
        return res.status(400).json({
          erroror: "Unable to save purchase list",
        });
      }
      next();
    }
  );
};
