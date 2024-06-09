import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
export default async function handler(req, res) {
    var getUserDataREQ =
      await sql`SELECT * from users WHERE uuid=${req.body.uuid} AND org=${req.body.org}`;
    var getUserData = getUserDataREQ.rows[0];
    var getNoteDataREQ =
      await sql`SELECT * from notes WHERE uuid=${req.body.noteuuid} AND org=${req.body.org}`;
    var getNoteData = getNoteDataREQ.rows[0];
    var currentNoteData = JSON.parse(getUserData.notes);
    var compiledNotes = [];
    currentNoteData.forEach((note) => {
      compiledNotes.push(note.uuid);
    });
    if (compiledNotes.includes(req.body.noteuuid)) {
      res.status(200).json({ status: "has" });
    } else {
      if (getUserData.points >= getNoteData.points) {
        var updateNoteDataREQ = await sql`UPDATE notes SET purchases=${
          getNoteData.purchases + 1
        } WHERE uuid=${req.body.noteuuid} AND org=${req.body.org}`;
        var updateUserPointsREQ = await sql`UPDATE users SET points=${
          getUserData.points - getNoteData.points
        } WHERE uuid=${req.body.uuid} AND org=${req.body.org}`;
        currentNoteData.push({ uuid: req.body.noteuuid, intent: "purchased" });
        var addNoteToUserListREQ =
          await sql`UPDATE users SET notes=${JSON.stringify(
            currentNoteData
          )} WHERE uuid=${req.body.uuid} AND org=${req.body.org}`;

        var feedREQ =
          await sql`SELECT * from users WHERE uuid=${req.body.uuid} AND org=${req.body.org}`;
        var feed = JSON.parse(feedREQ.rows[0].feed);
        feed.push({
          message: "You bought the note " + getNoteData.title + ".",
          timestamp: Date.now(),
        });
        var sendAuthorNotification = await SchoolthingPushNotification(
          getNoteData.authoruuid,
          {
            title: "💰 Note Sold 💰",
            body: `${getUserData.fname} just bought your note "${getNoteData.title}"!`,
            url: `https://schoolthing.org/main`,
          }
        )
        var updateFeedREQ = await sql`UPDATE users SET feed=${JSON.stringify(
          feed
        )} WHERE uuid=${req.body.uuid} AND org=${req.body.org}`;

        var authorFeedREQ =
          await sql`SELECT * from users WHERE uuid=${getNoteData.authoruuid} AND org=${req.body.org}`;
        var authorFeed = JSON.parse(authorFeedREQ.rows[0].feed);
        authorFeed.push({
          message:
            getUserData.fname + " bought your note " + getNoteData.title + ".",
          timestamp: Date.now(),
        });
        var updateAuthorFeedREQ =
          await sql`UPDATE users SET feed=${JSON.stringify(
            authorFeed
          )} WHERE uuid=${getNoteData.authoruuid} AND org=${req.body.org}`;

        res.status(200).json({ status: "success", points: getNoteData.points });
      } else {
        res.status(200).json({ status: "fail" });
      }
    }
}
