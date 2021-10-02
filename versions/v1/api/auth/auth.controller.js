const User = require("./auth.model");
const MyError = require("../../error/MyError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const sendMail = require("../../configs/sendEmail");

require("dotenv").config();

const tokenRes = {};

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) return next(new MyError(400, "User doesn't exist"));
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return next(new MyError(400, "Incorrect Password"));

    // jwt
    tokenRes.access_token = generateAccessToken(user);

    // response
    res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        area_of_practise: user.area_of_practise,
        resetLink: user.resetLink,
      },
      tokenRes,
    });
  } catch (error) {
    next(error);
  }
};

exports.signInAdmin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user);
    if (!user) return next(new MyError(400, "User doesn't exist"));
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if(user.role != 'Admin'){
      return next(new MyError(400, "You are Not Authorized User"));
    }
    if (!isPasswordCorrect) return next(new MyError(400, "Incorrect Password"));

    // jwt
    tokenRes.access_token = generateAccessToken(user);

    // response
    res.status(200).json({
      status: "success",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        resetLink: user.resetLink,
      },
      tokenRes,
    });
  } catch (error) {
    next(error);
  }
};

exports.signUp = async (req, res, next) => {
  const { firstName, lastName, email, password, area_of_practise } = req.body;

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) return res.status(400).json("User already exists");
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      area_of_practise,
    });


    // response
    res.status(201).json({
      status: "success",
      data: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        area_of_practise: user.area_of_practise,
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    console.log(user)
    if (!user) return next(new MyError(400, "User doesn't exist"));
    
    const resetToken = jwt.sign({ _id: user._id }, process.env.RESET_PASS_KEY, { expiresIn: '20m' });
    
    // sent reset url through email
    const resetUrl = `http://localhost:8000/api/v1/auth/resetPassword/${resetToken}`;

    //set resetLink val in db
    const filter = { _id: user._id };
    const update = { resetLink: resetToken };
    const updatedResetLink = await User.findByIdAndUpdate(filter, update);
    const mailRes = sendMail(email,"Password Reset Link | DWorld",`Open this link to reset your password 👉 ${resetUrl}`,`Click <a href=${resetUrl}>here</a> to Reset Your Password`);
    if (mailRes) res.status(200).json({ status: "ok", message:"Link has been sent to your email", resetUrl, resetToken });
    else { res.status(500).json({ status: "failed", message: "error occured while sending mail" }) };
  } catch (error) {
    console.log(error)
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  console.log(resetToken);
  console.log(hashedPassword);

  if (!resetToken) {
    return res.status(404).json({ status: "failed", message: "no token passed" });
  }

  try {
    //verifying token
    jwt.verify(resetToken, process.env.RESET_PASS_KEY, function (err, decodedRes) {
      if (err) {
        return res.status(401).json({ status: "failed", message: "Invalid or Expired Token" });
      }
      const filter = { resetLink: resetToken };
      const update = { password: hashedPassword };
      User.findOneAndUpdate(filter, update)
        .then(user => {
          res.send(user);
        })
        .catch(err => { next(err); });
    });
  }
  catch (error) {
    next(error);
  }
};

function generateAccessToken(user) {
  return jwt.sign(
    { email: user.email, id: user._id },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "365d",
    }
  );
}

exports.changeName = async (req, res, next) => {
  const _id = req.params.id;
  const { firstName, lastName } = req.body;
  try {
    const update = { firstName: firstName, lastName: lastName };
    User.findByIdAndUpdate(_id, update)
    .then(user => {
      res.status(200).json({ status: 'success', message: 'Name Updated', data : {updatedFirstName : firstName, updatedLastName : lastName} });
    })
    .catch(err => {
        res.status(401).json({ status: 'failed', message: 'invalid user id' });
    })
  } catch (err) {
    next(err);
  }
}

exports.changePassword = async function (req, res, next) {
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  const _id = req.params.id;
  const user = await User.findOne({ _id });
  if (!user) return next(new MyError(400, "User doesn't exist"));
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) return next(new MyError(400, "Incorrect Password"));
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  const update = { password: hashedNewPassword };
  User.findByIdAndUpdate(_id, update)
    .then(user => {
      res.status(200).json({ status: 'success', message: 'Password updated for ' + user.firstName + ' ' + user.lastName });
    })
    .catch(err => res.status(401).json({ status: 'failed', message: 'an error occured while updating', error: err }));
}
