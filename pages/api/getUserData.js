import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
    /**
     * @param {string} req.body.uuid
     */
    var getUserInDB = await sql`SELECT fname, lname, org, points, class, bio, email from users WHERE uuid=${req.body.uuid}`
    if(getUserInDB.rows.length > 0 ) {
        res.status(200).json({ status: "success", data: getUserInDB.rows[0] });
    } else {
        res.status(404).json({ status: "fail", message: "nouser" });
    }
}