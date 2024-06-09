// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";
import {emailName, emailService} from "../../../resources/strings";
var nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailName,
    pass: process.env.EMAIL_PASSWORD,
  },
});
export default async function handler(req, res) {
    var getReporterData = await sql`SELECT * from users WHERE uuid=${req.query.reporter}`;
    var reporterData = getReporterData.rows[0];
  var toReporterMessage = {
    from: {
        name: "Schoolthing Moderation",
        address: "support@pidgon.com"
    },
    to: reporterData.email,
    subject: `Schoolhing Report Result`,
    html: `Hey ${reporterData.fname}, <br />After reviewing your report, we have decided to take no action. If you would like us to review the report again, please reply to this email. Thanks for helping us keep Schoolthing safe!<br />Schoolthing Moderation`,
    };
    transporter.sendMail(toReporterMessage, function (error, info) {
        console.log(error, info);
    });

  res.status(200).json({ data: "success" });
}
