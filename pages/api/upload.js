import {ikEndpoint, ikPrivateKey, ikPublicKey} from "../../resources/strings";

var ImageKit = require("imagekit");
import { v4 as uuidv4 } from "uuid";
var imagekit = new ImageKit({
  publicKey: ikPublicKey,
  privateKey: ikPrivateKey,
  urlEndpoint: ikEndpoint,
});
export default async function handler(req, res) {
    var fileBody = req.files
}
