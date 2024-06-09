// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";
var nodemailer = require("nodemailer");
import {emailName, emailService, productName} from "../../../resources/strings";
const transporter = nodemailer.createTransport({
  service: emailService,
  auth: {
    user: emailName,
    pass: process.env.EMAIL_PASSWORD,
  },
});
export default async function handler(req, res) {
  /**
   * @param {string} req.body.useruuid
   */
  var getUserData =
    await sql`SELECT * from users WHERE uuid=${req.body.useruuid}`;
  var userData = getUserData.rows[0];
  console.log(getUserData.rows);
  var getOrgData =
    await sql`SELECT * from organisations WHERE id=${userData.org}`;
  var orgData = getOrgData.rows[0];
  var toReporterMessage = {
    from: {
      name: `${orgData.name} | ${productName} Moderation`,
      address: "noreply@mail.schoolthing.org",
    },
    to: userData.email,
    subject: `${productName} Account Termination`,
    html: `Hey ${userData.fname}, <br /> A teacher, administrator of your Community, or a member of the Schoolthing Moderation Team has terminated your ${productName} account. If you believe this was a mistake, please reply to this email. Thanks, <br />${productName} Moderation`,
  };
  transporter.sendMail(toReporterMessage, async function (error, info) {
    console.log(error, info);
    var deleteUser =
      await sql`DELETE FROM users WHERE uuid=${req.body.useruuid}`;
    res.status(200).json({ data: "success" });
  });
}
