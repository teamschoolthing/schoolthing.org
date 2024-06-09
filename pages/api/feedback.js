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
   * @param {string} req.body.org
   * @param {string} req.body.type
   * @param {string} req.body.message
   * @param {string} req.body.useruuid
   */
  var getUserData =
    await sql`SELECT * from users WHERE uuid=${req.body.useruuid}`;
  var userdata = getUserData.rows[0];
  var getOrgData =
    await sql`SELECT * from organisations WHERE id=${req.body.org}`;
  var orgdata = getOrgData.rows[0];
  var message = {
    from: {
      name: `${productName} Internal`,
      address: "noreply@mail.schoolthing.org",
    },
    to: ["mihir@pidgon.com", "manuadhitya16@gmail.com"],
    subject: `${productName} Feedback`,
    html: `${emailStyle}<h1>Feedback received !</h1><br /> <br /> From <b>${userdata.fname} ${userdata.lname} (${userdata.email})</b> from Community <b>${orgdata.name} </b><br /> <b>Type:</b> ${req.body.type} <br /> <b>Message:</b> ${req.body.message}`,
  };

  transporter.sendMail(message, function (error, info) {
    console.log(error, info);
    res.status(200).json({ data: "success" });
  });
}
