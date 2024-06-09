import postgres from "postgres";
const conn = postgres();
export default async function handler(req, res) {
    //var e = conn.query`SELECT * FROM internaldata`
 res.status(200).json({ status: 'hi' }); 
}

