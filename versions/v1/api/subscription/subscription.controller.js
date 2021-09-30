const Subscription = require("./subscription.model");
const mongoose = require('mongoose');
const createError = require("http-errors");
exports.getAllSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.find({}).sort({createdAt: 1}).select('-__v');
    
      res.status(200).json({
        statusCode: 200,
        message: "success",
        data: subscription
      });
  } catch (error) {
    next(error);
  }
};

exports.createSubscription = (req, res, next) => {
   
  const subscription = new Subscription({
    _id: new mongoose.Types.ObjectId(),
    name : req.body.name,
    extensionDays : req.body.extensionDays,
    amount : req.body.amount,
    description : req.body.description,
    renewalDays : req.body.renewalDays
  })
  subscription.save()
    .then((data) => {
      res.status(201).json({
        statusCode: 201,
        message: "Created Successfully",
        data: data
      });
    }).catch(err => { next(err) });
};