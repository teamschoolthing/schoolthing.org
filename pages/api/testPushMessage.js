const webpush = require("web-push");
import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import { thisURL } from "../../resources/strings";
import SchoolthingPushNotification from "../../notifications/pushMessage";
export default async function handler(req, res) {
  var pnm = await SchoolthingPushNotification(req.body.uuid, {
    title: "Hello!",
    body: "This is a test notification",
    url: `https://schoolthing.org/main`,
  });
  res.status(200).json({ data: pnm });
}
