import { sql } from "@vercel/postgres";
export default async function handler(req, res) {
    /**
     * @param {string} req.body.useruuid
     * @param {string} req.body.noteuuid
     */
    var getUserData = await sql`SELECT * from users WHERE uuid=${req.body.useruuid}`;
    var userdata = getUserData.rows[0];
    var notes = JSON.parse(userdata.notes);
    for(var i in notes) {
        if(notes[i].intent == req.body.noteuuid) {
            notes.splice(i, 1);
        }
    }
    var updateNotes = await sql`UPDATE users SET notes=${JSON.stringify(notes)} WHERE uuid=${req.body.useruuid}`;
    var deleteNoteData = await sql`DELETE FROM notes WHERE uuid=${req.body.noteuuid}`;
    res.status(200).json({ status: "success" });
}

