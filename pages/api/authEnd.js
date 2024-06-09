import {ikEndpoint, ikPrivateKey, ikPublicKey} from "../../resources/strings";

var ImageKit = require("imagekit");
var imagekit = new ImageKit({
    publicKey : ikPublicKey,
    privateKey : ikPrivateKey,
    urlEndpoint : ikEndpoint
});
export default async function handler(req, res) {
  res.status(200).json(imagekit.getAuthenticationParameters());
}
