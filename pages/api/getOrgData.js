import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const { rows } =
    await sql`SELECT * from organisations WHERE id=${req.body.org}`;
  res.status(200).json({ data: rows[0] });
}
