import { sql } from "@vercel/postgres";
var nodemailer = require("nodemailer");
import {emailName, emailService, emailStyle, productName, thisURL} from "../../resources/strings";
const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailName,
    pass: process.env.EMAIL_PASSWORD,
  },
});
export default async function handler(req, res) {
  /**
   * @param {string} req.body.org
   * @param {string} req.body.email
   */
  var getUserData =
    await sql`SELECT * from users WHERE email=${req.body.email} AND org=${req.body.org}`;
  if (getUserData.rows.length == 0) {
    res
      .status(200)
      .json({ status: "fail", message: "No user found with that email" });
  } else {
    var message = {
      from: {
        name: `The ${productName} Team`,
        address: "noreply@mail.schoolthing.org",
      },
      to: req.body.email,
      subject: `${productName} Password Reset`,
      html: `
            ${emailStyle}
            <h1>Reset your ${productName} password</h1>
            <p>Hi there! We received a request to reset your ${productName} password. If you didn't make this request, you can ignore this email.</p>
            <p>Otherwise, click the button below to reset your password.</p>
            <a href="${thisURL}/reset/${getUserData.rows[0].uuid}"><button>Reset Password</button></a>`,
    };

    transporter.sendMail(message, function (error, info) {
      console.log(error, info);
      res.status(200).json({ data: "success" });
    });
  }
}
