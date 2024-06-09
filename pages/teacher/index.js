import styles from "../../pages/main/Teacher.module.scss";
import { sql } from "@vercel/postgres";
import { productName } from "../../resources/strings";
import Cookies from "universal-cookie";
const cookies = new Cookies();

export default function Teacher({ userdata }) {
  if (!userdata.teacher) {
    return (
      <div className={styles.teacherBody}>
        <div style={{ textAlign: "center", margin: "0px 30px" }}>
          <h1>Access Restricted | Schoolthing Teacher</h1>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.teacherBody}>
      <div style={{ textAlign: "center", marginBottom: "100px" }}>
        <h1>{productName} Teacher</h1>
        <button
          onClick={() => {
            cookies.remove("useruuid");
            window.location.href = "/";
          }}
        >
          Logout
        </button>
        <h2>
          Hello, {userdata.fname} {userdata.lname}
        </h2>
        <br />
        <br />
        <br />
        <div className={styles.teacherGrid}>
          <div
            className={styles.teacherGridItem}
            onClick={() => {
              window.location.href = "/teacher/students";
            }}
          >
            <br />
            <br />
            <h2>Students</h2>
            <p>Manage students in your organisation</p>
          </div>
          <div
            className={styles.teacherGridItem}
            onClick={() => {
              window.location.href = "/teacher/loginCode";
            }}
          >
            <br />
            <br />
            <h2>Login</h2>
            <p>
              Create a login access code for students without a organisation
              email to log in.
            </p>
          </div>
          <div
            className={styles.teacherGridItem}
            onClick={() => {
              window.location.href = "/create/notice";
            }}
          >
            <br />
            <br />
            <h2>Notice</h2>
            <p>Broadcast a notice to all students or specific grades</p>
          </div>
          <div
            className={styles.teacherGridItem}
            onClick={() => {
              window.location.href = "/createNote";
            }}
          >
            <br />
            <br />
            <h2>Notes</h2>
            <p>
              Create notes. Your notes will be available for free for all
              students, and will have a glow in the Notes Store.
            </p>
          </div>
          <div
          className={styles.teacherGridItem}
          onClick={() => {
            window.location.href = "/teacher/worksheets";
          }}
>
            <br />
            <br />
            <h2>Worksheets</h2>
            <p>
              Create worksheets and quizzes with the powerful Schoolthing
              worksheet editor. Only for Schoolthing Pro Communities.
            </p>
          </div>
          <div className={styles.teacherGridItem}
          onClick={() => {
            window.location.href = "/teacher/storage";
          }}>
            <br />
            <br />
            <h2>View Community storage</h2>
            <p>View how much data you've used.</p>
          </div>
          <div
            className={styles.teacherGridItem}
            onClick={() => {
              window.location.href = "/main";
            }}
          >
            <br />
            <br />
            <h2>Student mode</h2>
            <p>Switch to student mode</p>
          </div>
          <div className={styles.teacherGridItem}>
            <br />
            <br />
            <h2>More features coming soon</h2>
          </div>
        </div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  var getUserDataREQ =
    await sql`SELECT * FROM users WHERE uuid=${ctx.req.cookies.useruuid}`;
    var getSubjectDataREQ = await sql`SELECT * FROM organisations WHERE id=${ctx.req.cookies.org}`;
  return {
    props: {
      userdata: getUserDataREQ.rows[0],
      orgData: getSubjectDataREQ.rows[0],
    },
  };
}

