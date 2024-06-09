import { sql } from "@vercel/postgres";
export default async function handler(req, res) {
    var getUserData = await sql`SELECT * from users WHERE uuid=${req.body.useruuid}`;
    var userdata = getUserData.rows[0];
    if(req.body.toChange == 'name') {
        var fname = req.body.fname.trim()=='' ? userdata.fname : req.body.fname;
        var lname = req.body.lname.trim()=='' ? userdata.lname : req.body.lname;
        var updateUserFname = await sql`UPDATE users SET fname=${fname} WHERE uuid=${req.body.useruuid}`;
        var updateUserLname = await sql`UPDATE users SET lname=${lname} WHERE uuid=${req.body.useruuid}`;
        res.status(200).json({ status: "success" });
    } else if(req.body.toChange == 'bio') {
        if(req.body.bio.trim() == '') {
            res.status(200).json({ status: "success" });
        } else {
        var updateUserBio = await sql`UPDATE users SET bio=${req.body.bio} WHERE uuid=${req.body.useruuid}`;
        res.status(200).json({ status: "success" });
        }
    } else if(req.body.toChange == 'grade') {
        var verifyIfGradeIsReal = await sql`SELECT * FROM organisations WHERE id=${req.body.org}`;
        if(verifyIfGradeIsReal.rows[0].grades.includes(req.body.grade)) {
            var updateGrade = await sql`UPDATE users SET class=${req.body.grade} WHERE uuid=${req.body.useruuid}`;
            res.status(200).json({ status: "success" });
        } else {
            res.status(200).json({ status: "fail" });
        }
    } 
}

