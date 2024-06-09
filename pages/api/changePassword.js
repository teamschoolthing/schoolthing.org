// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
export default async function handler(req, res) {
  var traverseThroughUsers =
    await sql`SELECT * from users WHERE uuid=${req.body.useruuid} AND org=${req.body.org}`;
  if (traverseThroughUsers.rows.length == 0) {
    res.status(200).json({ status: "fail-nouser" });
  } else {
    bcrypt.compare(
      req.body.oldpassword,
      traverseThroughUsers.rows[0].password,
      function (err, result) {
        if (result) {
          bcrypt.hash(req.body.newpassword, 10, async function (err, hash) {
            var updatePassword = await sql`UPDATE users SET password=${hash} WHERE uuid=${req.body.useruuid} AND org=${req.body.org}`;
            res.status(200).json({ status: "success" });
          });
        } else {
          res.status(200).json({ status: "fail" });
        }
      }
    );
  }
}