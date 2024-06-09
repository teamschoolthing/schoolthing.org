// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";
import { v4 as uuidv4} from "uuid";
import SchoolthingPushNotification from "../../notifications/pushMessage";
export default async function handler(req, res) {
  /**
   * @param {string} useruuid The uuid of the user
   * @param {string} username The username of the author
   * @param {string} org The organisation of the author
   * @param {string} postuuid The origional post uuid
   * @param {string} content The content of the message
   */
  var getPostREQ = await sql`SELECT * FROM posts WHERE uuid=${req.body.postuuid}`;
    var post = getPostREQ.rows[0];
    var replies = JSON.parse(post.replies);
    replies.push({
        uuid: uuidv4(),
        authoruuid: req.body.useruuid,
        username: req.body.username,
        org: req.body.org,
        content: req.body.content,
        timestamp: Date.now(),
        likes: 0,
        email: req.body.email,
    });
    var updatePostREQ = await sql`UPDATE posts SET replies=${JSON.stringify(replies)} WHERE uuid=${req.body.postuuid}`;
    var feedREQ = await sql`SELECT * from users WHERE uuid=${req.body.useruuid}`;
    var feed = JSON.parse(feedREQ.rows[0].feed);
    feed.push({
        message: "You replied to \"" + post.title + "\" with \"" + req.body.content + "\".",
        timestamp: Date.now(),
    });
    var sendAuthorNotification = await SchoolthingPushNotification(
        post.authoruuid,
        {
            title: `💬 ${req.body.username} replied to "${post.title}":`,
            body: `"${req.body.content}"`,
            url: `https://schoolthing.org/main?followthrough=post/${post.postuuid}`,
        }
    );
    var updateFeedREQ = await sql`UPDATE users SET feed=${JSON.stringify(feed)} WHERE uuid=${req.body.useruuid} AND org=${req.body.org}`;
    res.status(200).json({ status: "success" });
}