import { sql } from "@vercel/postgres";
var nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailName,
    pass: process.env.EMAIL_PASSWORD,
  },
});
import * as bcrypt from "bcrypt";
import {emailName, emailService, productName, thisURL} from "../../resources/strings";
export default async function handler(req, res) {
  /**
   * @param {string} req.body.uuid
   * @param {string} req.body.password
   */
  var getUserData = await sql`SELECT * from users WHERE uuid=${req.body.uuid}`;
  if (getUserData.rows.length == 0) {
    res
      .status(200)
      .json({ status: "fail", message: "No user found with that email" });
  } else {
    bcrypt.hash(req.body.password, 10, async function (err, hash) {
      var updatePasswordREQ = await sql`UPDATE users SET password=${hash} WHERE uuid=${req.body.uuid}`;
      res.status(200).json({ status: "success" });
    });
  }
}
