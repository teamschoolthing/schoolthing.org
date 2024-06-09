// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
export default async function handler(req, res) {
    /**
     * @param {string} req.body.uuid
     */
  var traverseThroughUsers =
    await sql`SELECT * from users WHERE uuid=${req.body.uuid}`;
  if (traverseThroughUsers.rows.length == 0) {
    res.status(200).json({ status: "fail-nouser" });
  } else {
    //clear user feed
    var updateFeed = await sql`UPDATE users SET feed=${JSON.stringify([])} WHERE uuid=${req.body.uuid}`;
    res.status(200).json({ status: "success" });
  }
}
