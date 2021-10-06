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
    if(totalquestions == 0 || totalquestions != 0){
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
            total_questions : totalquestions,
            total_Unused : totalquestions
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
    const profile = await Profile.findOne({ user: req.user.id }).select('-questions_details').populate('subscription','-__v -createdAt -updatedAt');
    if (!profile) return next(new MyError(404, "No Profile found for the corresponding User ID"));

    const data = {
        firstName: user.firstName,
        lastName: user.lastName,
        role : user.role,
        email : user.email,
        area_of_practise : user.area_of_practise,
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
        questions_counts : {
            user_total_questions : profile.question_details.length,
            total_questions : profile.total_questions,
            total_Unused : profile.total_Unused,
            total_Incorrect : profile.total_Incorrect,
            total_Marked : profile.total_Marked,
            total_Unanswered : profile.total_Unanswered
        }
    };

    res.status(200).json({
        status: 200,
        message: 'success',
        data
    });

};

exports.GetAllUsers = async (req,res,next) => {
    try {
        const profile = await Profile.find().select('-questions_details -address -city -country -zipcode -state').populate('subscription user','-__v -password  -updatedAt');
        let profiles = profile.map(profile =>{
            return {
                name: profile.user.firstName + " " + profile.user.lastName,
                role : profile.user.role,
                email : profile.user.email,
                area_of_practise : profile.user.area_of_practise,
                phone: profile.phone,
                subscriptionData: {
                    _id : profile.subscription._id,
                    name: profile.subscription.name,
                    expiryDate: profile.expiryDate
                },
                createdAt : profile.user.createdAt,
            }
        }) 

        res.status(200).json({
            status: 200,
            message: 'success',
            data : profiles
        });
    } catch (error) {
        next(error)
    }
}


exports.addQuestions = async (req, res, next) => {
    try {
        let questions_details = {
          question: req.body.questionId,
          isUnanswered: req.body.isUnanswered,
          isMarked: req.body.isMarked,
          isIncorrect: req.body.isIncorrect,
          isCorrect: req.body.isCorrect
        }
        if(req.body.isMarked == true && req.body.isUnanswered == true){
         await Profile.updateOne({ user : req.user.id}, { $inc: { total_Unanswered: 1 } });
         await Profile.updateOne({ user : req.user.id}, { $inc: { total_Marked: 1 } });
         await Profile.updateOne({ user : req.user.id}, { $inc: { total_Unused: -1 }});
        }
        else if(req.body.isMarked != true && req.body.isUnanswered == true){
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Unanswered: 1 } });
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Unused: -1 }});
        }
        else if(req.body.isMarked == true && req.body.isIncorrect == true){
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Incorrect: 1 } });
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Marked: 1 } });
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Unused: -1 }});
        }
        else if(req.body.isMarked != true && req.body.isIncorrect == true){
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Incorrect: 1 } });
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Unused: -1 }});
        }
        else if(req.body.isMarked == true && req.body.isCorrect == true){
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Correct: 1 } });
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Marked: 1 } });
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Unused: -1 }});
        }
        else if(req.body.isMarked != true && req.body.isCorrect == true){
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Correct: 1 } });
            await Profile.updateOne({ user : req.user.id}, { $inc: { total_Unused: -1 }});
        }
       
        const profile = await Profile.findOne({user : req.user.id});
        console.log(profile)
        if (!profile) {
          next(createHttpError.NotFound('No Profile'))
        }
        console.log(profile.question_details)
        profile.question_details.push(questions_details);
        let questionpush = await profile.save();
        res.status(200).json({
          message: "success",
          data: questionpush
        })
      } catch (error) {
        next(error);
      }

};
