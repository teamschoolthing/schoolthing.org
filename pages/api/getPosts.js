// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const { rows } = await sql`SELECT * from posts`;
  res.status(200).json({ posts: rows });

}
