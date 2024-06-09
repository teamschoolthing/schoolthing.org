//CREATE TABLE worksheets (org TEXT, title TEXT, uuid TEXT, grade TEXT, subject TEXT, questions TEXT, answers TEXT, timestamp INT)
import { sql } from "@vercel/postgres";
import { v4 as uuid4 } from "uuid";
export default async function handler(req, res) {
  /**
   * @param {string} req.body.org
   * @param {string} req.body.title
   * @param {string} req.body.grade
   * @param {string} req.body.subject
   * @param {string} req.body.questions
   * @param {string} req.body.answers
   */
  const uuid = uuid4();
  var timestamp = Date.now();
  var getIfUUIDExists =
    await sql`SELECT * FROM worksheets WHERE uuid = ${uuid}`;
  if (getIfUUIDExists.rows.length > 0) {
    try {
      //org TEXT, title TEXT, uuid TEXT, grade TEXT, subject TEXT, questions TEXT, answers TEXT, timestamp INT
      const query = await sql`INSERT INTO worksheets VALUES(${req.body.org}, ${
        req.body.title
      }, ${uuid}, ${req.body.grade}, ${req.body.subject}, ${
        req.body.questions
      }, ${req.body.answers}, ${Date.now()})`;
      res.status(200).json({
        success: true,
        uuid: uuid,
        data: `INSERT INTO worksheets VALUES(${req.body.org}, ${
          req.body.title
        }, ${uuid}, ${req.body.grade}, ${req.body.subject}, ${
          req.body.questions
        }, ${req.body.answers}, ${Date.now()})`,
      });
    } catch (e) {
      res.status(500).json({
        error: "ISE",
        detail: e,
      }); // Internal Server Error
    }
  } else {
    res.status(500).json({
      error: "uuid",
    }); // Internal Server Error
  }
}
