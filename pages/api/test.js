import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
    var data = await sql`SELECT * from users`
 res.status(200).json({ data: data.rows }); 
}