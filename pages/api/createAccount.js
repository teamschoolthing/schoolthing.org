// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";
var nodemailer = require("nodemailer");
const webpush = require("web-push");
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
  var doesPassThroughPreverifications =
    req.body.code.trim() == "null" ? true : false;
  if (doesPassThroughPreverifications == false) {
    console.log("detained by code");
    var getLoginCodesREQ =
      await sql`SELECT * from logincodes WHERE code=${req.body.code.trim()} AND org=${
        req.body.org
      }`;
    if (getLoginCodesREQ.rows.length != 0) {
      doesPassThroughPreverifications = true;
      console.log("login code truthy");
    }
  }

  if (doesPassThroughPreverifications) {
    const data = { uuid: uuidv4() };
    var alreadyExistingUsers =
      await sql`SELECT * from users WHERE email=${req.body.email.trim()} AND org=${
        req.body.org
      }`;
    if (alreadyExistingUsers.rows.length == 0) {
      var { rows } =
        await sql`SELECT * from organisations WHERE id=${req.body.org}`;
      bcrypt.hash(req.body.password, 10, async function (err, hash) {
        var feed = JSON.stringify([
          {
            message: `You joined this ${productName} Community!`,
            timestamp: Date.now(),
          },
        ]);
        var notes = JSON.stringify([]);
        var grade = req.body.class.toString();
        var liked = JSON.stringify([]);
        var createUserREQ = await sql`INSERT INTO users VALUES(${data.uuid}, ${
          req.body.org
        }, ${req.body.fname.trim()}, ${req.body.lname.trim()}, ${req.body.email.trim()}, ${hash}, ${grade},false , ${10}, ${feed}, ${notes}, ${liked}, '', ${liked}, false, '[]', 0)`;

        var message = {
          from: {
            name: `The ${productName} Team`,
            address: "noreply@mail.schoolthing.org",
          },
          to: req.body.email.trim(),
          subject: `${productName} Email Verification`,
          html: `${emailStyle}<h2>Hey ${req.body.fname}!</h2><br><p>Welcome to ${productName}!<br />Verify your account by clicking <a href="${thisURL}/verify/?org=${req.body.org}&pidgonglobal=${data.uuid}">this link</a>.</p><p>Thank you!</p><br><br><p>The ${productName} Team</p>`,
        };

        transporter.sendMail(message, function (error, info) {
          console.log(error, info);
          res.status(200).json({ status: "success", data: data.uuid });
        });
      });
    } else {
      res.status(200).json({ status: "fail" });
    }
  } else {
    res.status(200).json({ status: "incorrectCode" });
  }
}
