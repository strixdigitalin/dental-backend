const mongoose = require("mongoose");
const MyError = require("../../error/MyError");
const Profile = require("./profile.model");
const Question = require("../question/question.model");
const User = require("../auth/auth.model");
const createHttpError = require("http-errors");
require('dotenv').config();


exports.uploadProfile = async (req, res, next) => {
    const user = await User.findOne({ _id: req.user.id });
    if (!user) return next(new MyError(404, "Invalid User ID"));
    let totalquestions;
    const { address, city, state, country, zipcode, phone, subscription, expiryDate } = req.body;
    totalquestions = await Question.countDocuments({});
    if (totalquestions == 0 || totalquestions != 0) {
        console.log(totalquestions)
        const profile = new Profile({
            user: new mongoose.Types.ObjectId(req.user.id),
            address: address,
            city: city,
            state: state,
            country: country,
            zipcode: zipcode,
            phone: phone,
            subscription: new mongoose.Types.ObjectId(subscription),
            expiryDate: expiryDate,
            total_questions: totalquestions,
            total_Unused: totalquestions
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
    }

};

exports.getProfile = async (req, res, next) => {

    const user = await User.findOne({ _id: req.user.id });
    if (!user) return next(new MyError(404, "Invalid User ID"));
    console.log(user);
    const profile = await Profile.findOne({ user: req.user.id }).select('-questions_details').populate('subscription', '-__v -createdAt -updatedAt');
    if (!profile) return next(new MyError(404, "No Profile found for the corresponding User ID"));

    const data = {
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        email: user.email,
        area_of_practise: user.area_of_practise,
        address: profile.address,
        city: profile.city,
        state: profile.state,
        country: profile.country,
        zipcode: profile.zipcode,
        phone: profile.phone,
        subscriptionData: {
            subscription: profile.subscription,
            expiryDate: profile.expiryDate
        },
        questions_counts: {
            user_total_questions: profile.question_details.length,
            total_questions: profile.total_questions,
            total_Unused: profile.total_Unused,
            total_Incorrect: profile.total_Incorrect,
            total_Marked: profile.total_Marked,
            total_Unanswered: profile.total_Unanswered
        }
    };

    res.status(200).json({
        status: 200,
        message: 'success',
        data
    });

};

exports.GetAllUsers = async (req, res, next) => {
    try {
        const page = req.query.page || 1;
        const limit = req.query.limit * 1 || 50;
        const search = req.query.search || "";
        const findBy = {
            email: { $regex: search, $options: "i" },
        };
        const [profile, count] = await Promise.all([
            User.find(findBy).select('-password -__v')
                .sort({ _id: 1 })
                .skip(limit * (page - 1))
                .limit(limit),
            User.countDocuments(findBy),
        ]);
        // let profiles = profile.map(profile => {
        //     return {
        //         name: profile.user.firstName + " " + profile.user.lastName,
        //         role: profile.user.role,
        //         email: profile.user.email,
        //         area_of_practise: profile.user.area_of_practise,
        //         phone: profile.phone,
        //         subscriptionData: {
        //             _id: profile.subscription._id,
        //             name: profile.subscription.name,
        //             expiryDate: profile.expiryDate
        //         },
        //         createdAt: profile.user.createdAt,
        //     }
        // })
        res.status(200).json({
            status: 200,
            message: 'success',
            count,
            data: profile
        });
    } catch (error) {
        next(error)
    }
}

