import styles from "../../pages/main/Teacher.module.scss";
import { sql } from "@vercel/postgres";
import Modal from "react-modal";
import { useState, useRef, useEffect } from "react";
import { thisURL } from "../../resources/strings";
import { generateCode } from "2fa";
export default function Students({ allCodes, orgID, isTeacher }) {
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
  var [openModal, setOpenModal] = useState(false);
  var [modalContent, setModalContent] = useState();
  var codeFormatted = [];

  function generateCode(type) {
    var reqCode = {
      scope: "generateWideScope",
      data: "wide",
      org: orgID,
    };
    if (type == "wildcard") {
      fetch(`${thisURL}/api/teacher/loginCode`, {
        method: "POST",
        body: new URLSearchParams(reqCode),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status == "success") {
            setModalContent(
              <>
                <h1>Your Wildcard Code</h1>
                <p>
                  With this code, you can allow anyone without an organisation
                  email to join. You can remove this code at any time.
                </p>
                <div
                  style={{
                    border: "1px solid black",
                    padding: "10px",
                    borderRadius: "10px",
                    margin: "10px",
                  }}
                >
                  <h1>{json.code}</h1>
                </div>

                <br />
                <button
                  onClick={() => {
                    setOpenModal(false);
                    window.location.reload();
                  }}
                >
                  Close
                </button>
              </>
            );
            setOpenModal(true);
          }
        })
        .catch((err) => {
          alert(
            "An error occured while generating the code. Please try again later."
          );
        });
    }
  }

  function removeCode(code) {
    var reqCode = {
      scope: "removeCode",
      data: code,
      org: orgID,
    };
    fetch(`${thisURL}/api/teacher/loginCode`, {
      method: "POST",
      body: new URLSearchParams(reqCode),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status == "success") {
          setModalContent(
            <>
              <h1>Code Removed</h1>
              <p>The code has been removed.</p>
              <br />
              <button
                onClick={() => {
                  setOpenModal(false);
                  window.location.reload();
                }}
              >
                Close
              </button>
            </>
          );
          setOpenModal(true);
        }
      })
      .catch((err) => {
        alert(
          "An error occured while removing the code. Please try again later."
        );
      });
  }
  if (allCodes.length != 0) {
      allCodes.forEach((code) => {
        codeFormatted.push(
          <div className={styles.UserItem}>
            <div>
              <h1>
                {code.code}
              </h1>
              <p>
                <span>
                  {code.scope == "specific" ? (
                    `Only the email address ${code.data} can use this code`
                  ) : (
                    <span>
                      Anyone with this code can join this Schoolthing community
                    </span>
                  )}
                </span>
              </p>
            </div>
            <div style={{ textAlign: "right" }}>
              <br />
              <button
                onClick={() => {
                  removeCode(code.code);
                }}
              >
                Remove code
              </button>
              <br />
            </div>
          </div>
        );
      });
  } else {
    codeFormatted.push(
      <div>
        <h1>No codes found</h1>
      </div>
    );
  }
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
        <h1>Manage Codes | Schoolthing Teacher</h1>
        <button
          onClick={() => {
            window.location.href = "/teacher";
          }}
        >
          Back
        </button>
        <br />
        <br />
        <button
          onClick={() => {
            generateCode("wildcard");
          }}
        >
          Generate Code
        </button>
        <div className={styles.userItemGrid}>{codeFormatted}</div>
      </div>
    </div>
  );
}

export async function getServerSideProps(ctx) {
  var getLoginCodesREQ =
    await sql`SELECT * FROM logincodes WHERE org=${ctx.req.cookies.org}`;
  var getUserDataREQ =
    await sql`SELECT teacher FROM users WHERE uuid=${ctx.req.cookies.useruuid}`;
  return {
    props: {
      allCodes: getLoginCodesREQ.rows,
      orgID: ctx.req.cookies.org,
      isTeacher: getUserDataREQ.rows[0].teacher,
    },
  };
}
