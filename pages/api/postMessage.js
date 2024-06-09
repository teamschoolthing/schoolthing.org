// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import SchoolthingPushNotification from "../../notifications/pushMessage";
export default async function handler(req, res) {
  /**
   * @param {string} title The title of the message
   * @param {string} content The content of the message
   * @param {string} authoruuid The uuid of the author
   * @param {string} org The organisation of the author
   * @param {string} content The content of the message
   * @param {string} username The username of the author
   */
  //server-generated params
  /**
   * @param {string} uuid The uuid of the message
   * @param {string} timestamp The timestamp of the message
   * @param {string} likes The likes of the message
   * @param {string} replies The replies of the message
   */
  var setPostREQ = await sql`INSERT INTO posts VALUES(${
    req.body.org
  }, ${uuidv4()}, ${req.body.authoruuid}, ${req.body.username}, ${
    req.body.title
  }, ${req.body.content}, ${Date.now()}, ${JSON.stringify(
    []
  )}, ${JSON.stringify([])}, ${req.body.email})`;
  var feedREQ =
    await sql`SELECT * from users WHERE uuid=${req.body.authoruuid}`;
  var feed = JSON.parse(feedREQ.rows[0].feed);
  feed.push({
    message: 'You posted "' + req.body.title + '".',
    timestamp: Date.now(),
  });
  var updateFeedREQ = await sql`UPDATE users SET feed=${JSON.stringify(
    feed
  )} WHERE uuid=${req.body.authoruuid} AND org=${req.body.org}`;
  res.status(200).json({ status: "success" });
  //get random uuid
  var randomUser =
    await sql`SELECT vapid from users WHERE org=${req.body.org} AND vapid != '[]'`;
  var maxUsersToSend = randomUser.rows.length >= 3 ? 3 : randomUser.rows.length;
  for (var i = 0; i < maxUsersToSend; i++) {
    var sendRandomUserNotification = await SchoolthingPushNotification(
      randomUser.rows[i].vapid,
      {
        title: `New post from ${req.body.username}!`,
        body: `You might be interested in "${req.body.title}"`,
        url: `http://schoolthing.org/main?followthrough=post/${req.body.authoruuid}`,
      }
    );
  }
}
