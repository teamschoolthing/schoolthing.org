import { sql } from "@vercel/postgres";
import SchoolthingPushNotification from "../../notifications/pushMessage";
export default async function handler(req, res) {
  /**
   * @param {uuid} req.body.uuid
   * @param {string} req.body.subscription
   */
  console.log(req.body.uuid, req.body.subscription);
  var { rows } = await sql`SELECT * from users WHERE uuid=${req.body.uuid}`;
  if (rows.length > 0) {
    var currentVapid = JSON.parse(rows[0].vapid);
    //check if vapid is already in array
    var alreadyExists = false;
    currentVapid.forEach((element) => {
      if (element.endpoint == JSON.parse(req.body.subscription).endpoint) {
        alreadyExists = true;
      }
    });
    if (alreadyExists) {
      console.log("already exists");
      res.status(200).json({ data: "success", vapid: req.body.subscription });
      var sendNotif = await SchoolthingPushNotification(
        JSON.parse(rows[0].vapid),
        {
          title: "✨ Welcome to Schoolthing ✨",
          body: "You will now get notifications!",
          url: `https://schoolthing.org/main`,
        },
        true
      );
      return;
    } else {
      console.log("adding");
      currentVapid.push(JSON.parse(req.body.subscription));
      var updateUserNotifsREQ =
        await sql`UPDATE users SET vapid=${JSON.stringify(
          currentVapid
        )} WHERE uuid=${req.body.uuid}`;
      var sendNotif = await SchoolthingPushNotification(req.body.uuid, {
        title: "✨ Welcome to Schoolthing ✨",
        body: "You will now get notifications!",
        url: `https://schoolthing.org/main`,
      });
      res.status(200).json({ data: "success", vapid: req.body.subscription });
    }
  } else {
    res.status(200).json({ data: "fail" });
  }
}
