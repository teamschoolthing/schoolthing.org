// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
    if (req.method === 'POST') {
      var passResponse = await sql`INSERT INTO secrets VALUES(${req.body.id}, ${req.body.password})`
      var {response} = await sql`INSERT INTO organisations VALUES(${req.body.domain}, ${req.body.grades}, ${req.body.subjects}, ${req.body.id}, ${req.body.name})` 
    }
  res.status(200).json({ status: 'success' })
}
