import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
export default async function handler(req, res) {
    var getUserDataREQ =
      await sql`SELECT * from users WHERE uuid=${req.body.useruuid}`;
    var getUserData = getUserDataREQ.rows[0];
    var getLikedNotes = JSON.parse(getUserData.liked);
    if(getLikedNotes.includes(req.body.noteuuid)){
        res.status(200).json({ status: "success" });
    } else {
        getLikedNotes.push(req.body.noteuuid);
        var updateLikedNotesREQ = await sql`UPDATE users SET liked=${JSON.stringify(getLikedNotes)} WHERE uuid=${req.body.useruuid}`;
        var getNoteDataREQ = await sql`SELECT * from notes WHERE uuid=${req.body.noteuuid}`;
        var updateNoteLikedData = await sql`UPDATE notes SET likes=${parseInt(getNoteDataREQ.rows[0].likes) + 1} WHERE uuid=${req.body.noteuuid}`;
        var feedREQ = await sql`SELECT * from users WHERE uuid=${req.body.useruuid}`;
          var feed = JSON.parse(feedREQ.rows[0].feed)
           feed.push(
            {
              message: "You liked the note " + getNoteDataREQ.rows[0].title + "!",
              timestamp: Date.now(),
            },
          );
          var sendAuthorNotification = await SchoolthingPushNotification(
            getNoteDataREQ.rows[0].authoruuid,
            {
              title: `❤️ ${getUserData.fname} liked your note!`,
              body: `${getUserData.fname} liked your note "${getNoteDataREQ.rows[0].title}"`,
              url: `https://schoolthing.org/main`,
            }
          )
          var updateFeedREQ = await sql`UPDATE users SET feed=${JSON.stringify(feed)} WHERE uuid=${req.body.useruuid}`
        res.status(200).json({ status: "success" });
    }
}
