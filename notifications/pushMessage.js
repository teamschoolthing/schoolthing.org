const webpush = require("web-push");
import { sql } from "@vercel/postgres";
export default async function SchoolthingPushNotification(
  uuid,
  payload,
  usePredefinedVapid = false
) {
  const vapidKeys = {
    subject: "mailto:support@schoolthing.org",
    publicKey:
      "BFAVv6CP04Ajqcm1ycZOOAMA_w5WHdxFbjwOdbIFrFXVYEXp95h_DnZnvgkhkmqzY68HMRLwygzPhIqePNRApi4",
    privateKey: "BmrqBTFKkeGen6JgmKI-v1Rbb_T6ruxuBVQD_EfKIGY",
  };
  webpush.setVapidDetails(
    "mailto:support@schoolthing.org",
    vapidKeys.publicKey,
    vapidKeys.privateKey
  );
  var subscriptionDetails = [];
  if (usePredefinedVapid == true) {
    subscriptionDetails = uuid;
  } else {
    var subData = await sql`SELECT * from users WHERE uuid=${uuid}`;
    subscriptionDetails = subData.rows[0].vapid;
  }
  if (subscriptionDetails == "") {
    return "fail";
  } else if(!usePredefinedVapid) {
    subscriptionDetails = JSON.parse(subscriptionDetails);
  }
  async function triggerPushMsg(subscription, dataToSend) {
    await webpush
      .sendNotification(subscription, JSON.stringify(dataToSend))
      .then(function () {
        console.log("Push triggered");
      })
      .catch(function (error) {
        console.log("err", error);
      });
  }
  /*{
    {
      title: "Hello!",
      body: "This is a test notification",
      url: `https://schoolthing.org/main`,
    }*/
  subscriptionDetails.forEach(async (element) => {
    var sd = element;
    sd.expirationTime = null;
    await triggerPushMsg(sd, payload);
  });
  return "success";
}
