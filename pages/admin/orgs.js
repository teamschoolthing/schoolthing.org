import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useRouter } from "next/router";
import { sql } from "@vercel/postgres";
/* cookies.set('myCat', 'Pacman', { path: '/' });
cookies.get('myCat')*/
const lDim = "100%";
export default function Home({ orgs, uuid }) {
  const router = useRouter();
  var data = [];
  data = [];
  orgs.forEach((org) => {
    console.log(org);
    var subjects = JSON.parse(org.subjects);
    var grades = JSON.parse(org.grades);
    var sdata = [];
    var gdata = [];
    for (var key in subjects) {
      sdata.push(<li>{subjects[key]}</li>);
    }
    for (var key in grades) {
      gdata.push(<li>{grades[key]}</li>);
    }
    data.push(
      <div>
        <div
          style={{
            border: "1px solid white",
            borderRadius: "20px",
            backgroundColor: "rgba(255, 255, 255, 1)",
            boxShadow: "0 0 10px 1px gold",
            backdropFilter: "blur(15px)",
            padding: "25px",
            color: "black",
            margin: "auto",
          }}
        >
          <h2 style={{ textAlign: "center" }}>{org.name}</h2>
          <i>{org.id}</i>
          <br />
          <button
            onClick={() => {
              deleteOrg(org.id);
            }}
          >
            Delete org
          </button>
          <br />
          <h3>Subjects</h3>
          <ul>{sdata}</ul>
          <h3>Grades</h3>
          <ul>{gdata}</ul>
        </div>
        <br />
        <br />
      </div>
    );
  });
  if (uuid == "f0f1ac90-3b93-4f2a-b41e-c9ba7ad586ee") {
    return (
      <div style={{ margin: "auto", padding: "20px", textAlign: "center" }}>
        <h2 style={{ textAlign: "center" }}>Schoolthing</h2>
        <h1 style={{ textAlign: "center" }}>Admin Enclave</h1>
        <br />
        <div align={{ margin: "auto", textAlign: "center" }}>
          <button
            style={{ background: "coral" }}
            onClick={() => {
              router.push("/admin/orgs");
            }}
          >
            Organisations
          </button>
          &nbsp;&nbsp;
          <button
            onClick={() => {
              router.push("/admin/push");
            }}
          >
            Push Notifications
          </button>
          &nbsp;&nbsp;
          <button
            onClick={() => {
              cookies.remove("adminuuid");
              router.push("/admin");
            }}
          >
            Logout
          </button>
        </div>
        <br />
        {data}
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "center", margin: "auto", padding: "30px" }}>
        <h2>Schoolthing</h2>
        <h1>Admin Enclave</h1>
        <br />
        <br />
        <h2>Restricted Access</h2>
      </div>
    );
  }
}

export const getServerSideProps = async (ctx) => {
  var orgDataREQ = await sql`SELECT * FROM organisations`;
  var orgData = orgDataREQ.rows;

  var uuid = ctx.req.cookies.adminuuid ? ctx.req.cookies.adminuuid : "";
  return {
    props: {
      orgs: orgData,
      uuid: uuid,
    },
  };
};
