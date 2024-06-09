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
  var getNoteData = await sql`SELECT * from notes WHERE uuid=${req.query.noteuuid}`;
    var noteData = getNoteData.rows[0];
    var getAuthorData = await sql`SELECT * from users WHERE uuid=${noteData.authoruuid}`;
    var authorData = getAuthorData.rows[0];
    var getReporterData = await sql`SELECT * from users WHERE uuid=${req.query.reporter}`;
    var reporterData = getReporterData.rows[0];
    var removeNote = await sql`DELETE FROM notes WHERE uuid=${req.query.noteuuid}`;
    var removeUser = await sql`DELETE FROM users WHERE uuid=${noteData.authoruuid}`;
  var message = {
    from: {
      name: "Schoolthing Moderation",
      address: "support@pidgon.com",
    },
    to: authorData.email,
    subject: `Schoolthing Account Termination`,
    html: `Hey ${authorData.name},<br><br>We have received multiple reports about your note <b>${noteData.title}</b>, and have removed it. We have also terminated your account, and you will no longer be able to access Schoolthing. If you would like to appeal this report, please reply to this email.<br>Thanks,<br>Schoolthing Moderation`,
  };

  transporter.sendMail(message, function (error, info) {
    console.log(error, info);
  });
  var toReporterMessage = {
    from: {
        name: "Schoolthing Moderation",
        address: "support@pidgon.com"
    },
    to: reporterData.email,
    subject: `Schoolhing Report Results`,
    html: `Hey ${reporterData.fname}, <br /> As a result of your report, we have removed the note <b>${noteData.title}</b>. Furthermore, we have terminated the account of the user who posted it. Thanks for helping us keep Schoolthing safe!<br />Schoolthing Moderation`,
    };
    transporter.sendMail(toReporterMessage, function (error, info) {
        console.log(error, info);
    });

  res.status(200).json({ data: "success" });
}
