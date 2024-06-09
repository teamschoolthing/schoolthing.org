import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
    const { rows } =
      await sql`SELECT * from notes WHERE subject=${req.body.subject} AND org=${req.body.org}`;
    const userDataRequest =
      await sql`SELECT * from users WHERE uuid=${req.body.useruuid} AND org=${req.body.org}`;
    var userData = userDataRequest.rows[0];
    var data = [];
    rows.forEach((item, index) => {
      data.push({ id: item.id, name: item.name });
    });
    res.status(200).json({ notes: rows, points: userData.points });
}
