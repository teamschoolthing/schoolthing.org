import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
export default async function handler(req, res) {
  const uuid = uuidv4();
  var noteResponse =
    await sql`INSERT into notes VALUES(${req.body.org},${req.body.authoruuid}, ${req.body.privateuuid},${req.body.uuid}, ${req.body.fname}, ${req.body.class}, ${req.body.title}, ${req.body.content}, 0, 0, ${req.body.imgs}, ${req.body.isTeacher ? 0 : req.body.points}, ${req.body.subject}, ${req.body.isTeacher})`;
  var authorCurrentNotesREQUEST =
    await sql`SELECT notes from users WHERE uuid=${req.body.authoruuid}`;
  var authorCurrentNotes = JSON.parse(authorCurrentNotesREQUEST.rows[0].notes);
  authorCurrentNotes.push({ uuid: req.body.uuid, intent: "written" });
  var updateAuthorNotes = await sql`UPDATE users SET notes=${JSON.stringify(
    authorCurrentNotes
  )} WHERE uuid=${req.body.authoruuid}`;
  var getAuthorStorage = await sql`SELECT storage from users WHERE uuid=${req.body.authoruuid}`;
  var updateAuthorStorage = await sql`UPDATE users SET storage=${
    getAuthorStorage.rows[0].storage + parseFloat(req.body.storage)
  } WHERE uuid=${req.body.authoruuid}`;
  var feedREQ =
    await sql`SELECT * from users WHERE uuid=${req.body.authoruuid} AND org=${req.body.org}`;
  var feed = JSON.parse(feedREQ.rows[0].feed);
  feed.push({
    message: "You created the note " + req.body.title + ".",
    timestamp: Date.now(),
  });
  var updateFeedREQ = await sql`UPDATE users SET feed=${JSON.stringify(
    feed
  )} WHERE uuid=${req.body.authoruuid} AND org=${req.body.org}`;

  res.status(200).json({ status: "success" });
}
