const webpush = require("web-push");
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import { thisURL } from "../../resources/strings";
import SchoolthingPushNotification from "../../notifications/pushMessage";
export default async function handler(req, res) {
  var getUserData =
    await sql`SELECT uuid, fname, vapid FROM users`;
  var users = getUserData.rows;
  for (const user of users) {
    if (user.vapid !== "") {
      var title = req.body.title.replace(/@fname@/gm, user.fname);
      var body = req.body.message.replace(/@fname@/gm, user.fname);
      var url = req.body.url;
      var pnm = await SchoolthingPushNotification(JSON.parse(user.vapid), {
        title: title,
        body: body,
        url: url,
      }, true);
    }
  }
  res.status(200).json({ status: "success" });
}
