// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { sql } from "@vercel/postgres";

export default async function handler(req, res) {
  const { rows } = await sql`SELECT * from organisations`;
  var data = [];
  rows.forEach((item, index) => {
    data.push({id: item.id, name: item.name})
  });
  res.status(200).json({ data: data });

}
