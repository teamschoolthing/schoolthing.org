import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { productName } from "../../../resources/strings";
export default async function handler(req, res) {
  /**
   * @param {string} req.body.useruuid
   * @param {string} req.body.points
   * @param {string} req.body.method
   */
  console.log(req.body.useruuid)
  console.log(req.body.points)
  console.log(req.body.method)
  var userDataREQ =
    await sql`SELECT * FROM users WHERE uuid=${req.body.useruuid}`;
  var userData = userDataREQ.rows[0];

  if (req.body.method == "add") {
    var updatePointsREQ = await sql`UPDATE users SET points=${
      parseInt(userData.points) + parseInt(req.body.points)
    } WHERE uuid=${req.body.useruuid}`;
    var feed = JSON.parse(userData.feed);
    feed.push({
      message: `Your ${productName} Community Teacher has sent you ${req.body.points} points`,
      timestamp: Date.now(),
    });
    var updateFeedREQ = await sql`UPDATE users SET feed=${JSON.stringify(
      feed
    )} WHERE uuid=${req.body.useruuid}`;

    res.status(200).json({ status: "success" });
  } else if (req.body.method == "subtract") {
    var updatePointsREQ = await sql`UPDATE users SET points=${
      parseInt(userData.points) - parseInt(req.body.points)
    } WHERE uuid=${req.body.useruuid}`;
    var feed = JSON.parse(userData.feed);
    feed.push({
      message: `Your ${productName} Community Teacher has sent you -${req.body.points} points`,
      timestamp: Date.now(),
    });
    var updateFeedREQ = await sql`UPDATE users SET feed=${JSON.stringify(
      feed
    )} WHERE uuid=${req.body.useruuid}`;

    res.status(200).json({ status: "success" });
  }
}
