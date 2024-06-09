import styles from "../../pages/main/Teacher.module.scss";
import { sql } from "@vercel/postgres";
import Modal from "react-modal";
import { useState, useRef } from "react";
import { thisURL } from "../../resources/strings";
export default function Students({ allUsers, isTeacher }) {
  if (!isTeacher) {
    return (
      <div className={styles.teacherBody}>
        <div style={{ textAlign: "center", margin: "0px 30px" }}>
          <h1>Access Restricted | Schoolthing Teacher</h1>
        </div>
      </div>
    );
  }
  var pointsModeRef = useRef();
  var pointsRef = useRef();
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
  function doTransaction(user) {
    var reqObj = {
      useruuid: user.uuid,
      points: pointsRef.current.value,
      method: pointsModeRef.current.value,
    };
    fetch(`${thisURL}/api/teacher/manageUserPoints`, {
      method: "POST",
      body: new URLSearchParams(reqObj),
    })
      .then((res) => res.json())
      .then((data) => {
        setModalContent(
          <>
            <h1>Success!</h1>
            <p>
              {pointsModeRef.current.value == "add" ? "Added" : "Subtracted"}{" "}
              {pointsRef.current.value} points{" "}
              {pointsModeRef.current.value == "add" ? "to" : "from"}{" "}
              {user.fname} {user.lname}!
            </p>
            <button
              onClick={() => {
                window.location.reload();
                setOpenModal(false);
              }}
            >
              Close
            </button>
          </>
        );
        setOpenModal(true);
      })
      .catch((err) => {
        console.log(err);
        setModalContent(
          <>
            <h1>Error!</h1>
            <p>
              Something unexpected happened! Please contact support@schoolthing.org
              if the issue persists.
            </p>
            <button
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Close
            </button>
          </>
        );
        setOpenModal(true);
      });
  }
  function removeUser(user) {
    var reqObj = {
      useruuid: user.uuid,
    };
    fetch(`${thisURL}/api/teacher/removeUser`, {
      method: "POST",
      body: new URLSearchParams(reqObj),
    })
      .then((res) => res.json())
      .then((data) => {
        setModalContent(
          <>
            <h1>Success!</h1>
            <p>
              Removed {user.fname}! An email has been sent to them notifying
              them of their removal.
            </p>
            <button
              onClick={() => {
                window.location.reload();
                setOpenModal(false);
              }}
            >
              Close
            </button>
          </>
        );
        setOpenModal(true);
      })
      .catch((err) => {
        console.log(err);
        setModalContent(
          <>
            <h1>Error!</h1>
            <p>
              Something unexpected happened! Please contact support@schoolthing.org
              if the issue persists.
            </p>
            <button
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Close
            </button>
          </>
        );
        setOpenModal(true);
      });
  }
  function setTeacher(fname, uuid) {
    fetch(`${thisURL}/api/teacher/setTeacher`, {
      method: "POST",
      body: new URLSearchParams({ uuid: uuid }),
    })
      .then((res) => res.json())
      .then((data) => {
        setModalContent(
          <>
            <h1>Success!</h1>
            <p>{fname} is now a teacher!</p>
            <button
              onClick={() => {
                window.location.reload();
                setOpenModal(false);
              }}
            >
              Close
            </button>
          </>
        );
        setOpenModal(true);
      })
      .catch((err) => {
        console.log(err);
        setModalContent(
          <>
            <h1>Error!</h1>
            <p>
              Something unexpected happened! Please contact support@schoolthing.org
              if the issue persists.
            </p>
            <button
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Close
            </button>
          </>
        );
        setOpenModal(true);
      });
  }
  function openUser(method, userdata) {
    if (method == "points") {
      setModalContent(
        <>
          <h1>Points | {userdata.fname}</h1>
          <br />
          <select
            ref={pointsModeRef}
            onChange={() => {
              alert(pointsModeRef.current.value);
            }}
          >
            <option value="add">Add</option>
            <option value="subtract">Subtract</option>
          </select>
          <br />
          <br />
          <input ref={pointsRef} placeholder="Enter the number of points" />
          <br />
          <br />
          <button
            onClick={() => {
              doTransaction(userdata);
            }}
          >
            Go!
          </button>
        </>
      );

      setOpenModal(true);
    } else if (method == "remove") {
      setModalContent(
        <>
          <h2>Remove User - {userdata.fname}</h2>
          <h1>Are you sure?</h1>
          <p>
            Removing this user will delete their account. However, they will
            still be able to create an account again. To ban a user
            permananently, contact support@pidgon.com.
          </p>
          <button
            onClick={() => {
              removeUser(userdata);
            }}
          >
            Remove
          </button>
        </>
      );
      setOpenModal(true);
    }
  }

  var [openModal, setOpenModal] = useState(false);
  var [modalContent, setModalContent] = useState();
  var userdataFormatted = [];
  allUsers.forEach((user) => {
    userdataFormatted.push(
      <div className={styles.UserItem}>
        <div>
          <h1>
            {user.fname} {user.lname}
          </h1>
          <p>{user.email}</p>
          <p>
            {user.class} | {user.points} points
            <br />
            {user.teacher ? <b>{user.fname} is a Teacher</b> : <button
              onClick={() => {
                setTeacher(user.fname, user.uuid);
              }}
            >
              Make Teacher
            </button>}
          </p>
        </div>
        <div style={{ textAlign: "right" }}><br />
         {user.teacher ? null : <button
            onClick={() => {
              openUser("points", user);
            }}
          >
            Manage points
          </button>}<br />
          {user.teacher ? null : <button
            onClick={() => {
              openUser("remove", user);
            }}
          >
            Remove
          </button>}
        </div>
      </div>
    );
  });
  return (
    <div className={styles.teacherBody}>
      <div style={{ textAlign: "center", margin: "0px 30px" }}>
        <Modal
          isOpen={openModal}
          style={customStyles}
          onRequestClose={() => {
            setOpenModal(false);
          }}
        >
          <div style={{ textAlign: "center", padding: "20px" }}>
            {modalContent}
          </div>
        </Modal>
        <h1>Manage Students | Schoolthing Teacher</h1>
        <button
          onClick={() => {
            window.location.href = "/teacher";
          }}
        >
          Back
        </button>
        <br />
        <div className={styles.userItemGrid}>{userdataFormatted}</div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  var getUserDataREQ =
    await sql`SELECT * FROM users WHERE org=${ctx.req.cookies.org}`;
    var getTeacherRoleREQ =
    await sql`SELECT teacher FROM users WHERE uuid=${ctx.req.cookies.useruuid}`;
  return {
    props: {
      allUsers: getUserDataREQ.rows,
      isTeacher: getTeacherRoleREQ.rows[0].teacher,
    },
  };
}
