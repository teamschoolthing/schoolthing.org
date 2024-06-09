import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  /**
   * @param {uuid} req.body.uuid
   */
  var { rows } = await sql`SELECT * from users WHERE uuid=${req.body.uuid}`;
  if (rows.length > 0) {
    var updateUserNotifsREQ =
      await sql`UPDATE users SET vapid='[]' WHERE uuid=${req.body.uuid}`;
    res.status(200).json({ data: "success" });
  } else {
    res.status(200).json({ data: "fail" });
  }
}
