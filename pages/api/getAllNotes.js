import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
    const { rows } = await sql`SELECT * from notes WHERE org=${req.body.org}`;
    res.status(200).json({ notes: rows });
}