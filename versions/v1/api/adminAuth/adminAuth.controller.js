const Admin = require("./adminAuth.model");
const MyError = require("../../error/MyError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { sendEmail } = require("../../configs/sendEmail");
const { text } = require("express");
const { verifyToken, AdminVerifyToken } = require("../../middlewares/auth");
require("dotenv").config();

const tokenRes = {};

exports.signIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email });
    console.log(user);
    if (!user) return next(new MyError(400, "User doesn't exist"));
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return next(new MyError(400, "Incorrect Password"));

    // jwt
    tokenRes.access_token = generateAccessToken(user);

    // response
    res.status(200).json({
      success: true,
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email,
          resetLinkToken: user.resetLinkToken,
        },
        tokenRes
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.signUp = async (req, res, next) => {
  const { name, email, password } = req.body;

  try {
    const oldUser = await Admin.findOne({ email });
    if (oldUser) return next(new MyError(409, "User Already Exist"));
    const hashedPassword = await bcrypt.hash(password, 12);
    const user = await Admin.create({
      name,
      email,
      password: hashedPassword
    });


    // response
    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    next(error);
  }
};

exports.forgotPassword = async (req, res, next) => {
  const { email } = req.body;

  try {
    const user = await Admin.findOne({ email });
    console.log(user)
    if (!user) return next(new MyError(400, "User doesn't exist"));

    const resetToken = jwt.sign({ _id: user._id }, process.env.RESET_PASS_KEY, { expiresIn: '5m' });

    // sent reset url through email
    const resetUrl = `http://localhost:3000/passwordReset/${resetToken}`;

    //set resetLink val in db
    const filter = { _id: user._id };
    const update = { resetLinkToken: resetToken };
    await Admin.findByIdAndUpdate(filter, update);
    await sendEmail(
      { to : email,
        subject : "Password Reset Link | DWorld",
        text :   `Click here to reset your password 👉 ${resetUrl}`,
      });
    res.status(200).json({ success: true, data: { message: "Link has been sent to your email", resetUrl, resetToken } });
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
    next(new MyError(404, "Reset Token Not Found"))
  }

  try {
    //verifying token
    jwt.verify(resetToken, process.env.RESET_PASS_KEY, function (err, decodedRes) {
      if (err) {
        next(new MyError(404, "User doesn't exist"))
      }
      const filter = { resetLinkToken: resetToken };
      const update = { password: hashedPassword };
      Admin.findOneAndUpdate(filter, update)
        .then(user => {
          res.status(200).json({
            success: true,
            data: user
          })
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
  const { name } = req.body;
  try {
    const update = { name: name };
    Admin.findByIdAndUpdate(_id, update)
      .then(user => {
        res.status(200).json({ success: true, data: { updatedFirstName: firstName, updatedLastName: lastName } });
      })
      .catch(err => {
        next(err)
      })
  } catch (err) {
    next(err);
  }
}

exports.changePassword = async function (req, res, next) {
  const password = req.body.password;
  const newPassword = req.body.newPassword;
  const _id = req.params.id;
  const user = await Admin.findOne({ _id });
  if (!user) return next(new MyError(404, "User doesn't exist"));
  const isPasswordCorrect = await bcrypt.compare(password, user.password);
  if (!isPasswordCorrect) return next(new MyError(401, "Incorrect Password"));
  const hashedNewPassword = await bcrypt.hash(newPassword, 12);
  const update = { password: hashedNewPassword };
  Admin.findByIdAndUpdate(_id, update)
    .then(user => {
      res.status(200).json({ success: true, data: { message: 'Password updated for ' + user.name } });
    })
    .catch(err => next(err));
}
