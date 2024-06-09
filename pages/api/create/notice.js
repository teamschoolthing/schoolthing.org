import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
export default async function handler(req, res) {
    var getOrgAccessToken = await sql`SELECT * from secrets WHERE org=${req.body.org}`;
    var orgAccessSecret = getOrgAccessToken.rows[0].secret;
    var getUserDataREQ = await sql`SELECT * from users WHERE uuid=${req.body.useruuid}`;
    var isTeacher = getUserDataREQ.rows[0].teacher;
      if (req.body.password == orgAccessSecret || isTeacher) {
        var traverseThroughExistingNotices =
          await sql`SELECT * from notices WHERE org=${req.body.org} AND broadcast=${req.body.broadcast}`;
        if (traverseThroughExistingNotices.rows.length != 0) {
          await sql`DELETE FROM notices WHERE org=${req.body.org} AND broadcast=${req.body.broadcast}`;
        }
        var createNoticeRequest = await sql`INSERT INTO notices VALUES(${
          req.body.org
        }, ${req.body.broadcast}, ${req.body.title}, ${Date.now()}, ${
          req.body.content
        })`;
        res.status(200).json({ status: "success" });
      } else {
        res.status(200).json({ status: "fail" });
      }
}
