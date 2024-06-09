import { sql } from "@vercel/postgres";
import { v4 as uuidv4 } from "uuid";
import * as bcrypt from "bcrypt";
import { productName } from "../../../resources/strings";
export default async function handler(req, res) {
  /**
   * @param {string} req.body.uuid
   */
  var updateTeacherRoleREQ = await sql`UPDATE users SET teacher=true WHERE uuid=${req.body.uuid}`;
    res.status(200).json({ status: "success" });
}