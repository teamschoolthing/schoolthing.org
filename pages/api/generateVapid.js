const webpush = require("web-push");
import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const vapidKeys = webpush.generateVAPIDKeys();
  var vapidData = {
    subject: `mailto:support@schoolthing.org`,
    publicKey: vapidKeys.publicKey,
    privateKey: vapidKeys.privateKey,
  };
    res.status(200).json({ data: "success", vapid: vapidData });
}
