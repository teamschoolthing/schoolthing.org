// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";
import {emailName, emailService} from "../../resources/strings";
var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailName,
    pass: process.env.EMAIL_PASSWORD,
  },
});
export default function handler(req, res) {
  var e = sql`SELECT * from users`.then((data) => {
    res.status(200).json({ data: data });
  })
}
