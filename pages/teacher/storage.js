import styles from "../../pages/main/Teacher.module.scss";
import { sql } from "@vercel/postgres";
import Modal from "react-modal";
import { useState, useRef } from "react";
import { thisURL } from "../../resources/strings";
export default function Students({ isTeacher, storageData }) {
  var pointsModeRef = useRef();
  var pointsRef = useRef();
  if (!isTeacher) {
    return (
      <div className={styles.teacherBody}>
        <div style={{ textAlign: "center", margin: "0px 30px" }}>
          <h1>Access Restricted | Schoolthing Teacher</h1>
        </div>
      </div>
    );
  }

  const customStyles = {
    overlay: {
      backdropFilter: "blur(1px)",
      zIndex: "100",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      borderRadius: "15px",
      width: "80%",
    },
  };
  var storageDataFormatted = [];
  function nOfDigits(n) {
    var count = 0;
    if (n >= 1) ++count;
  
    while (n / 10 >= 1) {
      n /= 10;
      ++count;
    }
  
    return count;
  }
  var total = 0;
  for (var key in storageData) {
    var amount = parseInt(storageData[key]);
    total += amount;
    if(nOfDigits(amount))
    storageDataFormatted.push(
      <div className={styles.UserItem}>
        <h1>{key}</h1>
        <h2 style={{textAlign:"right"}}>{amount >= 1000000 ? amount/1000000 : amount/1000} {amount >= 1000000 ?'MB':'KB'}</h2>
      </div>
    );
  }
  storageDataFormatted.push(
    <div className={styles.UserItem}>
      <h1>Total</h1>
      <h2 style={{textAlign:"right"}}>{total >= 1000000 ? total/1000000 : total/1000} {total >= 1000000 ?'MB':'KB'}</h2>
    </div>
  );


  return (
    <div className={styles.teacherBody}>
      <div style={{ textAlign: "center", margin: "0px 30px" }}>
        <h1>Storage | Schoolthing Teacher</h1>
        <button
          onClick={() => {
            window.location.href = "/teacher";
          }}
        >
          Back
        </button>
        <br />
        <div className={styles.userItemGrid}>{storageDataFormatted}</div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  var getUserDataREQ =
    await sql`SELECT teacher FROM users WHERE uuid=${ctx.req.cookies.useruuid}`;
  // console.log(getUserDataREQ);
  var storageData = {};
  var getUserStorageREQ =
    await sql`SELECT pg_relation_size('users') FROM users WHERE org=${ctx.req.cookies.org}`;
  storageData["User Data"] = getUserStorageREQ.rows[0].pg_relation_size;
  var getNotesStorageREQ =
    await sql`SELECT pg_relation_size('notes') FROM notes WHERE org=${ctx.req.cookies.org}`;
  storageData["Note Data (excluding images)"] = getNotesStorageREQ.rows[0].pg_relation_size;
  var otherdata = 0;
  var getOrgDataREQ =
    await sql`SELECT pg_relation_size('organisations') FROM organisations WHERE id=${ctx.req.cookies.org}`;
  otherdata += parseInt(getOrgDataREQ.rows[0].pg_relation_size);
  var getLoginCodeDataREQ =
    await sql`SELECT pg_relation_size('logincodes') FROM logincodes WHERE org=${ctx.req.cookies.org}`;
  otherdata += parseInt(getLoginCodeDataREQ.rows[0].pg_relation_size);
  storageData["Other Data"] = otherdata;
  return {
    props: {
      isTeacher: getUserDataREQ.rows[0].teacher,
      storageData: storageData,
    },
  };
}
