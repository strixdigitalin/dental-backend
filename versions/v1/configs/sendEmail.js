const nodemailer = require("nodemailer");
const { google } = require("googleapis");
require("dotenv").config();

exports.sendEmail = async ({ to, subject, text }) => {
 
  let res;
  const oAuth2Client = new google.auth.OAuth2(
    process.env.CLIENT_ID,
    process.env.CLIENT_SECRET,
    process.env.REDIRECT_URI
  );
  oAuth2Client.setCredentials({ refresh_token: process.env.REFRESH_TOKEN });

  const accessToken = await oAuth2Client.getAccessToken();

  var transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "OAuth2",
      user: process.env.FROM_ADDRESS,
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      refreshToken: process.env.REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  var mailOptions = {
    from: `Dental World <${process.env.FROM_ADDRESS}>`,
    to: to,
    subject: subject,
    text: text,
  };
  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      console.log(error);
      return false
    } else {
      console.log("Email sent: " + info.response);
      return true
    }
  });
};

