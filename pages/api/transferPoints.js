import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import SchoolthingPushNotification from "../../notifications/pushMessage";
export default async function handler(req, res) {
  const points = parseInt(req.body.points);
  if (isNaN(points) || points <= 0) {
    res.status(200).json({ status: "fail-notNaN" });
  } else {
    var getTargetUser =
      await sql`SELECT * from users WHERE email=${req.body.toemail} AND org=${req.body.org}`;
    var getSenderUser =
      await sql`SELECT * from users WHERE uuid=${req.body.uuid}`;
    if (getTargetUser.rows.length == 0) {
      res.status(200).json({ status: "fail-500" });
    } else if (req.body.uuid == getTargetUser.rows[0].uuid) {
      res.status(200).json({ status: "fail-sameuser" });
    } else {
      if (getSenderUser.rows[0].points >= points) {
        var newPoints = getSenderUser.rows[0].points - points;
        var newTargetPoints =
          parseInt(getTargetUser.rows[0].points) + parseInt(points);
        var senderResponse =
          await sql`UPDATE users SET points=${newPoints} WHERE uuid=${req.body.uuid}`;
        var senderFeed = JSON.parse(getSenderUser.rows[0].feed);
        senderFeed.push({
          message: `${getTargetUser.rows[0].fname} has been sent ${points} points`,
          timestamp: Date.now(),
        });

        var updateSenderFeed = await sql`UPDATE users SET feed=${JSON.stringify(
          senderFeed
        )} WHERE uuid=${req.body.uuid}`;
        var sendUserNotification = await SchoolthingPushNotification(
          req.body.uuid,
          {
            title: "💙 Points sent! 💙",
            body: `You sent ${points} points to ${getTargetUser.rows[0].fname}! 💙💰`,
            url: `https://schoolthing.org/main`,
          }
        );
        var sendTargetNotification = await SchoolthingPushNotification(
          getTargetUser.rows[0].uuid,
          {
            title: "💸 Payday! 💸",
            body: `${getSenderUser.rows[0].fname} has sent you ${points} points! You now have ${newTargetPoints} points!`,
            url: `https://schoolthing.org/main`,
          }
        );

        var targetFeed = JSON.parse(getTargetUser.rows[0].feed);
        targetFeed.push({
          message: `${getSenderUser.rows[0].fname} has sent you ${points} points`,
          timestamp: Date.now(),
        });
        var updateTargetFeed = await sql`UPDATE users SET feed=${JSON.stringify(
          targetFeed
        )} WHERE email=${req.body.toemail} AND org=${req.body.org}`;
        var targetResponse =
          await sql`UPDATE users SET points=${newTargetPoints} WHERE email=${req.body.toemail} AND org=${req.body.org}`;
        res.status(200).json({ status: "success" });
      } else {
        res.status(200).json({ status: "fail-insuff" });
      }
    }
  }
}
