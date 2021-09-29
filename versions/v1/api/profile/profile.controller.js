const mongoose = require("mongoose");
const MyError = require("../../error/MyError");
const Profile = require("./profile.model");
const User = require("../auth/auth.model");
require('dotenv').config();


exports.uploadProfile = async (req, res, next) => {
    const _id = req.params.id;
    const user = await User.findOne({ _id: _id });
    if (!user) return next(new MyError(404, "Invalid User ID"));

    const { address, city, state, country, zipcode, phone, subscription, expiryDate } = req.body;
    
    const profile = new Profile({
        user: new mongoose.Types.ObjectId(user._id),
        address: address,
        city: city,
        state: state,
        country: country,
        zipcode: zipcode,
        phone: phone,
        subscription: new mongoose.Types.ObjectId(subscription),
        expiryDate: expiryDate
    });

    profile.save()
        .then(data => {
            res.status(201).json({
                statusCode: 201,
                message: 'Profile has been Created',
                data: data
            })
        })
        .catch(err => next(err));
};

exports.getProfile = async (req, res, next) => {
    const _id = req.params.id;
    const user = await User.findOne({ _id: _id });
    if (!user) return next(new MyError(404, "Invalid User ID"));
    console.log(user);
    const profile = await Profile.findOne({ user: _id });
    if (!profile) return next(new MyError(404, "No Profile found for the corresponding User ID"));

    const data = {
        firstName: user.firstName,
        lastName: user.lastName,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        zipcode: profile.zipcode,
        phone: profile.phone,
        subscriptionData: {
            subscription: profile.subscription,
            expiryDate: profile.expiryDate
        }
    };

    res.status(200).json({
        status: 200,
        message: 'Profile Data Fetched',
        data
    });

};
