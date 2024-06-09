// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
export default async function handler(req, res) {
  var traverseThroughUsers = req.body.teacher == true
    ? await sql`SELECT * from users WHERE email=${req.body.email} AND org=${req.body.org} AND teacher=true`
    : await sql`SELECT * from users WHERE email=${req.body.email} AND org=${req.body.org}`;
  if (traverseThroughUsers.rows.length == 0) {
    res.status(200).json({ status: "fail" });
  } else {
    bcrypt.compare(
      req.body.password,
      traverseThroughUsers.rows[0].password,
      async function (err, result) {
        if (result == true) {
          var feedREQ =
            await sql`SELECT * from users WHERE email=${req.body.email} AND org=${req.body.org}`;
          var feed = JSON.parse(feedREQ.rows[0].feed);
          feed.push({
            message: "You logged in from a device.",
            timestamp: Date.now(),
          });
          var updateFeedREQ = await sql`UPDATE users SET feed=${JSON.stringify(
            feed
          )} WHERE email=${req.body.email} AND org=${req.body.org}`;
          res.status(200).json({
            status: "success",
            data: traverseThroughUsers.rows[0].uuid,
          });
        } else {
          res.status(200).json({ status: "fail" });
        }
      }
    );
  }
}
