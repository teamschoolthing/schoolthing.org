import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
    /**
     * @param {string} useruuid
     */
    var updateFeedUserUUID = req.body.useruuid;
    var getUserFeedData = await sql`SELECT feed from users WHERE uuid=${updateFeedUserUUID}`;
    var feed = JSON.parse(getUserFeedData.rows[0].feed);
    var firstMessage = feed[0]
    feed.reverse()
    feed.splice(1, 40)
    feed.reverse()
    feed.push(firstMessage)
    var updateFeed = await sql`UPDATE users SET feed=${JSON.stringify(feed)} WHERE uuid=${updateFeedUserUUID}`
    res.status(200).json({ status: "success" });
}