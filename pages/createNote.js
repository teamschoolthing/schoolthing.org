import Head from "next/head";
import Link from "next/link";
import styles from "./Upload.module.scss";
import iconStyles from "./main/Main.module.scss";
import { useRef, useState, useEffect } from "react";
import {backendURL, editorAPIkey, ikEndpoint, ikPublicKey, productName, thisURL} from "../resources/strings.js";
import Cookies from "universal-cookie";
import { validate as uuidValidate } from "uuid";
import { v4 as uuidv4 } from "uuid";
import { Editor } from "@tinymce/tinymce-react";
const cookies = new Cookies();
import { IKImage, IKVideo, IKContext, IKUpload } from "imagekitio-react";
import { useRouter } from "next/router";
import { sql } from "@vercel/postgres";
import { ChevronLeft, ArrowCycle } from "akar-icons";
import Modal from "react-modal";
var iconColor = "#1B2430";
export default function CreateNote({
  gradesObj,
  subjectsObj,
  prefMode,
  userd,
  isTeacher,
  outOfStorage,
}) {
  var accentColor = cookies.get("accentColor") || "#80D7E0&black"
  function StyledButton(props) {
    return (
      <button
        onClick={props.onClick}
        style={{
          background: accentColor.split("&")[0],
          color: accentColor.split("&")[1],
          ...props.style,
        }}>
        {props.children}
        </button>
    )
  }
  var loadingIcon = (
    <ArrowCycle
      strokeWidth={2}
      size={28}
      className={`${iconStyles.icon} ${iconStyles.loadingIcon}`}
      color={iconColor}
      style={{ margin: "auto" }}
    />
  );
  var grades = [];
  var subjects = [];
  for (var key in gradesObj) {
    grades.push(<option value={key}>{gradesObj[key]}</option>);
  }
  for (var key in subjectsObj) {
    subjects.push(<option value={key}>{subjectsObj[key]}</option>);
  }
  var classRef = useRef();
  var titleRef = useRef();
  var pointsRef = useRef();
  var subjectRef = useRef();
  var uploadRef = useRef();
  const router = useRouter();
  const editorRef = useRef(null);
  const [value, setValue] = useState(0);
  const [incr, setIncr] = useState(0);
  const [process, setProcess] = useState(false);
  const [noteuuid, setnoteuuid] = useState(uuidv4());
  const [storage, setStorage] = useState(userd.storage);
  var [isRequired, setIsRequired] = useState({
    class: true,
    title: false,
    points: true,
    subject: true,
    content: true,
    image: false,
  });
  const [publicID, setpublicID] = useState(uuidv4());
  const [message, setMessage] = useState("");
  var [openModal, setOpenModal] = useState(false);
  var [modalContent, setModalContent] = useState();

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
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
  function submit() {
    var isAllTrue = false;
    var itemThatIsFalse = "";
    for (var key in isRequired) {
      if (isRequired[key] == false) {
        isAllTrue = false;
        itemThatIsFalse = key;
        break;
      } else {
        isAllTrue = true;
      }
    }
    if (isAllTrue == true) {
      setOpenModal(true);
      setModalContent(
        <>
          {loadingIcon}
          <h1>Uploading...</h1>
          <p>Your note is being created.</p>
        </>
      );
      //org TEXT, authoruuid TEXT, privateuuid TEXT, UUID text, fname TEXT, class TEXT, title TEXT, ---CONTINUES BELOW----
      //content TEXT, purchases INT, likes INT, imgs INT, points INT, subject TEXT
      var data = {
        org: cookies.get("org"),
        authoruuid: cookies.get("useruuid"),
        privateuuid: noteuuid,
        uuid: publicID,
        fname: userd.fname,
        class: cookies.get("org") == "global" ? "all" : classRef.current.value,
        title: titleRef.current.value,
        content: editorRef.current.getContent(),
        imgs: incr,
        points: pointsRef.current.value || 0,
        subject: subjectRef.current.value,
        isTeacher: isTeacher,
        storage: storage,
      };
      fetch(`${thisURL}/api/create/note`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(data),
      })
        .then((res) => res.json())
        .then((json) => {
          setModalContent(
            <>
              <h1>Done!</h1>
              <p>
                Your note has been created! You will be redirected back to the
                home page shortly.
              </p>
              <StyledButton
                onClick={() => {
                  setOpenModal;
                }}
              >
                Dismiss
              </StyledButton>
            </>
          );
          router.push("/main");
        });
    } else {
      var itemThatIsFalse =
        itemThatIsFalse == "content"
          ? "Description"
          : itemThatIsFalse.charAt(0).toUpperCase() + itemThatIsFalse.slice(1);
      setModalContent(
        <>
          <h1>Error!</h1>
          <p>
            {itemThatIsFalse == "Image" ? (
              <span>You have to upload an image first.</span>
            ) : (
              <span>
                {" "}
                You forgot to fill out the {itemThatIsFalse} field. Please fill
                it out and try again.
              </span>
            )}
          </p>
          <StyledButton
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Dismiss
          </StyledButton>
        </>
      );
      setOpenModal(true);
    }
  }
  if (outOfStorage) {
    return (
      <>
        <Head>
          <meta name="theme-color" content={"#F9F9F9"} />
          <title>Error | {productName}</title>
          <meta
            name="description"
            content={`The one page to create notes on ${productName}`}
          />
        </Head>
        <div className={styles.container} style={{ textAlign: "center" }}>
          <br />
          <br />
          <br />
          <img
            src="/favicon.ico"
            width="128"
            height="128"
            style={{ margin: "auto" }}
            alt={`The ${productName} Logo`}
          />
          <br />
          <br />
          <h1>Out of storage!</h1>
          <p>
            You've used up all of your storage for this month. You can't upload
            any more notes until the next month.
          </p>
          <p>
            Until then, you can view other students' notes and download them.
          </p>
          <br />
          <Link href="/main">
            <StyledButton
            >
              Go back
            </StyledButton>
          </Link>
        </div>
      </>
    );
  } else {
    return (
      <>
        <Head>
          <meta name="theme-color" content={"#F9F9F9"} />
          <title>Create Note | {productName}</title>
          <meta
            name="description"
            content={`The one page to create notes on ${productName}`}
          />
        </Head>
        <div className={styles.container}>
          <Modal isOpen={openModal} style={customStyles}>
            <div style={{ textAlign: "center", padding: "20px" }}>
              {modalContent}
            </div>
          </Modal>
          <div style={{ textAlign: "center" }}>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "10% 80%",
                margin: "20px 0px",
              }}
            >
              {" "}
              <Link href="/main">
                <ChevronLeft
                  size={32}
                  style={{
                    verticalAlign: "middle",
                    cursor: "pointer",
                    margin: "auto",
                  }}
                />
              </Link>
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
                Create Note
              </h1>
            </div>
            <br />
            <br />
            <h3>Give your notes a title</h3>
            <input
              type="text"
              placeholder="Title"
              ref={titleRef}
              required={true}
              style={{
                width: "80%",
              }}
              onChange={(e) => {
                if (e.target.value.trim() == "") {
                  var nIR = isRequired;
                  nIR.title = false;
                  setIsRequired(nIR);
                } else {
                  var nIR = isRequired;
                  nIR.title = true;
                  setIsRequired(nIR);
                }
              }}
            />
            <br />
            <br />
            <h3>How many points are these notes worth?</h3>
            {isTeacher ? (
              <>
                <span>
                  Because you're a teacher, your note will be free for all
                  students to access.
                </span>
                <input
                  type="number"
                  placeholder="Points"
                  hidden
                  ref={pointsRef}
                  defaultValue={0}
                  required={true}
                  style={{
                    width: "80%",
                  }}
                  onChange={(e) => {
                    setValue(
                      e.target.value <= 0
                        ? e.target.value
                        : Math.abs(e.target.value)
                    );
                  }}
                />
              </>
            ) : (
              <input
                type="number"
                placeholder="Points"
                ref={pointsRef}
                defaultValue={0}
                required={true}
                style={{
                  width: "80%",
                }}
                onChange={(e) => {
                  setValue(
                    e.target.value <= 0
                      ? e.target.value
                      : Math.abs(e.target.value)
                  );
                }}
              />
            )}
            <br />
            {isTeacher ? null : (
              <>
                <i>
                  Please enter a reasonable amount of points.
                  <br /> You will receive 100% of the points you enter on every
                  purchase made.
                </i>
                <br />
              </>
            )}
            <br />
            {cookies.get("org") == "global" ? (
              <select
                ref={classRef}
                style={{
                  width: "80%",
                  height: "60px",
                  fontSize: "16px",
                }}
                hidden
              >
                {grades}
              </select>
            ) : (
              <>
                <h3>What grade are these notes for?</h3>
                <select
                  ref={classRef}
                  style={{
                    width: "80%",
                    height: "60px",
                    fontSize: "16px",
                  }}
                  onChange={(e) => {
                    if (e.target.value.trim() == "") {
                      var nIR = isRequired;
                      nIR.class = false;
                      setIsRequired(nIR);
                    } else {
                      var nIR = isRequired;
                      nIR.class = true;
                      setIsRequired(nIR);
                    }
                  }}
                >
                  {grades}
                </select>
              </>
            )}
            <br />
            <br />
            <h3>What subject are these notes for?</h3>
            <select
              ref={subjectRef}
              style={{
                width: "80%",
                height: "60px",
                fontSize: "16px",
              }}
              onChange={(e) => {
                if (e.target.value.trim() == "") {
                  var nIR = isRequired;
                  nIR.subject = false;
                  setIsRequired(nIR);
                } else {
                  var nIR = isRequired;
                  nIR.subject = true;
                  setIsRequired(nIR);
                }
              }}
            >
              {subjects}
            </select>
            <br />
            <br />
            <h3>Image Uploader</h3>
            You've used {((storage / 1000000000) * 100).toPrecision(2)}% of your
            10GB storage this month ({(storage / 100000).toPrecision(4)} MB)
            <br />
            <br />
            <progress value={storage} max={1000000000}></progress>
            <br />
            <br />
            <p>Upload your images one by one.</p>
            <IKContext
              publicKey={ikPublicKey}
              urlEndpoint={ikEndpoint}
              authenticationEndpoint={`${thisURL}/api/authEnd`}
            >
              <IKUpload
                id="files"
                fileName={`${incr}.png`}
                folder={`/imgs/${cookies.get("org")}/${noteuuid}`}
                isPrivateFile={false}
                useUniqueFileName={false}
                inputRef={uploadRef}
                accept="image/*"
                style={{
                  width: "80%",
                  height: "60px",
                  fontSize: "16px",
                }}
                className="file"
                disabled={process}
                onError={(r) => {
                  setMessage(`An error occured. Details: ${JSON.stringify(r)}`);
                }}
                onUploadStart={(r) => {
                  setProcess(true);
                  setMessage("Uploading...");
                }}
                onUploadProgress={(progressEvent) => {
                  setProcess(true);
                  setMessage(
                    `Uploading: ${Math.round(
                      (progressEvent.loaded * 100) / progressEvent.total
                    )}%`
                  );
                }}
                onSuccess={(r) => {
                  setStorage(storage + r.size);
                  setIncr(incr + 1);
                  setProcess(false);
                  setMessage("Done! You can upload more images if needed.");
                  var nIR = isRequired;
                  nIR.image = true;
                  setIsRequired(nIR);
                }}
              />
            </IKContext>
            <p>{message}</p>
            <br />
            <br />
            <h1>Description</h1>
            <div style={{ margin: "0% 10%" }}>
              <Editor
                apiKey={editorAPIkey}
                onInit={(evt, editor) => (editorRef.current = editor)}
                initialValue="<p>This should describe your note. Try to keep it under 200 characters to get more engagement.</p>"
                init={{
                  height: 500,
                  menubar: false,
                  toolbar:
                    "undo redo | casechange blocks | bold italic underline backcolor| " +
                    "alignleft aligncenter alignright alignjustify| " +
                    "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
                  content_style:
                    "body { font-family:Rubik,Arial,sans-serif; font-size:16px }",
                }}
              />
            </div>
            <br />
            <br />
            <StyledButton onClick={submit}>
              Create note!
            </StyledButton>
            <br />
            <br />
            <StyledButton
              onClick={() => router.push("/main")}
            >
              Cancel
            </StyledButton>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </div>
        </div>
      </>
    );
  }
}

export const getServerSideProps = async (ctx) => {
  var orgDataRequests =
    await sql`SELECT * from organisations WHERE id=${ctx.req.cookies.org}`;
  var grades = [];
  var subjects = [];
  var gradeObjects = JSON.parse(orgDataRequests.rows[0].grades);
  var subjectObjects = JSON.parse(orgDataRequests.rows[0].subjects);
  var userDataREQ =
    await sql`SELECT * from users WHERE uuid=${ctx.req.cookies.useruuid} AND org=${ctx.req.cookies.org}`;
  //find if user has exceeded storage
  var storage = userDataREQ.rows[0].storage;
  var outOfStorage = storage >= 10000000 ? true : false;
  return {
    props: {
      gradesObj: gradeObjects,
      subjectsObj: subjectObjects,
      prefMode: ctx.req.cookies.mode == "true" ? true : false,
      userd: userDataREQ.rows[0],
      isTeacher: userDataREQ.rows[0].teacher,
      outOfStorage: outOfStorage,
    },
  };
};
