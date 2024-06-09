// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";
const shortid = require("shortid");
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
   * @param {string} req.body.scope
   * @param {string} req.body.data
   * @param {string} req.body.org
   */

  var scope = req.body.scope;
  if (scope == "generateWideScope") {
    //org TEXT, scope TEXT, data TEXT, code TEXT, timestamp TEXT
    const getCode = shortid.generate();
    console.log(getCode, getCode);
    var codeGenerateREQ = await sql`INSERT INTO logincodes VALUES(${
      req.body.org
    }, 'wide', ${req.body.data}, ${getCode}, ${Date.now()})`;
    res.status(200).json({ status: "success", code: getCode });
  } else if (scope == "generateSpecificScope") {
    var codeGenerateREQ = await sql`INSERT INTO logincodes VALUES(${
      req.body.org
    }, 'specific', ${req.body.data}, ${shortid.generate()}, ${Date.now()})`;
    res.status(200).json({ status: "success", code: getCode });
  } else if (scope == "removeCode") {
    var codeRemoveREQ =
      await sql`DELETE FROM logincodes WHERE code=${req.body.data}`;
    res.status(200).json({ status: "success" });
  }
}
