const User = require("./auth.model");
const MyError = require("../../error/MyError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const { sendEmail } = require("../../configs/sendEmail");

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
    tokenRes.refresh_token = generateRefreshToken(user);

    // response
    res.status(200).json({
      status: "ok",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        area_of_practise: user.area_of_practise,
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

    // jwt
    tokenRes.access_token = generateAccessToken(user);
    tokenRes.refresh_token = generateRefreshToken(user);

    // response
    res.status(201).json({
      status: "ok",
      user: {
        _id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        area_of_practise: user.area_of_practise,
      },
      tokenRes,
    });
  } catch (error) {
    next(error);
  }
};

exports.refreshToken = async (req, res, next) => {
  const { refreshToken } = req.body;
  try {
    if (!refreshToken) return next(new MyError(400, "no refreshToken"));
    jwt.verify(refreshToken, process.env.REFRESH_SECRET, (err, user) => {
      if (err) return next(new MyError(400, "invalid refresh token"));
      const access_token = generateAccessToken(user);
      res.status(200).json({
        status: "ok",
        access_token,
      });
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
    const resetToken = crypto.randomBytes(20).toString("hex");
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");
    const resetPasswordExpire = Date.now() + 10 * (60 * 1000); // Ten Minutes
    await User.findOneAndUpdate(
      { email },
      {
        resetPasswordToken,
        resetPasswordExpire,
      },
      { upsert: true }
    );

    // sent reset url through email
    const resetUrl = `http://localhost:3000/passwordReset/${resetToken}`;

    await sendEmail({
      to: email,
      subject: "password reset url",
      text: `click here to reset your password 👉 ${resetUrl}`,
    });

    res.status(200).json({ status: "ok", resetToken });
  } catch (error) {
    console.log(error)
    next(error);
  }
};

exports.resetPassword = async (req, res, next) => {
  const { resetToken } = req.params;
  const { password } = req.body;

  console.log(req.params, req.body);

  try {
    // hash the resetToken
    const resetPasswordToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // check whether HashedResetToken exist in the db and also checks the expiry
    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });
    if (!user) return next(new MyError(400, "Invalid Token"));

    const hashedPassword = await bcrypt.hash(password, 12);

    // updates password
    const updatedUser = await User.findByIdAndUpdate(user._id, {
      $set: { password: hashedPassword },
      $unset: { resetPasswordToken: "", resetPasswordExpire: "" },
    });

    console.log("updated user", updatedUser);

    // sign the token
    tokenRes.access_token = generateAccessToken(user);
    tokenRes.refresh_token = generateRefreshToken(user);

    res.status(200).json({
      status: "ok",
      token,
      message: "password updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

function generateAccessToken(user) {
  return jwt.sign(
    { email: user.email, id: user._id },
    process.env.ACCESS_SECRET,
    {
      expiresIn: "1d",
    }
  );
}

function generateRefreshToken(user) {
  return jwt.sign(
    { email: user.email, id: user._id },
    process.env.REFRESH_SECRET,
    {
      expiresIn: "30d",
    }
  );
}





