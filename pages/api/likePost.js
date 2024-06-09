import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import SchoolthingPushNotification from "../../notifications/pushMessage";
export default async function handler(req, res) {
  /**
   * @param {string} useruuid The uuid of the user
   * @param {string} postuuid The uuid of the post
   * @param {boolean} like Whether the user liked the post
   */
  var postREQ = await sql`SELECT * from posts WHERE uuid=${req.body.postuuid}`;
  var post = postREQ.rows[0];
  var likes = JSON.parse(post.likes);
  if (req.body.like && !likes.includes(req.body.useruuid)) {
    likes.push(req.body.useruuid);
    var getUserData = await sql`SELECT fname FROM users WHERE uuid=${req.body.useruuid}`
  var sendAuthorNotification = await SchoolthingPushNotification(
    post.authoruuid,
    {
      title: `👍 Post liked!`,
      body: `${getUserData.rows[0].fname} liked your post "${post.title}"!`,
      url: `https://schoolthing.org/main?followthrough=post/${post.postuuid}`,
    }
  );
  } else {
    likes.splice(likes.indexOf(req.body.useruuid), 1);
  }
  var updateLikesREQ = await sql`UPDATE posts SET likes=${JSON.stringify(
    likes
  )} WHERE uuid=${req.body.postuuid}`;
  var feedREQ = await sql`SELECT * from users WHERE uuid=${req.body.useruuid}`;
  var feed = JSON.parse(feedREQ.rows[0].feed);
  feed.push({
    message:
      "You " + (req.body.like ? "liked" : "unliked") + ' "' + post.title + '".',
    timestamp: Date.now(),
  });
  
  var updateFeedREQ = await sql`UPDATE users SET feed=${JSON.stringify(
    feed
  )} WHERE uuid=${req.body.useruuid}`;
  res.status(200).json({ status: "success" });
}
