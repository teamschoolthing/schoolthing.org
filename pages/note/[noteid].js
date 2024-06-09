import { useEffect, useState, useRef } from "react";
import Head from "next/head";
import { backendURL, productName, thisURL } from "../../resources/strings.js";
import Cookies from "universal-cookie";
import { useRouter } from "next/router.js";
import imgCSS from "./Note.module.scss";
import Image from "next/image.js";
import { validate as uuidValidate } from "uuid";
const cookies = new Cookies();
import styles from "../main/Main.module.scss";
import {
  Home,
  Heart,
  TriangleAlert,
  TriangleAlertFill,
  ChevronLeft,
} from "akar-icons";
import { IKImage, IKVideo, IKContext, IKUpload } from "imagekitio-react";
import { sql } from "@vercel/postgres";
import Modal from "react-modal";
var iconColor = "#1B2430";
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(5px)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "15px",
    boxShadow: "0px 0px 10px 5px #e5e5e5",
    border: null,
    width: "80%",
    height: "fit-content",
  },
};
const customStylesForLoading = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    backdropFilter: "blur(5px)",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    borderRadius: "15px",
    padding: "25px",
    width: "80%",
  },
};
export default function Note({
  noteData,
  compiledUserNotes,
  userData,
  orgSubjectList,
  prefMode,
  orgCookie,
}) {
  const router = useRouter();
  var [openModal, setOpenModal] = useState(false);
  var [modalContent, setModalContent] = useState();
  var [likeContent, setLikeContent] = useState();
  var [isReporting, setIsReporting] = useState(false);
  var [liked, setLiked] = useState(
    JSON.parse(userData.liked).includes(noteData.uuid)
  );
  var [isLikeLoading, setLikeLoading] = useState(false);
  var [likeLoadingContent, setLikeLoadingContent] = useState(
    <h1>Loading...</h1>
  );
  function likeNote(noteuuid, userdata) {
    setLikeLoading(true);
    //setLikeLoadingContent(<h1>Loading...</h1>);
    var likedNotes = JSON.parse(userdata.liked);
    if (likedNotes.includes(noteuuid)) {
      setLiked(true);
    } else {
      setLikeLoading(true);
      fetch(`${thisURL}/api/likeNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          useruuid: userdata.uuid,
          noteuuid: noteuuid,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLiked(true);
          setLikeLoading(false);
        });
    }
  }
  function openImg(path, j, count) {
    var i = j;
    if (i == count - 1) {
      setModalContent(
        <>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Close
          </button>
          <br />
          <button
            onClick={() => {
              openImg(path, i - 1, count);
            }}
          >
            Previous
          </button>
          <br />
          <br />
          <img
            src={`https://ik.imagekit.io/schoolthing/${path}/${i}.png`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              overflow: "hidden",
              imageResolution: "50dpi",
            }}
          />
        </>
      );
      setOpenModal(true);
    } else if (i == 0) {
      setModalContent(
        <>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Close
          </button>
          <br />
          <button
            onClick={() => {
              openImg(path, i + 1, count);
            }}
          >
            Next
          </button>
          <br />
          <br />
          <img
            src={`https://ik.imagekit.io/schoolthing/${path}/${i}.png`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              overflow: "hidden",
              imageResolution: "50dpi",
            }}
          />
        </>
      );
      setOpenModal(true);
    } else {
      setModalContent(
        <>
          <button
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Close
          </button>
          <br />
          <button
            onClick={() => {
              openImg(path, i - 1, count);
            }}
          >
            Previous
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <button
            onClick={() => {
              openImg(path, i + 1, count);
            }}
          >
            Next
          </button>
          <br />
          <br />
          <img
            src={`https://ik.imagekit.io/schoolthing/${path}/${i}.png`}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              overflow: "hidden",
              imageResolution: "50dpi",
            }}
          />
        </>
      );
      setOpenModal(true);
    }
  }

  if (compiledUserNotes.includes(noteData.uuid)) {
    var comprehendedNoteSubject = orgSubjectList[noteData.subject];
    function loadImgs(count, uuid) {
      var tot = [];
      for (var i = 0; i < count; i++) {
        const j = i;
        const path = `imgs/${orgCookie}/${uuid}/${i}.png`;
        tot.push(
          <>
            <img
              src={`https://ik.imagekit.io/schoolthing/${path}`}
              style={{
                height: "100%",
                margin: "auto",
                align: "center",
                objectFit: "contain",
                overflow: "hidden",
              }}
              className={imgCSS.image}
              onClick={() => {
                openImg(`imgs/${orgCookie}/${uuid}`, j, count);
              }}
            />
            <br />
          </>
        );
      }

      return tot;
    }

    function sendReport(noteuuid, userdata) {
      setLikeLoadingContent(<h1>Loading...</h1>);
      setIsReporting(true);
      fetch(`${thisURL}/api/reportNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          useruuid: userdata.uuid,
          noteuuid: noteuuid,
          org: orgCookie,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setLikeLoadingContent(
            <div>
              <h1>Report Sent!</h1>
              <p>
                Your report has been sent to the moderation team and your
                Community admin. Once a decision is made, you will be emailed.
              </p>
              <button
                onClick={() => {
                  setIsReporting(false);
                }}
              >
                Close
              </button>
            </div>
          );
        });
    }

    function confirmReport(noteuuid, userdata) {
      setLikeLoadingContent(
        <div>
          <TriangleAlertFill size={36} style={{ margin: "auto" }} />
          <h2>Are you sure?</h2>
          <p>
            When you submit this report, a copy of your information, this note
            and the author's data will be sent to the moderation team and your
            Community admin. Once a decision is made, you will be emailed.
          </p>
          <button
            onClick={() => {
              setIsReporting(false);
            }}
          >
            Cancel
          </button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <button
            onClick={() => {
              sendReport(noteuuid, userdata);
            }}
          >
            Continue
          </button>
        </div>
      );
      setIsReporting(true);
    }
    return (
      <>
        <Head>
          <meta name="theme-color" content={prefMode ? "#121212" : "#F9F9F9"} />
        </Head>
        <div
          style={
            prefMode == true ? { background: "#121212", color: "white" } : null
          }
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "5% 80% 5%",
              margin: "20px 0px",
            }}
          >
            {" "}
            <ChevronLeft
              size={32}
              style={{
                verticalAlign: "middle",
                cursor: "pointer",
                margin: "auto",
              }}
              onClick={() => {
                window.history.back();
              }}
            />
            <h1
              style={{
                verticalAlign: "middle",
                margin: "auto",
              }}
            >
              <img
                src="/favicon.ico"
                width="40"
                height="40"
                style={{ verticalAlign: "middle", marginRight: "10px" }}
                alt={`The ${productName} Logo`}
              />
              View Note
            </h1>
            <TriangleAlertFill
              size={32}
              style={{
                verticalAlign: "middle",
                cursor: "pointer",
                margin: "auto",
              }}
              onClick={() => {
                confirmReport(noteData.uuid, userData);
              }}
              color="red"
              strokeWidth={2}
            />
          </div>
          <h1 style={{ textAlign: "center" }}>{noteData.title}</h1>
          <br />
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
          <Modal isOpen={isReporting} style={customStylesForLoading}>
            <div style={{ textAlign: "center", padding: "5px" }}>
              {likeLoadingContent}
            </div>
          </Modal>

          <div
            style={{ align: "center", marginLeft: "10%", marginRight: "10%" }}
          >
            <div>
              <h1 align="center">
                {noteData.teacher == true ? (
                  <span
                    style={{
                      verticalAlign: "middle",
                      border: "1px solid black",
                      borderRadius: "10px",
                      padding: "7px",
                      width: "fit-content",
                      fontSize: "16px",
                      background: "white",
                      color: "black",
                    }}
                  >
                    Teacher Note
                  </span>
                ) : null}{" "}
              </h1>
              <p
                style={{
                  fontSize: "18px",
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  margin: "5px 35px",
                }}
              >
                <span style={{ color: prefMode == true ? "white" : "black" }}>
                  {liked ? (
                    "Liked!"
                  ) : isLikeLoading ? (
                    "Liking..."
                  ) : (
                    <Heart
                      strokeWidth={2}
                      size={28}
                      onClick={() => {
                        likeNote(noteData.uuid, userData);
                      }}
                    />
                  )}
                </span>
                <span
                  style={{
                    textAlign: "right",
                    color: prefMode == true ? "white" : "black",
                  }}
                >
                  Author: {noteData.fname} <br />
                  {noteData.class} {comprehendedNoteSubject}
                  <br />
                </span>
              </p>
              <div
                style={{
                  border:
                    prefMode == true ? "5px solid #121212" : "5px solid white",
                  borderRadius: "20px",
                  background: prefMode == true ? "#121212" : "white",
                  padding: "25px",
                  width: "90%",
                  textAlign: "center",
                  margin: "auto",
                }}
              >
                {liked ? null : (
                  <p>
                    {" "}
                    If you find this note interesting, click the heart icon to
                    improve your recommendations and show {noteData.fname} your
                    gratitude!
                  </p>
                )}
                {/*<h1>Description</h1>
                <p ref={descRef} />*/}
                <br />
                <i>Click on the images to view a higher quality version</i>
                <br />
                {loadImgs(noteData.imgs, noteData.privateuuid)}
                <br />
              </div>
            </div>
            <br />
            <br />
          </div>
        </div>
      </>
    );
  } else {
    return (
      <div style={{ align: "center", marginLeft: "10%", marginRight: "10%" }}>
        <Head>
          <title>
            {noteData.title} | {productName}
          </title>
          <meta
            name="description"
            content={`THE page to view notes on ${productName}`}
          />
        </Head>
        <button
          align="left"
          onClick={() => {
            router.push("/");
          }}
        >
          <Home className={styles.icon} size={24} /> Home
        </button>
        <h1>You have not bought this note.</h1>
      </div>
    );
  }
}

export async function getServerSideProps(ctx) {
  const noteid = ctx.query.noteid;
  var noteDataREQ =
    await sql`SELECT * from notes WHERE uuid=${noteid} AND org=${ctx.req.cookies.org}`;
  var noteData = noteDataREQ.rows[0];
  var compiledUserNotesREQ =
    await sql`SELECT * from users WHERE uuid=${ctx.req.cookies.useruuid} AND org=${ctx.req.cookies.org}`;
  var orgSubListREQ =
    await sql`SELECT grades from organisations WHERE id=${ctx.req.cookies.org}`;
  var compiledUserNotesPRE = JSON.parse(compiledUserNotesREQ.rows[0].notes);
  var compiledUserNotes = [];
  compiledUserNotesPRE.forEach((note) => {
    compiledUserNotes.push(note.uuid);
  });
  return {
    props: {
      noteData: noteData,
      compiledUserNotes: compiledUserNotes,
      userData: compiledUserNotesREQ.rows[0],
      orgSubjectList: JSON.parse(orgSubListREQ.rows[0].grades),
      prefMode: ctx.req.cookies.mode == "true" ? true : false,
      orgCookie: ctx.req.cookies.org,
    },
  };
}
