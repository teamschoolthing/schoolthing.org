// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
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
  var getNoteData =
    await sql`SELECT * from notes WHERE uuid=${req.body.noteuuid}`;
  var noteData = getNoteData.rows[0];
  var getModerators =
    await sql`SELECT * from internaldata WHERE key='moderators'`;
  var moderatorEmails = JSON.parse(getModerators.rows[0].value);
  var getAuthorData =
    await sql`SELECT * from users WHERE uuid=${noteData.authoruuid}`;
  var authorData = getAuthorData.rows[0];
  var getReporterData =
    await sql`SELECT * from users WHERE uuid=${req.body.useruuid}`;
  var reporterData = getReporterData.rows[0];
  var getNoteImages = [];
  for (var i = 0; i < noteData.imgs; i++) {
    getNoteImages.push(
      `<a href="https://ik.imagekit.io/schoolthing/imgs/${req.body.org}/${noteData.privateuuid}/${i}.png">Image ${i}</a>`
    );
  }
  var prettifiedNoteData = [];
  for (var key in noteData) {
    prettifiedNoteData.push(`<b>${key}</b>: ${noteData[key]}`);
  }
  var prettifiedAuthorData = [];
  for (var key in authorData) {
    if (key == "password") {
      prettifiedAuthorData.push(`<b>${key}</b>: [Redacted]`);
    } else if (key == "feed") {
      prettifiedAuthorData.push(
        `<b>Feed</b>: Object is too large. Please query the feed from the database.`
      );
    } else {
      prettifiedAuthorData.push(`<b>${key}</b>: ${authorData[key]}`);
    }
  }
  var prettifiedReporterData = [];
  for (var key in reporterData) {
    if (key == "password") {
      prettifiedReporterData.push(`<b>${key}</b>: [Redacted]`);
    } else if (key == "feed") {
      prettifiedReporterData.push(
        `<b>Feed</b>: Object is too large. Please query the feed from the database.`
      );
    } else {
      prettifiedReporterData.push(`<b>${key}</b>: ${reporterData[key]}`);
    }
  }
  var message = {
    from: {
      name: `${productName} Internal`,
      address: "noreply@mail.schoolthing.org",
    },
    to: moderatorEmails,
    subject: `${productName} Report | ${req.body.org}`,
    html: `${emailStyle}
    ${productName} report has been received for the note <b>${
      noteData.title
    }</b>. All data is displayed below.<br /><h2>Note data: </h2> ${prettifiedNoteData.join(
      "<br />"
    )}<br /><h2>Author data: </h2> ${prettifiedAuthorData.join(
      "<br />"
    )}<br /><h2>Reported by: </h2> ${prettifiedReporterData.join(
      "<br />"
    )}<br /><h2>Images: </h2> <br />${getNoteImages.join(
      "<br />"
    )}<br /><br /><h2>Actions: </h2><a href="${thisURL}/api/admin/removeNote?noteuuid=${
      noteData.uuid
    }&reporter=${
      reporterData.uuid
    }">Remove note</a><br /><a href="${thisURL}/api/admin/removeUserAndNote?noteuuid=${
      noteData.uuid
    }&reporter=${
      reporterData.uuid
    }">Remove author and note</a><br /><a href="${thisURL}/api/admin/notifyUser?reporter=${
      reporterData.uuid
    }">Notify reporter that no action has to be taken</a>`,
  };
  transporter.sendMail(message, function (error, info) {
    res.status(200).json({ error: error, info: info });
  });
}
