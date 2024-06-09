import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
    var { rows } = await sql`SELECT * from notes WHERE uuid=${req.body.uuid}`;
    if(rows.length == 0) {
        res.status(200).json({ status: "fail", message: "No note found with that UUID" });
    } else {
        res.status(200).json({ status: "success", note: rows[0] });
    }
}