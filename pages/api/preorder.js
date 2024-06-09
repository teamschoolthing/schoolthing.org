import { sql } from "@vercel/postgres";
var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailName,
    pass: process.env.EMAIL_PASSWORD,
  },
});
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import {emailName, emailService, emailStyle, productName, thisURL} from "../../resources/strings";
export default async function handler(req, res) {
  /**
   * @param {string} req.body.name
   * @param {string} req.body.institution
   * @param {string} req.body.role
   * @param {string} req.body.email
   */
  var message = {
    from: {
      name: `${productName} Internal`,
      address: "noreply@mail.schoolthing.org",
    },
    to: ["mihir@pidgon.com", "manuadhitya16@gmail.com"],
    subject: `${productName} Pre-Order Request`,
    html: `${emailStyle}<h1>Pre-order request!</h1><br />Name: <b>${req.body.name}</b><br />Institution: <b>${req.body.institution}</b><br />Role: <b>${req.body.role}</b><br />Email: <b>${req.body.email}</b> LFGGGG!!`,
  };

  transporter.sendMail(message, function (error, info) {
    console.log(error, info);
    res.status(200).json({ data: "success" });
  });
}
