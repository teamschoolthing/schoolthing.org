import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
    /**
     * @param {int} req.body.color
     */
    var updateColorReq = await sql`UPDATE users SET accentcolor=${req.body.color} WHERE uuid=${req.body.uuid}`
    res.status(200).json({ status: "success" });
}