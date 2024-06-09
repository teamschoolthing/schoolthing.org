var tfa = require("2fa");
import { TwoFAkey } from "../../../../resources/strings";
var opts = {
  beforeDrift: 2,
  afterDrift: 2,
  drift: 4,
  step: 30,
};

export default async function handler(req, res) {
    var code = req.body.code
  var validTOTP = tfa.verifyTOTP(TwoFAkey, code, opts);
  if (validTOTP) {
    res
      .status(200)
      .json({ status: true, data: "f0f1ac90-3b93-4f2a-b41e-c9ba7ad586ee" });
  } else {
    res.status(200).json({ status: false });
  }
}
