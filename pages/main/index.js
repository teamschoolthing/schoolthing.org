import Head from "next/head";
import styles from "./Main.module.scss";
import {backendURL, editorAPIkey, productName, thisURL} from "../../resources/strings.js";
import Cookies from "universal-cookie";
import Link from "next/link";
import * as JsSearch from "js-search";
import { validate as uuidValidate } from "uuid";
import Image from "next/image";
import md5 from "md5";
import { v4 as uuidv4 } from "uuid";
import {
  comprehendOrdinal,
  convertDateWithoutTime,
  formatNumberIntoReadable,
  convertDate,
  base64ToUint8Array,
} from "../../components/utils.js";
import { sql } from "@vercel/postgres";
var logo = "/favicon.ico";
import { Editor } from "@tinymce/tinymce-react";
import { AvatarComponent } from "avatar-initials";
import { DarkModeSwitch } from "react-toggle-dark-mode";
var lDim = 48;
import heartIcon from "../../public/icons/heart.png";
import Modal from "react-modal";
const cookies = new Cookies();
import {
  Home,
  Coin,
  SignOut,
  Edit,
  AlignLeft,
  Fire,
  Bell,
  Cross,
  Gear,
  Heart,
  MoreVerticalFill,
  ShareBox,
  ArrowCycle,
  TrashCan,
  Bug,
  ThreeLineHorizontal,
  Plant,
  BookOpen,
  PaperAirplane,
  Wallet,
  ChatBubble,
  ChevronLeft,
  TriangleAlertFill,
  Pencil,
  PanelLeft,
  PeopleGroup,
} from "akar-icons";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Main({
  redirect,
  userdata,
  searchval,
  infoData,
  ldrData,
  ldrPlace,
  userEmails,
  trendingNotes,
  noticeData,
  userPreferMode,
  userPreferColor,
  getRandomPost,
}) {
  function decipherPostTimestamp(timestamp) {
    var dObj = new Date(parseInt(timestamp));
    var currentDate = new Date();
    var diff = currentDate.getTime() - dObj.getTime();
    var diffDays = Math.floor(diff / (1000 * 3600 * 24));
    var diffHours = Math.floor(diff / (1000 * 3600));
    var diffMinutes = Math.floor(diff / (1000 * 60));
    var diffSeconds = Math.floor(diff / 1000);
    if (diffDays > 0) {
      if (diffDays > 7) {
        return `${Math.round(diffDays / 7)} week${
          Math.round(diffDays / 7) == 1 ? "" : "s"
        } ago`;
      } else {
        return `${diffDays} day${diffDays == 1 ? "" : "s"} ago`;
      }
    } else if (diffHours > 0) {
      return `${diffHours} hour${diffHours == 1 ? "" : "s"} ago`;
    } else if (diffMinutes > 0) {
      return `${diffMinutes} minute${diffMinutes == 1 ? "" : "s"} ago`;
    } else if (diffSeconds > 0) {
      return `${diffSeconds} second${diffSeconds == 1 ? "" : "s"} ago`;
    } else {
      return "just now";
    }
  }
  var [showCreatePost, setShowCreatePost] = useState(false);
  var [emoji, setEmoji] = useState(
    "😀 😃 😄 😁 😆 😅 😂 🤣 😊 😇 🙂 🙃 😉 🤪 🤨 🧐 🤓 😎 🤩 🥳 😏 😒 😞 😢 😭 😤 😠 😡 🤯 😳 🥵 🥶 😱 😨 😥 😓 🤔 🤭 🤫 🤥 😶 😐 😑 😬 🙄 😯 😦 😧 😮 😲 🥱 😴 🤤 😪 😵 🤐 🥴 🤧 😷 🤒 🤕 🤑 🤠 😈 👿 👹 🤡 👻 💀 👽 👾 🤖 🎃".split(
      " "
    )
  );
  function generateRandomEmoji() {
    return emoji[Math.floor(Math.random() * emoji.length)];
  }
  var [colorArray, setColorArray] = useState([
    "Mint (default):#80D7E0&white",
    "Tangerine:#E9AA95&white",
    "Banana:#E9CA95&white",
    "Fern:#A3BEB4&white",
    "Sapphire:#A8BED2&white",
    "Plum:#ACACCB&white",
    "Watermelon:#EDB9AF&white",
  ]);
  var [accentColor, setAccentColor] = useState(
    colorArray[userPreferColor].split(":")[1]
  );
  function StyledLink(props) {
    delete props?.style?.color;

    return (
      <a
        style={{
          color: accentColor.split("&")[0],
          cursor: "pointer",
          ...props.style,
        }}
        {...props}
      >
        {props.children}
      </a>
    );
  }
  function Divider() {
    return (
      <>
        <br />
        <hr
          style={{
            width: "80%",
            height: `2px`,
            border: `1px solid ${accentColor.split("&")[0]}`,
            borderRadius: "15px",
            background: accentColor.split("&")[0],
          }}
        />
        <br />
      </>
    );
  }
  function roughSizeOfObject(object) {
    var objectList = [];
    var stack = [object];
    var bytes = 0;

    while (stack.length) {
      var value = stack.pop();

      if (typeof value === "boolean") {
        bytes += 4;
      } else if (typeof value === "string") {
        bytes += value.length * 2;
      } else if (typeof value === "number") {
        bytes += 8;
      } else if (
        typeof value === "object" &&
        objectList.indexOf(value) === -1
      ) {
        objectList.push(value);

        for (var i in value) {
          stack.push(value[i]);
        }
      }
    }
    return bytes;
  }

  function StyledButton(props) {
    delete props?.style?.background;
    delete props?.style?.color;
    return (
      <button
        onClick={props.onClick}
        style={{
          background: accentColor.split("&")[0],
          color: accentColor.split("&")[1],
          cursor: "pointer",
          boxShadow: `0 0 10px 1px ${accentColor.split("&")[0]}`,
          //glow and change size on hover
          transition: "transform 0.4s ease-in-out",
          "&:focus": {
            outline: "none",
            transform: "scale(1.01)",
            transition: "0.5s",
          },

          ...props.style,
        }}
      >
        {props.children}
      </button>
    );
  }
  if (redirect == "/home") {
    return (
      <div>
        <div style={{ textAlign: "center" }}>
          <br />
          <br />
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "10% 80%",
              margin: "20px 0px",
            }}
          >
            {" "}
            <Link href="/">
              <ChevronLeft
                size={36}
                style={{
                  verticalAlign: "middle",
                  cursor: "pointer",
                  margin: "auto",
                }}
              />
            </Link>
            <h2
              style={{
                verticalAlign: "middle",
                margin: "auto",
              }}
            >
              <img
                src="/icons/loadingLogo.png"
                width={64}
                height={64}
                style={{ verticalAlign: "middle", marginRight: "10px" }}
                alt={`The ${productName} Developers Logo`}
              />
              {productName}
            </h2>
          </div>
          <br />
          <h1>Oops!</h1>
          <p>
            You are not logged in. Please log in with your Schoolthing account
            to continue.
            <br />
            <button
              onClick={() => {
                cookies.remove("useruuid");
                window.location.href = "/home";
              }}
            >
              Log In
            </button>
          </p>
        </div>
      </div>
    );
  }
  var [pData, setpData] = useState([]);
  var [postUserEmojis, setPostUserEmojis] = useState({});
  const isGlobal = cookies.get("org") == "global" ? true : false;
  var router = useRouter();
  var compiledNotes = {};
  var availableNotices = {};
  var postMessageRef = useRef(null);
  var [currentReplyTextObject, setCurrentReplyTextObject] = useState({});
  function updatecurrentReplyObject(uuid, text) {
    var tempobj = currentReplyTextObject;
    tempobj[uuid] = text;
    setCurrentReplyTextObject(tempobj);
  }
  function getCurrentReplyObject(uuid) {
    return currentReplyTextObject[uuid];
  }
  var postMessageTitleRef = useRef();
  var [mode, setMode] = useState(userPreferMode == "dark" ? "dark" : "light");
  var [currentActionFocus, setCurrentActionFocus] = useState("home");
  const [darkMode, setDarkMode] = useState(
    userPreferMode == "true" ? true : false
  );
  var [iconHighlightStatus, setIconHighlightStatus] = useState({
    home: false,
    leaderboard: false,
    points: false,
    trending: false,
    global: false,
  });
  function changeIconHighlight(target) {
    var tempobj = iconHighlightStatus;
    Object.keys(tempobj).forEach((key) => {
      tempobj[key] = false;
    });
    tempobj[target] = true;
    setIconHighlightStatus(tempobj);
  }
  var iconColor = darkMode == true ? "#fefefe" : "#1B2430";
  var staticIconColor = accentColor.split("&")[1];
  var buttonIconColor = darkMode == true ? "#fefefe" : "#1B2430";
  if (redirect == false) {
    noticeData.forEach((obj) => {
      availableNotices[obj.broadcast] = obj;
    });
  }
  var transferamount = useRef();
  var transfertoemail = useRef();
  var typeOfFeedbackRef = useRef();
  var messageRef = useRef();
  var noteTempData = JSON.parse(userdata.notes);
  noteTempData.forEach((obj) => {
    compiledNotes[obj.uuid] = obj.intent;
  });
  var [state, setState] = useState("");
  var subjectSelect = [
    <option selected disabled>
      Subject
    </option>,
  ];
  var subjectSelectRef = useRef();
  for (var key in infoData.subjects) {
    subjectSelect.push(<option value={key}>{infoData.subjects[key]}</option>);
  }
  var [exitSearch, setExitSearch] = useState(false);
  var [showSidebar, setShowSidebar] = useState(true);
  var [showSearch, setShowSearch] = useState(true);
  var [pointVal, setPointVal] = useState(userdata.points.toLocaleString());
  var noteselectRef = useRef();
  var NewGradeRef = useRef();
  var [showMoreModal, setShowMoreModal] = useState(false);
  var [endMoreModal, setEndModal] = useState(false);
  var [openModal, setOpenModal] = useState(false);
  var [openNoteViewModal, setOpenNoteViewModal] = useState(false);
  var [noteViewContent, setNoteViewContent] = useState(<></>);
  var emptyAllReplyTextRef = useRef();
  var [showDesktopNoteType, setShowDesktopNoteType] = useState(false);
  var [desktopNoteItems, setDesktopNoteItems] = useState(
    <div className={styles.desktopnoteTypeActions}>
      <div
        className={styles.desktopnoteTypeActionItem}
        onClick={() => {
          getNotes("allNotes");
        }}
      >
        <p style={{ display: "inline", fontSize: "20px" }}>All Notes</p>
      </div>
      <div className={styles.desktopnoteTypeSelectItem}>
        <p>
          <select
            onChange={() => {
              getNotes(subjectSelectRef.current.value);
            }}
            ref={subjectSelectRef}
            style={{ display: "inline", fontSize: "20px" }}
          >
            {subjectSelect}
          </select>
        </p>
      </div>
      <div
        className={styles.desktopnoteTypeActionItem}
        onClick={() => {
          getNotes("purchNotes");
        }}
      >
        <p style={{ display: "inline", fontSize: "20px" }}>Purchased Notes</p>
      </div>

      <div
        className={styles.desktopnoteTypeActionItem}
        onClick={() => {
          getNotes("yourNotes");
        }}
      >
        <p style={{ display: "inline", fontSize: "20px" }}>My Notes</p>
      </div>
    </div>
  );
  //posStates

  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      zIndex: "2000",
      backdropFilter: "blur(5px)",
      overflow: "unset",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      borderRadius: "15px",
      width: "80%",
      backdropFilter: "blur(300px)",
      backgroundColor: darkMode == true ? "#121212" : "#fefefe",
      color: darkMode == true ? "#fefefe" : "#121212",
    },
  };
  const noteViewStyle = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      zIndex: "2000",
      backdropFilter: "blur(5px)",
      overflow: "unset",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      borderRadius: "15px",
      padding: "0px",
      width: "95%",
      backdropFilter: "blur(300px)",
      backgroundColor: darkMode == true ? "#121212" : "#fefefe",
      color: darkMode == true ? "#fefefe" : "#121212",
    },
  };
  const moreModalSettings = {
    overlay: {
      backgroundColor: darkMode ? "rgba(0,0,0, 0.9)" : "rgba(254,254,254, 0.9)",
      zIndex: "2000",
      backdropFilter: "blur(2px)",
      overflow: "unset",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(30%, -125%)",
      background: null,
      borderRadius: "15px",
      textAlign: "right",
      border: "none",
      color: darkMode == true ? "#fefefe" : "#121212",
    },
  };

  var [noteState, setNoteState] = useState(true);
  var [showNoteType, setShowNoteType] = useState(true);
  var [originalContent, setOriginalContent] = useState({});
  var [modalContent, setModalContent] = useState();
  var [desktopNoteState, setDesktopNoteState] = useState();
  function ErrorInfo(props) {
    return (
      <>
        <Cross
          size={32}
          color={accentColor.split("&")[0]}
          onClick={() => {
            setOpenModal(false);
          }}
          style={{
            float: "right",
            cursor: "pointer",
          }}
        />
        <br />
        <TriangleAlertFill size={48} color="red" />
        <br />
        <p>
          Something went wrong! The {productName} team has been alerted and is
          working to resolve the issue. Please try again later. If the issue
          persists, email{" "}
          <StyledLink
            href={`mailto:support@schoolthing.org?subject=I'm%20facing%20an%20error%20on%${productName}`}
          >
            support@schoolthing.org
          </StyledLink>
          <br />
          <br />
          <div
            style={{
              fontFamily: "monospace",
              padding: "10px",
              borderRadius: "15px",
              width: "fit-content",
              margin: "auto",
              textAlign: "center",
              color: "white",
              background: "black",
            }}
          >
            {props.children.toString()}
          </div>
        </p>
      </>
    );
  }

  var loadingIcon = (
    <>
      <ArrowCycle
        strokeWidth={2}
        size={28}
        className={`${styles.icon} ${styles.loadingIcon}`}
        color={iconColor}
        style={{ margin: "auto" }}
      />
      <br />
    </>
  );
  var isMount = false;
  var canShowMain = true;
  var canShowB = true;
  var [showReplies, setShowReplies] = useState({});
  const content = useRef();
  const pointsText = useRef();
  const pointsTextM = useRef();
  const notesRef = useRef();
  const searchRef = useRef();
  const searchMobileRef = useRef();
  const NewFnameRef = useRef();
  const NewLnameRef = useRef();
  const NewBioRef = useRef(null);
  function deleteNote(uuid) {
    setModalContent(
      <>
        <h1>{loadingIcon}</h1>
        <p>Loading...</p>
      </>
    );
    setOpenModal(true);
    fetch(`${thisURL}/api/deleteNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        useruuid: cookies.get("useruuid"),
        noteuuid: uuid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <br />
              <h1>Success!</h1>
              <p>Your note has been deleted.</p>
            </>
          );
          setOpenModal(true);
        }
      })
      .catch((err) => {
        setModalContent(<ErrorInfo>{err}</ErrorInfo>);
        setOpenModal(true);
      });
  }
  function showWorksheet() {
    setModalContent(
      <div>
        {loadingIcon}
        <br />
        <span>Loading</span>
      </div>
    );
    setOpenModal(false);
    setState(
      <div>
        <h1>Worksheet</h1>
        <span>No worksheets are added</span>
      </div>
    );
  }

  function temporarilyChangeDetails(record, secondaryChange, updatedValue) {
    //record can be 'fname [DONE]', 'lname [DONE]', 'bio [DONE]', 'class', 'points', 'transfer'
    //if record == 'transfer', secondaryChange is used. secondaryChange is of format {to: 'email', amount: 'amount'}

    if (record != "transfer" && record != "points") {
      var toBeUpdatedUserData = ldrData.filter(
        (obj) => obj.uuid == userdata.uuid
      )[0];
      var toBeUpdatedLdrData = ldrData;
      toBeUpdatedUserData[record] = updatedValue;
      toBeUpdatedLdrData[ldrData.indexOf(toBeUpdatedUserData)] =
        toBeUpdatedUserData;
      userdata[record] = updatedValue;
      ldrData = toBeUpdatedLdrData;
    } else if (record == "points") {
      var toBeUpdatedUserData = ldrData.filter(
        (obj) => obj.uuid == userdata.uuid
      )[0];
      var toBeUpdatedLdrData = ldrData;
      toBeUpdatedUserData.points = userdata.points - parseInt(updatedValue);
      userdata.points = userdata.points - parseInt(updatedValue);
      toBeUpdatedLdrData[ldrData.indexOf(toBeUpdatedUserData)] =
        toBeUpdatedUserData;
      ldrData = toBeUpdatedLdrData;
    } else if (record == "transfer") {
      var toBeUpdated_targetData = ldrData.filter(
        (obj) => obj.email == secondaryChange.to
      )[0];
      var toBeUpdated_userData = ldrData.filter(
        (obj) => obj.uuid == userdata.uuid
      )[0];
      var toBeUpdatedLdrData = ldrData;
      toBeUpdated_targetData.points =
        toBeUpdated_targetData.points + secondaryChange.amount;
      toBeUpdated_userData.points =
        toBeUpdated_userData.points - secondaryChange.amount;
      toBeUpdatedLdrData[ldrData.indexOf(toBeUpdated_targetData)] =
        toBeUpdated_targetData;
      toBeUpdatedLdrData[ldrData.indexOf(toBeUpdated_userData)] =
        toBeUpdated_userData;
      ldrData = toBeUpdatedLdrData;
      userdata.points = userdata.points - secondaryChange.amount;
      var userfeed = JSON.parse(userdata.feed);
      userfeed.push({
        message: `${toBeUpdated_targetData.fname} has been sent ${secondaryChange.amount} points`,
        timestamp: Date.now(),
      });
      userdata.feed = JSON.stringify(userfeed);
    }
  }

  function feedback() {
    changeIconHighlight("feedback");
    setNoteState(false);
    function submitFeedback() {
      setModalContent(
        <>
          {loadingIcon}
          <h1>Submitting...</h1>
        </>
      );
      setOpenModal(true);
      var typeOfFeedback = typeOfFeedbackRef.current.value;
      var message = messageRef.current.value;
      if (message.trim() != "") {
        fetch(`${thisURL}/api/feedback`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            useruuid: cookies.get("useruuid"),
            type: typeOfFeedback,
            message: message,
            org: cookies.get("org"),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            setModalContent(
              <>
                <Cross
                  size={32}
                  color={accentColor.split("&")[0]}
                  onClick={() => {
                    setOpenModal(false);
                  }}
                  style={{
                    float: "right",
                    cursor: "pointer",
                  }}
                />
                <br />
                <h1>:)</h1>
                <p>
                  Your feedback has been submitted. Thank you for helping
                  Schoolthing improve!
                </p>
              </>
            );
            setOpenModal(true);
          })
          .catch((error) => {
            setModalContent(<ErrorInfo>{error}</ErrorInfo>);
            setOpenModal(true);
          });
      } else {
        setModalContent(
          <>
            <Cross
              size={32}
              color={accentColor.split("&")[0]}
              onClick={() => {
                setOpenModal(false);
              }}
              style={{
                float: "right",
                cursor: "pointer",
              }}
            />
            <br />
            <h1>Error :(</h1>
            <p>You can't submit an empty feedback form!</p>
          </>
        );
        setOpenModal(true);
      }
    }
    setState(
      <>
        <h2>Feedback</h2>
        <br />
        <br />
        <h3>Select type of feedback</h3>
        <select ref={typeOfFeedbackRef}>
          <option value="Feature Request">Feature request</option>
          <option value="Bug Report">Bug Report</option>
          <option value="Other">Other</option>
        </select>
        <br />
        <br />
        <h3>Comments</h3>
        <textarea
          style={{ border: "none" }}
          ref={messageRef}
          rows={15}
        ></textarea>
        <br />
        <br />
        <StyledButton onClick={submitFeedback}>Submit</StyledButton>
      </>
    );
  }
  function settings() {
    changeIconHighlight("settings");
    setNoteState(false);
    setShowSearch(false);

    function changeName() {
      setModalContent(
        <>
          {loadingIcon}
          <h1>Loading...</h1>
        </>
      );
      setOpenModal(true);
      var newFname = NewFnameRef.current.value;
      var newLname = NewLnameRef.current.value;
      if (newFname.trim() == "" && newLname.trim() == "") {
        return;
      } else {
        fetch(`${thisURL}/api/editData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            useruuid: cookies.get("useruuid"),
            fname: newFname,
            lname: newLname,
            toChange: "name",
          }),
        })
          .then((res) => {
            setModalContent(
              <>
                <Cross
                  size={32}
                  color={accentColor.split("&")[0]}
                  onClick={() => {
                    setOpenModal(false);
                  }}
                  style={{
                    float: "right",
                    cursor: "pointer",
                  }}
                />
                <br />
                <h1>Success!</h1>
                <p>
                  Your name has been changed. If you left any of the fields
                  blank, they were not changed.
                </p>
              </>
            );
            setOpenModal(true);
            temporarilyChangeDetails("fname", null, newFname);
            temporarilyChangeDetails("lname", null, newLname);
          })
          .catch((error) => {
            setModalContent(<ErrorInfo>{error}</ErrorInfo>);
            setOpenModal(true);
          });
      }
    }

    function changeBio() {
      setModalContent(
        <>
          {loadingIcon}
          <h1>Loading...</h1>
        </>
      );
      setOpenModal(true);
      var newBio = NewBioRef.current.getContent();
      if (newBio.trim() == "") {
        return;
      } else {
        fetch(`${thisURL}/api/editData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            useruuid: cookies.get("useruuid"),
            bio: newBio,
            toChange: "bio",
          }),
        })
          .then((res) => {
            setModalContent(
              <>
                <Cross
                  size={32}
                  color={accentColor.split("&")[0]}
                  onClick={() => {
                    setOpenModal(false);
                  }}
                  style={{
                    float: "right",
                    cursor: "pointer",
                  }}
                />
                <br />
                <h1>Success!</h1>
                <p>
                  Your bio has been changed. If you left the field blank, it was
                  not changed.
                </p>
              </>
            );
            setOpenModal(true);
            temporarilyChangeDetails("bio", null, newBio);
          })
          .catch((error) => {
            setModalContent(<ErrorInfo>{error}</ErrorInfo>);
            setOpenModal(true);
          });
      }
    }
    function changeGrade() {
      setModalContent(
        <>
          {loadingIcon}
          <h1>Loading...</h1>
        </>
      );
      setOpenModal(true);
      var newGrade = NewGradeRef.current.value;
      if (newGrade.trim() == "") {
        return;
      } else {
        fetch(`${thisURL}/api/editData`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            useruuid: cookies.get("useruuid"),
            grade: newGrade,
            toChange: "grade",
            org: cookies.get("org"),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.status == "success") {
              setModalContent(
                <>
                  <Cross
                    size={32}
                    color={accentColor.split("&")[0]}
                    onClick={() => {
                      setOpenModal(false);
                    }}
                    style={{
                      float: "right",
                      cursor: "pointer",
                    }}
                  />
                  <br />
                  <h1>Success!</h1>
                  <p>Your grade has been changed!</p>
                </>
              );
              setOpenModal(true);
              temporarilyChangeDetails("class", null, newGrade);
            } else {
              setModalContent(
                <>
                  <TriangleAlertFill size={48} color="red" />
                  <br />
                  <p>
                    Something went really wrong! Please try again later or email
                    support@schoolthing.org
                  </p>
                  <StyledButton
                    onClick={() => {
                      router.reload();
                    }}
                  >
                    Close
                  </StyledButton>
                </>
              );
              setOpenModal(true);
            }
          })
          .catch((error) => {
            setModalContent(<ErrorInfo>{error}</ErrorInfo>);
            setOpenModal(true);
          });
      }
    }
    var getGrades = [];
    for (var key in infoData.grades) {
      getGrades.push(<option value={key}>{infoData.grades[key]}</option>);
    }
    function setUserColor(color) {
      setAccentColor(colorArray[color].split(":")[1]);
      updateColor(color);
    }

    setState(
      <div style={{ padding: "10px" }}>
        <h1>Settings</h1>
        <br />
        <StyledButton
          onClick={() => {
            cookies.remove("useruuid");
            window.location.href = "/home";
          }}
        >
          <SignOut className={styles.icon} color={staticIconColor} size={24} />
          Log Out
        </StyledButton>
        <br />
        <br />
        <h2>Profile</h2>
        <AvatarComponent
          classes="avatar"
          useGravatar={true}
          useGravatarFallback={true}
          fallback="retro"
          rating="g"
          size="128"
          style={{
            width: "100px",
          }}
          email={userdata.email || "e"}
        />
        <br />
        <br />
        <p style={{ textAlign: "center", margin: "auto" }}>
          {productName} supports Gravatar for profile pictures.
          <br />
          <br /> If you don't have a Gravatar account, you can{" "}
          <StyledLink
            href="https://en.gravatar.com/site/signup"
            target="_blank"
          >
            sign up here
          </StyledLink>{" "}
          with the same email you use for {productName}, ({userdata.email}) to
          change your profile picture.
        </p>
        <StyledButton
          onClick={() => {
            getUserData(userdata.uuid, infoData.name);
          }}
        >
          View your Profile
        </StyledButton>
        <h2>Styles</h2>
        <p>Choose from a list of colours to make Schoolthing your own!</p>
        {/*
         */}
        &nbsp;&nbsp;
        {colorArray.map((color, index) => {
          var colorName = color.split(":")[0];
          var colorCode = color.split(":")[1].split("&")[0];
          var textColor = color.split(":")[1].split("&")[1];
          return (
            <>
              <button
                onClick={() => {
                  setUserColor(index);
                }}
                style={{
                  background: colorCode,
                  color: textColor,
                }}
              >
                {colorName}
              </button>
              &nbsp;&nbsp;
            </>
          );
        })}
        <br />
        <Divider />
        <br />
        <h2>Change details</h2>
        If you leave any of these fields blank, they will not be changed.
        <br />
        <h3>Change Name</h3>
        <input
          type="text"
          placeholder="First Name"
          defaultValue={userdata.fname}
          ref={NewFnameRef}
          style={{ width: "80%" }}
        />
        <br />
        <br />
        <input
          type="text"
          placeholder="Last Name"
          defaultValue={userdata.lname}
          ref={NewLnameRef}
          style={{ width: "80%" }}
        />
        <br />
        <StyledButton onClick={changeName}>Change Name</StyledButton>
        <br />
        <h3>Change Bio</h3>
        <div
          style={{
            width: "80%",
            margin: "auto",
          }}
        >
          <Editor
            apiKey={editorAPIkey}
            onInit={(evt, editor) => (NewBioRef.current = editor)}
            initialValue={userdata.bio}
            init={{
              height: 200,
              menubar: false,
              plugins: "link",
              toolbar:
                "undo redo | casechange blocks | bold italic underline backcolor| " +
                "alignleft aligncenter alignright alignjustify| " +
                "bullist numlist checklist outdent indent link | removeformat | a11ycheck code table help",
              content_style:
                "body { font-family:Rubik,Arial,sans-serif; font-size:16px }",
            }}
          />
        </div>
        <br />
        <br />
        <StyledButton onClick={changeBio}>Change Bio</StyledButton>
        <br />
        {isGlobal ? null : (
          <>
            {" "}
            <h3>Change Grade</h3>
            <select
              defaultValue={userdata.class}
              ref={NewGradeRef}
              style={{ width: "50%" }}
            >
              {getGrades}
            </select>
            <br />
            <StyledButton onClick={changeGrade}>Change Grade</StyledButton>
            <br />
            <br />{" "}
          </>
        )}
        <br />
        <Divider />
        <div>
          <h2 style={{ verticalAlign: "middle", display: "inline" }}>
            Notifications
          </h2>
          {"  "}
          <div
            style={{
              background: accentColor.split("&")[0],
              color: accentColor.split("&")[1],
              borderRadius: "20px",
              textTransform: "lowercase",
              fontFamily: "monospace",
              fontSize: "14px",
              width: "fit-content",
              padding: "5px 10px",
              display: "inline",
              verticalAlign: "middle",
            }}
          >
            beta
          </div>
        </div>
        <br />
        <p>
          Notifications are currently in beta. <br />
          <br />
          If anything goes wrong, you can test them in the console below. If you
          have any feedback, please email{" "}
          <StyledLink href={`mailto:support@schoolthing.org`}>
            support@schoolthing.org
          </StyledLink>
        </p>
        <br />
        <div
          className={styles.adjustWidth}
          style={{
            borderRadius: "20px",
            boxShadow: `0 0 10px 4px #e5e5e5`,
            backgroundColor: "rgba(255, 255, 255, 1)",
            backdropFilter: "blur(15px)",
            padding: "10px",
            margin: "auto",
            width: "80%",
          }}
        >
          <p
            style={{
              textAlign: "center",
              fontFamily: "Menlo",
              color: "lightgrey",
            }}
          >
            notification console
          </p>
          <StyledButton onClick={askPermission}>
            Request Permission
          </StyledButton>
          &nbsp;&nbsp;
          <StyledButton onClick={subscribeUserToPush}>Subscribe</StyledButton>
          &nbsp;&nbsp;
          <StyledButton onClick={unsubscribeUser}>Unsubscribe</StyledButton>
          &nbsp;&nbsp;
          <StyledButton onClick={testPushMessage}>
            Test Push Message
          </StyledButton>
        </div>
        <br />
        <br />
        <br />
      </div>
    );
  }

  function updateColor(colorIndex) {
    userdata.accentcolor = colorIndex;
    fetch(`${thisURL}/api/updateColor`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        uuid: userdata.uuid,
        color: colorIndex,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") {
          loadMain();
        }
      })
      .catch((err) => {
        setModalContent(<ErrorInfo>{err}</ErrorInfo>);
        setOpenModal(true);
      });
  }
  function getUserData(uuid, org) {
    setModalContent(
      <>
        {loadingIcon}
        <br />
        <span>Fetching user data</span>
      </>
    );
    setOpenModal(true);
    //fname, lname, org, points, class, bio
    fetch(`${thisURL}/api/getUserData`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        uuid: uuid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        var details = data.data;
        if (data.status == "success") {
          setModalContent(
            <div>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <div style={{ margin: "auto" }}>
                <img
                  src="icons/loadingLogo.png"
                  width={48}
                  height={48}
                  style={{ verticalAlign: "middle" }}
                />
                <p style={{ display: "inline", fontSize: "24px" }}>
                  {" "}
                  {org}
                </p>
              </div>

              <div className={styles.profileArrange}>
                <div style={{ textAlign: "left" }}>
                  <h2 style={{ fontSize: "32px" }}>
                    {details.fname} {details.lname}
                  </h2>

                  <span
                    style={{
                      color: "lightgrey",
                    }}
                  >
                    points
                  </span>
                  <br />
                  <span style={{ fontSize: "28px" }}>
                    <Coin size={24} className={styles.icon} />{" "}
                    {details.points.toLocaleString()}
                  </span>
                  <br />
                  <span
                    style={{
                      fontSize: "18px",
                      color: accentColor.split("&")[0],
                      cursor: "pointer",
                    }}
                    onClick={() => {
                      transferToCertainEmail(
                        details.email,
                        `${details.fname} ${details.lname}`
                      );
                    }}
                  >
                    Send Points
                  </span>
                  <br />
                  <br />
                  <span
                    style={{
                      color: "lightgrey",
                    }}
                  >
                    {details.bio.trim() != "" ? "bio" : null}
                  </span>
                  <br />
                  <span dangerouslySetInnerHTML={{ __html: details.bio }} />
                </div>
                <div>
                  <AvatarComponent
                    classes="avatar"
                    useGravatar={true}
                    useGravatarFallback={true}
                    fallback="retro"
                    size={256}
                    rating="g"
                    email={details.email || ""}
                  />
                </div>
              </div>
            </div>
          );
          setOpenModal(true);
        } else {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <br />
              <TriangleAlertFill size={48} color="red" />
              <br />
              <h2>Oops!</h2>
              <p>User details could not be loaded. Please try again later.</p>
              <br />
            </>
          );
          setOpenModal(true);
        }
      })
      .catch((err) => {
        setModalContent(<ErrorInfo>{err}</ErrorInfo>);
        setOpenModal(true);
      });
  }
  function openPosts(reload = true, showReloadModal = true) {
    changeIconHighlight("posts");
    if (pData.length === 0 || reload === true) {
      /* setModalContent(
        <>
          <h1>{loadingIcon}</h1>
          <p>Loading posts...</p>
        </>
      );*/
      if (showReloadModal === true) {
        setState(
          <div
            style={{
              textAlign: "center",
              verticalAlign: "middle",
            }}
          >
            <h1>{loadingIcon}</h1>
            <p>Loading posts...</p>
          </div>
        );
      }
      //setOpenModal(showReloadModal);
      fetch(`${thisURL}/api/getPosts`, {
        method: "GET",
      })
        .then((res) => res.json())
        .then((data) => {
          var posts = data.posts;
          posts.sort((a, b) => {
            return parseInt(b.timestamp) - parseInt(a.timestamp);
          });
          var uniqueUserUUIDs = {};
          var allPostUUIDs = {};
          posts.forEach((obj) => {
            uniqueUserUUIDs[obj.authoruuid] = true;
            var replies = JSON.parse(obj.replies);
            replies.forEach((obj) => {
              uniqueUserUUIDs[obj.authoruuid] = true;
            });
            allPostUUIDs[obj.uuid] = false;
          });
          setShowReplies(allPostUUIDs);
          setOpenModal(false);
          setpData(posts);
          showPosts(posts);
        })
        .catch((err) => {
          setModalContent(<ErrorInfo>{err}</ErrorInfo>);
          setOpenModal(true);
        });
    } else {
      showPosts(pData);
    }
    function replyTo(postDataset, uuid) {
      var getIndexOfPost = 0;
      postDataset.forEach((obj, index) => {
        if (obj.uuid == uuid) {
          getIndexOfPost = index;
        }
      });
      var post = postDataset[getIndexOfPost];
      var replies = JSON.parse(post.replies);
      var replyObject = {
        authoruuid: userdata.uuid,
        timestamp: Date.now(),
        likes: 0,
        username: userdata.fname + " " + userdata.lname,
        org: infoData.name,
        postuuid: uuid,
        content: getCurrentReplyObject(uuid),
        email: userdata.email,
      };
      replies.push(replyObject);
      var localPData = postDataset;
      localPData[getIndexOfPost].replies = JSON.stringify(replies);
      var tempobj = showReplies;
      tempobj[uuid] = true;
      setShowReplies(tempobj);

      setpData(localPData);
      showPosts(localPData);
      fetch(`${thisURL}/api/replyToPost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          useruuid: cookies.get("useruuid"),
          username: userdata.fname + " " + userdata.lname,
          org: infoData.name,
          postuuid: uuid,
          content: getCurrentReplyObject(uuid),
          email: userdata.email,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("ScXSync done");
        })
        .catch((err) => {
          setModalContent(<ErrorInfo>{err}</ErrorInfo>);
          setOpenModal(true);
        });
    }
    function manageLikePost(postDataset, objUUID, hasLiked) {
      var ind = 0;
      postDataset.forEach((obj, index) => {
        if (obj.uuid == objUUID) {
          ind = index;
          return;
        }
      });
      var localPData = postDataset;
      var likes = JSON.parse(localPData[ind].likes);
      if (likes.includes(userdata.uuid)) {
        likes.splice(likes.indexOf(userdata.uuid), 1);
      } else {
        likes.push(userdata.uuid);
      }
      localPData[ind].likes = JSON.stringify(likes);
      setpData(localPData);
      showPosts(localPData);
      fetch(`${thisURL}/api/likePost`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          useruuid: cookies.get("useruuid"),
          postuuid: objUUID,
          like: hasLiked,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("ScXSync done");
        });
    }
    function postMessage() {
      if (
        postMessageTitleRef.current.value.trim() == "" ||
        postMessageRef.current.getContent().trim() == ""
      ) {
        setModalContent(
          <>
            <Cross
              size={32}
              color={accentColor.split("&")[0]}
              onClick={() => {
                openPostCreationModal();
              }}
              style={{
                float: "right",
                cursor: "pointer",
              }}
            />
            <br />
            <h1>Error :(</h1>
            <p>
              You can't post an empty{" "}
              {postMessageTitleRef.current.value.trim() == ""
                ? "title"
                : "post"}
              !
            </p>
          </>
        );
        setOpenModal(true);
      } else {
        var data = {
          title: postMessageTitleRef.current.value,
          username: userdata.fname + " " + userdata.lname,
          authoruuid: cookies.get("useruuid"),
          org: infoData.name,
          content: postMessageRef.current.getContent(),
          email: userdata.email,
        };
        setModalContent(
          <>
            <h1>{loadingIcon}</h1>
            <p>Posting...</p>
          </>
        );
        setOpenModal(true);
        fetch(`${thisURL}/api/postMessage`, {
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
                <Cross
                  size={32}
                  color={accentColor.split("&")[0]}
                  onClick={() => {
                    openPosts(true, false);
                  }}
                  style={{
                    float: "right",
                    cursor: "pointer",
                  }}
                />
                <br />
                <h1>Done!</h1>
                <p>Your post has been posted!</p>
              </>
            );
            setOpenModal(true);
          })
          .catch((err) => {
            setModalContent(<ErrorInfo>{err}</ErrorInfo>);
            setOpenModal(true);
          });
      }
    }
    function openPostCreationModal() {
      setModalContent(
        <div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <img src="icons/loadingLogo.png" width={48} height={48} />
            <span style={{ fontSize: "28px" }}>Create Post</span>
            <Cross
              size={38}
              className={styles.icon}
              color={accentColor.split("&")[0]}
              onClick={() => {
                setOpenModal(false);
              }}
              style={{
                verticalAlign: "middle",
                cursor: "pointer",
              }}
            />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "80% 20%" }}>
            <input
              type="text"
              placeholder="Add a title!"
              style={{
                width: "80%",
                border: "none",
                outline: "none",
                boxShadow: "none",
                background: "none",
                padding: "5px",
                margin: "5px",
                borderBottom: "1px solid #e5e5e5",
                borderRadius: "0",
                color: darkMode ? "white" : "black",
              }}
              ref={postMessageTitleRef}
            />
            <StyledButton
              onClick={() => {
                postMessage();
              }}
            >
              <PaperAirplane
                size={24}
                color={staticIconColor}
                className={styles.icon}
              />
            </StyledButton>
          </div>
          <br />
          <Editor
            apiKey={editorAPIkey}
            onInit={(evt, editor) => (postMessageRef.current = editor)}
            initialValue="<p>Say something!</p>"
            init={{
              height: 200,
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
      );
      setOpenModal(true);
    }

    function showPosts(dataset) {
      setpData(dataset);
      var currentReplyText = "";
      var postOutput = [];
      dataset.forEach((obj) => {
        var replies = JSON.parse(obj.replies);
        var likes = JSON.parse(obj.likes);
        postOutput.push(
          <>
            <div
              style={{
                border: "1px solid #e5e5e5",
                borderRadius: "20px",
                boxShadow: "0 0 10px 1px #e5e5e5",
                backdropFilter: "blur(15px)",
                padding: "20px",
                textAlign: "left",
                width: "80%",
                margin: "auto",
              }}
            >
              <StyledLink
                onClick={() => {
                  getUserData(obj.authoruuid, obj.org);
                }}
                style={{
                  display: "flex",
                  flexDirection: "row",
                  gap: "10px",
                  cursor: "pointer",
                }}
              >
                <div style={{ verticalAlign: "middle" }}>
                  {/*postUserEmojis[obj.authoruuid]*/}
                   <AvatarComponent
                    classes="avatar"
                    useGravatar={true}
                    useGravatarFallback={true}
                    fallback="retro"
                    size={64}
                    rating="g"
                    email={obj.email || ""}
                  />
                </div>
                <span
                  style={{
                    fontSize: "24px",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <b style={{ color: accentColor.split("&")[0] }}>
                    {obj.username}{" "}
                  </b>
                  <span
                    style={{
                      color: "lightgray",
                      fontSize: "16px",
                    }}
                  >
                    {obj.org}
                  </span>
                </span>
              </StyledLink>
              <br />
              <b style={{ fontSize: "24px", margin: "5px" }} id={obj.uuid}>
                {obj.title}
              </b>
              <p
                style={{ margin: "5px" }}
                dangerouslySetInnerHTML={{
                  __html: obj.content,
                }}
              />
              <br />
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-between",
                  gap: "10px",
                }}
              >
                <div>
                  <div
                    style={{
                      padding: "10px",
                      display: "flex",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: "30px",
                    }}
                  >
                    <span
                      onClick={() => {
                        manageLikePost(dataset, obj.uuid);
                      }}
                    >
                      {likes.includes(userdata.uuid) ? (
                        <img
                          width="24px"
                          height="24px"
                          src="icons/heart.png"
                          style={{
                            verticalAlign: "middle",
                          }}
                        />
                      ) : (
                        <Heart
                          color={iconColor}
                          size={24}
                          style={{ verticalAlign: "middle" }}
                        />
                      )}{" "}
                      {likes.length}
                    </span>
                    <span
                      onClick={() => {
                        var tempobj = showReplies;
                        tempobj[obj.uuid] = !tempobj[obj.uuid];
                        setShowReplies(tempobj);
                        openPosts(false, false);
                      }}
                      style={{
                        textAlign: "right",
                      }}
                    >
                      <ChatBubble
                        size={24}
                        style={{ verticalAlign: "middle" }}
                      />{" "}
                      {replies.length}
                    </span>
                  </div>

                  <i
                    style={{
                      color: "lightgray",
                      marginLeft: "10px",
                    }}
                  >
                    {decipherPostTimestamp(obj.timestamp)}
                  </i>
                </div>
              </div>
            </div>
            <br />
            <div hidden={!showReplies[obj.uuid]}>
              {replies.map((reply) => {
                return (
                  <>
                    <div
                      style={{
                        border: "none",
                        borderRadius: "20px",
                        backdropFilter: "blur(15px)",
                        textAlign: "right",
                        width: "80%",
                        padding: "10px",
                        margin: "auto",
                      }}
                    >
                      <StyledLink
                        style={{
                          display: "flex",
                          flexDirection: "row",
                          gap: "10px",
                          textAlign: "right",
                          cursor: "pointer",
                          float: "right",
                        }}
                      >
                        <span
                          style={{
                            display: "flex",
                            flexDirection: "column",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              color: accentColor.split("&")[0],
                              fontWeight: "bold",
                            }}
                            onClick={() => {
                              getUserData(reply.authoruuid, reply.org);
                            }}
                          >
                            {reply.username}
                          </span>
                          <span style={{ color: "lightgrey" }}>
                            {reply.org}
                          </span>
                          <span style={{ marginTop: "20px" }}>
                            {reply.content}
                          </span>
                          <i style={{ color: "lightgrey" }}>
                            {decipherPostTimestamp(reply.timestamp)}
                          </i>
                        </span>
                        <AvatarComponent
                          classes="avatar"
                          useGravatar={true}
                          useGravatarFallback={true}
                          fallback="retro"
                          size={48}
                          rating="g"
                          email={reply.email || ""}
                        />
                      </StyledLink>
                      <br />
                      <br />
                      <br />
                      <br />
                    </div>

                    <br />
                  </>
                );
              })}
              <br />
              <div
                style={{
                  border: "none",
                  borderRadius: "20px",
                  boxShadow: "none",
                  backdropFilter: "blur(15px)",
                  textAlign: "right",
                  width: "90%",
                }}
              >
                <input
                  type="text"
                  placeholder="Reply to this post!"
                  style={{
                    width: "200px",
                    border: "none",
                    outline: "none",
                    boxShadow: "none",
                    background: "none",
                    padding: "10px",
                    margin: "5px",
                    borderBottom: "1px solid #e5e5e5",
                    borderRadius: "0",
                    color: darkMode ? "white" : "black",
                  }}
                  onChange={(e) => {
                    updatecurrentReplyObject(obj.uuid, e.target.value);
                  }}
                  onFocus={(e) => {
                    updatecurrentReplyObject(obj.uuid, e.target.value);
                  }}
                  ref={emptyAllReplyTextRef}
                />
                <StyledButton
                  onClick={() => {
                    replyTo(dataset, obj.uuid);
                  }}
                >
                  <PaperAirplane size={24} color={staticIconColor} />
                </StyledButton>
              </div>
            </div>

            <br />
          </>
        );
      });

      setState(
        <div style={{ marginTop: "-30px" }}>
          <h1>Posts</h1>
          <StyledButton
            onClick={() => {
              openPostCreationModal();
            }}
          >
            <PaperAirplane
              size={24}
              color={staticIconColor}
              className={styles.icon}
            />
            &nbsp;Create a Post
          </StyledButton>
          <br />
          <br />

          <StyledButton
            onClick={() => {
              openPosts(true);
            }}
            style={{
              border: "1px solid #e5e5e5",
              boxShadow: "0 0 10px 1px #e5e5e5",
              borderRadius: "20px",
            }}
          >
            <ArrowCycle
              size={24}
              color={staticIconColor}
              style={{
                verticalAlign: "middle",
              }}
            />{" "}
            Reload
          </StyledButton>
          <br />
          <br />
          {postOutput}
        </div>
      );
    }
  }
  function transferPoints(transferemail, name) {
    var transferTo = transferemail;
    var transferAmount = transferamount.current.value;
    setModalContent(
      <>
        {loadingIcon}
        <h1>Transferring</h1>{" "}
        <p>
          {transferAmount} points to {name}
        </p>
      </>
    );
    setOpenModal(true);
    var data = {
      uuid: cookies.get("useruuid"),
      points: transferAmount,
      toemail: transferTo,
      org: cookies.get("org"),
    };
    fetch(`${thisURL}/api/transferPoints`, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status == "success") {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  managePoints();
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <br />
              <h1>Done!</h1>{" "}
              <p>
                {transferAmount} points have been transferred out of your
                account to {name}!
              </p>
            </>
          );
          temporarilyChangeDetails(
            "transfer",
            {
              to: transferTo,
              amount: parseInt(transferAmount),
            },
            null
          );
        } else if (json.status == "fail-insuff") {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <br />
              <h1>Error :(</h1>{" "}
              <p>
                You have an insufficient balance, or you entered a negative
                amount.
              </p>
            </>
          );
        } else if (json.status == "fail-500") {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <br />
              <h1>Error :(</h1>{" "}
              <p>The user you are transferring to does not exist.</p>
            </>
          );
        } else if (json.status == "fail-sameuser") {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <br />
              <h1>Error :(</h1> <p>You can't transfer money to yourself!</p>
            </>
          );
        } else {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <br />
              <TriangleAlertFill size={48} color="red" />
              <br />
              <p>
                Something unexpected happened. Please try again later or contact
                support@schoolthing.org if the issue persists.
              </p>
            </>
          );
        }
      })
      .catch((error) => {
        setModalContent(<ErrorInfo>{error}</ErrorInfo>);
        setOpenModal(true);
      });
  }

  function viewNote(
    uuid,
    showReloadModal = true,
    previouslyExistingDataset = null
  ) {
    setShowNoteType(true);
    function viewNoteImageModal(url) {
      setNoteViewContent(
        <>
          <img
            src={url}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              overflow: "hidden",
            }}
          />
        </>
      );
      setOpenNoteViewModal(true);
    }
    function sendReport(noteuuid, userdata) {
      setModalContent(
        <>
          {loadingIcon}
          <h1>Sending Report...</h1>
        </>
      );
      setOpenModal(true);
      fetch(`${thisURL}/api/reportNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          useruuid: cookies.get("useruuid"),
          noteuuid: uuid,
          org: cookies.get("org"),
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          setModalContent(
            <div>
              <h1>Report Sent!</h1>
              <p>
                Your report has been sent to the moderation team and your
                Community admin. Once a decision is made, you will be emailed.
              </p>
              <StyledButton
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Close
              </StyledButton>
            </div>
          );
        });
    }

    function confirmReport(noteuuid, userdata) {
      setModalContent(
        <div>
          <TriangleAlertFill size={36} style={{ margin: "auto" }} />
          <h2>Are you sure?</h2>
          <p>
            When you submit this report, a copy of your information, this note
            and the author's data will be sent to the moderation team and your
            Community admin. Once a decision is made, you will be emailed.
          </p>
          <StyledButton
            onClick={() => {
              setOpenModal(false);
            }}
            style={{
              backgroundColor: "lightgrey",
            }}
          >
            Cancel
          </StyledButton>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <StyledButton
            onClick={() => {
              sendReport(noteuuid, userdata);
            }}
            style={{
              backgroundColor: "red",
            }}
          >
            Continue
          </StyledButton>
        </div>
      );
      setOpenModal(true);
    }
    function likeNote(noteData) {
      var likedNotes = JSON.parse(userdata.liked);
      likedNotes.push(uuid);
      userdata.liked = JSON.stringify(likedNotes);
      paintNoteData(noteData);
      fetch(`${thisURL}/api/likeNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          useruuid: cookies.get("useruuid"),
          noteuuid: uuid,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("liked note");
        });
    }

    if (previouslyExistingDataset == null) {
      console.log("fetching note data");
      fetch(`${thisURL}/api/getNote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          uuid: uuid,
        }),
      })
        .then((res) => res.json())
        .then((json) => {
          if (json.status == "success") {
            var noteData = json.note;
            paintNoteData(json.note);
          }
        });
    } else {
      paintNoteData(previouslyExistingDataset);
    }

    function paintNoteData(noteData) {
      var imageList = [];
      setOpenModal(false);
      for (var i = 0; i < noteData.imgs; i++) {
        const imageIndex = i;
        imageList.push(
          <img
            src={`https://ik.imagekit.io/schoolthing/imgs/${cookies.get(
              "org"
            )}/${noteData.privateuuid}/${imageIndex}.png`}
            style={{
              height: "100%",
              margin: "auto",
              align: "center",
              objectFit: "contain",
              overflow: "hidden",
            }}
            className={styles.noteImage}
            onClick={() => {
              viewNoteImageModal(
                `https://ik.imagekit.io/schoolthing/imgs/${cookies.get(
                  "org"
                )}/${noteData.privateuuid}/${imageIndex}.png`
              );
            }}
          />
        );
      }
      setState(
        <div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "5% 80% 5%",
              margin: "0% 5%",
              alignItems: "center",
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
                loadMain();
              }}
            />
            <h1>{noteData.title}</h1>
            <TriangleAlertFill
              size={32}
              style={{
                verticalAlign: "middle",
                cursor: "pointer",
                margin: "auto",
              }}
              onClick={() => {
                confirmReport(noteData.uuid);
              }}
              color="red"
              strokeWidth={2}
            />
          </div>

          <div
            style={{
              marginRight: "10%",
              marginLeft: "5%",
            }}
          >
            <br />
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                margin: "auto",
                paddingLeft: "15px",
              }}
            >
              <div>
                {JSON.parse(userdata.liked).includes(noteData.uuid) ? (
                  <img
                    src="/icons/heart.png"
                    width="24px"
                    height="24px"
                    onClick={() => {
                      likeNote(noteData);
                    }}
                    style={{ verticalAlign: "middle" }}
                  />
                ) : (
                  <Heart
                    size={24}
                    style={{ verticalAlign: "middle" }}
                    onClick={() => {
                      likeNote(noteData);
                    }}
                  />
                )}
                <br />
                <span style={{ verticalAlign: "middle", color: "lightgrey" }}>
                  {" "}
                  {JSON.parse(userdata.liked).includes(noteData.uuid) ? (
                    <span style={{ color: "lightgrey" }}>Liked!</span>
                  ) : (
                    <span style={{ color: "lightgrey" }}>Like</span>
                  )}
                </span>
              </div>
              <div>
                <b
                  style={{
                    fontSize: "20px",
                  }}
                >
                  {infoData.subjects[noteData.subject]}
                </b>
                <br />
                <span style={{ color: "lightgrey" }}>Subject</span>
              </div>
              <div>
                <b
                  style={{
                    fontSize: "20px",
                  }}
                >
                  {noteData.fname}
                </b>
                <br />
                <span style={{ color: "lightgrey" }}>Author</span>
              </div>
            </div>
            <br />
            <div className={styles.noteContentContainer}>
              <h2>Description</h2>
              <p
                style={{ textAlign: "center" }}
                dangerouslySetInnerHTML={{ __html: noteData.content }}
              />
              <br />
              <h2 style={{ textAlign: "left" }}>Notes</h2>
              <br />
              {imageList}
            </div>
          </div>
        </div>
      );
    }
    //window.location.href = `/note/${uuid}`;
  }
  function buyNote(uuid) {
    setOpenModal(true);
    setModalContent(
      <>
        {loadingIcon}
        <h1>Purchasing...</h1>{" "}
      </>
    );
    fetch(`${thisURL}/api/buyNote`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        uuid: cookies.get("useruuid"),
        org: cookies.get("org"),
        noteuuid: uuid,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        var status = json.status;
        if (status === "success") {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <br />
              <h1>Done!</h1> <p>Note purchased!</p>
              <StyledButton
                onClick={() => {
                  viewNote(uuid);
                }}
              >
                View note
              </StyledButton>
              <br />
            </>
          );
          temporarilyChangeDetails("points", null, json.points);
        } else if (status == "has") {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <br />
              <h1>Done!</h1> <p>You've already bought this note!</p>
              <StyledButton
                onClick={() => {
                  viewNote(uuid);
                }}
              >
                View note
              </StyledButton>
              <br />
            </>
          );
        } else if (status == "fail") {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <br />
              <h1>Error :(</h1>{" "}
              <p>You do not have enough points to purchase this note.</p>
              <br />
            </>
          );
        } else {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <br />
              <TriangleAlertFill size={48} color="red" />
              <br />
              <p>
                Something unexpected happened! Please contact
                support@schoolthing.org with this ID:
              </p>
              <i>{uuid}</i>
              <br />
            </>
          );
        }
      })
      .catch((error) => {
        setModalContent(<ErrorInfo>{error}</ErrorInfo>);
        setOpenModal(true);
      });
  }

  function loadBar() {
    setShowSearch(true);
    var incr = 0;
    var ls = [];
    var newObj = [];
    for (var key in infoData.subjects) {
      newObj.push({ id: key, name: infoData.subjects[key] });
    }
    newObj.map((obj, index) => {
      ls.push(
        <option key={index} value={obj.id}>
          {obj.name}
        </option>
      );
    });
    setDesktopNoteState(
      <div id="notes">
        {" "}
        <h2
          style={{
            textAlign: "center",
            marginLeft: "15px",
            marginBottom: "-25px",
          }}
        >
          Notes
        </h2>
        <ul className={styles.buttons}>
          <StyledButton disabled={isMount} onClick={() => getNotes("allNotes")}>
            All
          </StyledButton>
          <StyledButton
            disabled={isMount}
            onClick={() => getNotes("yourNotes")}
          >
            My Notes
          </StyledButton>
          <StyledButton
            disabled={isMount}
            onClick={() => getNotes("purchNotes")}
          >
            Purchased
          </StyledButton>
          <select
            className="select"
            onChange={() => {
              noteselectRef.current.value != "def"
                ? getNotes(noteselectRef.current.value)
                : loadMain();
            }}
            ref={noteselectRef}
            style={{
              height: "50px",
            }}
          >
            <option value="def" style={{ fontSize: "10px" }}>
              Subject
            </option>
            {ls}
          </select>
        </ul>
      </div>
    );
  }
  function clearFeed() {
    setModalContent(
      <>
        {loadingIcon}
        <h1>Clearing...</h1>
      </>
    );
    setOpenModal(true);
    fetch(`${thisURL}/api/clearFeed`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        uuid: cookies.get("useruuid"),
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        setModalContent(
          <>
            <Cross
              size={32}
              color={accentColor.split("&")[0]}
              onClick={() => {
                setOpenModal(false);
              }}
              style={{
                float: "right",
                cursor: "pointer",
              }}
            />
            <br />
            <h1>Done!</h1>
            <p>Your feed has been cleared!</p>
          </>
        );
      })
      .catch((error) => {
        setModalContent(<ErrorInfo>{error}</ErrorInfo>);
        setOpenModal(true);
      });
  }

  function formatMessage(message) {
    if (message.includes("logged in")) {
      return {
        user: "You",
        action: "Logged in from a device",
      };
    } else if (message.includes('You liked "')) {
      var string = message.split("You liked ");
      return {
        user: "You",
        action: `Liked the post ${string[1].replace(".", "")}`,
      };
    } else if (message.includes("liked the note")) {
      var string = message.split(" liked the note ");
      return {
        user: string[0],
        action: `Liked the note "${string[1].replace("!", "")}"`,
      };
    } else if (message.includes("created the note")) {
      var string = message.split(" created the note ");
      return {
        user: string[0],
        action: `Created the note "${string[1].replace(".", "")}"`,
      };
    } else if (message.includes(" bought your note ")) {
      var string = message.split(" bought your note ");
      return {
        user: string[0],
        action: `Bought your note "${string[1].replace(".", "")}"`,
      };
    } else if (message.includes(" bought the note ")) {
      var string = message.split(" bought the note ");
      return {
        user: string[0],
        action: `Bought the note "${string[1].replace(".", "")}"`,
      };
    } else if (message.includes("has given you")) {
      var string = message.split(" has given you ");
      return {
        user: string[0],
        action: `Sent you ${string[1].replace("!", "")}`,
      };
    } else if (message.includes(`You joined this ${productName} community!`)) {
      return {
        user: "You",
        action: `Joined the ${productName} community!`,
      };
    } else if (message.includes("has bought your note")) {
      var string = message.split(" has bought your note ");
      return {
        user: string[0],
        action: `Bought your note ${string[1].replace(".", "")}`,
      };
    } else if (message.includes("has sent you")) {
      var string = message.split(" has sent you ");
      return {
        user: string[0],
        action: `Sent you ${string[1]}`,
      };
    } else if (message.includes(" has been sent ")) {
      var string = message.split(" has been sent ");
      return {
        user: "You",
        action: `Transferred ${string[1]} to ${string[0]}`,
      };
    } else {
      return {
        user: "System",
        action: 404,
      };
    }
  }
  function feed() {
    changeIconHighlight("feed");
    var feedData = JSON.parse(userdata.feed).reverse();
    setShowSearch(false);
    setState(<h2>Loading</h2>);
    var feedList = {
      day: [],
      week: [],
      month: [],
      other: [],
    };
    setNoteState(false);
    feedData.map((obj, index) => {
      var dateObj = new Date(obj.timestamp);

      var m = formatMessage(obj.message);
      var target = (
        <>
          <li
            key={index}
            style={{
              textAlign: "center",
              listStyleType: "none",
              display: "grid",
              gridTemplateColumns: "65% 30%",
            }}
          >
            <span align="left">
              <b>{m.action == 404 ? null : m.user}</b>
              <br />
              {m.action == 404 ? obj.message : m.action}
            </span>
            <span
              style={{
                color: "lightgrey",
                paddingTop: "25px",
                textAlign: "right",
              }}
            >
              {convertDate(dateObj).includes("%%%")
                ? convertDate(dateObj).split("%%%")[1]
                : convertDate(dateObj)}
            </span>
          </li>
          <br />
          <br />
        </>
      );
      var currentTimestamp = new Date().getTime();
      if (currentTimestamp - obj.timestamp < 86400000) {
        feedList["day"].push(target);
      } else if (currentTimestamp - obj.timestamp < 604800000) {
        feedList["week"].push(target);
      } else if (currentTimestamp - obj.timestamp < 2592000000) {
        feedList["month"].push(target);
      } else {
        feedList["other"].push(target);
      }
    });
    setState(
      <div style={{ marginLeft: "20px" }}>
        <div>
          {" "}
          <h1>Feed</h1>
          <StyledButton
            className={styles.lightCycleUpdatableButton}
            onClick={clearFeed}
            style={{ fontSize: "20px" }}
          >
            <TrashCan
              size={24}
              color={staticIconColor}
              className={styles.icon}
            />{" "}
            Clear
          </StyledButton>
        </div>
        <div style={{ margin: "auto", textAlign: "left" }}>
          {feedList["day"].length == 0 ? null : (
            <>
              <h2>The past 24 hours</h2>
              <ul style={{ align: "center", margin: "auto" }}>
                {feedList["day"].length == 0 ? (
                  <p style={{ textAlign: "center" }}>
                    No activity in the last 24 hours.
                  </p>
                ) : (
                  feedList["day"]
                )}
              </ul>
              <br />
            </>
          )}
          {feedList["week"].length == 0 ? null : (
            <>
              <h2>The past week</h2>
              <ul style={{ align: "center", margin: "auto" }}>
                {feedList["week"].length == 0 ? (
                  <p style={{ textAlign: "center" }}>
                    No activity in the last week.
                  </p>
                ) : (
                  feedList["week"]
                )}
              </ul>
              <br />
            </>
          )}
          {feedList["month"].length == 0 ? null : (
            <>
              <h2>The past month</h2>
              <ul style={{ align: "center", margin: "auto" }}>
                {feedList["week"].length == 0 ? (
                  <p style={{ textAlign: "center" }}>
                    No activity in the past month.
                  </p>
                ) : (
                  feedList["month"]
                )}
              </ul>
              <br />
            </>
          )}
          {feedList["month"].length == 0 ? null : <h2>Older</h2>}
          <ul
            style={{ align: "center", margin: "auto", paddingBottom: "40vh" }}
          >
            {feedList["other"].length == 0 ? (
              <p style={{ textAlign: "center" }}>No older activity.</p>
            ) : (
              feedList["other"]
            )}
          </ul>
          <br />
          <br />
          <br />
          <br />
        </div>{" "}
      </div>
    );
  }
  function search(action, isMobile = false) {
    if (action == "blur") {
      setState(originalContent);
      setExitSearch(false);
    } else if (action == "focus") {
      setOriginalContent(state);
      setExitSearch(true);
    } else if (action == "search") {
      var searchBar = isMobile
        ? searchMobileRef.current.value
        : searchRef.current.value;
      if (searchBar.trim() != "") {
        var searchdb = new JsSearch.Search("uuid");
        searchdb.addIndex("title");
        searchdb.addIndex("subject");
        searchdb.addIndex("class");
        searchdb.addIndex("content");
        searchdb.addDocuments(trendingNotes);
        var searchdata = searchdb.search(searchBar);
        setNoteState(false);
        setState(
          <div className={styles.notes}>
            {searchdata.map((obj) => {
              var hasNotes = false;
              JSON.parse(userdata.notes).map((note) => {
                if (note.uuid == obj.uuid) {
                  hasNotes = true;
                }
              });
              return (
                <>
                  <div
                    className={
                      obj.teacher
                        ? `${styles.adjustWidth} ${styles.teacherNote}`
                        : styles.adjustWidth
                    }
                    style={{
                      border: "1px solid white",
                      borderRadius: "20px",
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      boxShadow: `0 0 10px ${
                        obj.teacher
                          ? `4px ${accentColor.split("&")[0]}`
                          : "1px #e5e5e5"
                      }`,
                      backdropFilter: "blur(15px)",
                      width: "85%",
                      color: "black",
                      margin: "auto",
                      overflowX: "hidden",
                    }}
                  >
                    <div>
                      <img
                        src={`https://ik.imagekit.io/schoolthing/imgs/${obj.org}/${obj.privateuuid}/0.png`}
                        style={{
                          width: "100%",
                          objectFit: "cover",
                          maxHeight: "300px",
                          zIndex: "-3",
                          borderTopLeftRadius: "20px",
                          borderTopRightRadius: "20px",
                        }}
                      />
                    </div>

                    {obj.teacher ? (
                      <b
                        style={{
                          fontSize: "20px",
                          color: accentColor.split("&")[0],
                        }}
                      >
                        Teacher Note
                      </b>
                    ) : null}
                    <div style={{ padding: "10px" }}>
                      <h3>
                        {obj.title}
                        <br />
                        <b style={{ fontSize: "14px" }}>
                          {infoData.subjects[obj.subject].toUpperCase()}
                        </b>
                      </h3>

                      <p dangerouslySetInnerHTML={{ __html: obj.content }}></p>
                      <div
                        style={{
                          position: "sticky",
                          bottom: "2%",
                          width: "100%",
                          textAlign: "center",
                          background: "white",
                          boxShadow: "0 0 10px 4px #e5e5e5",
                          borderRadius: "20px",
                          height: "60px",
                        }}
                      >
                        <p
                          style={{
                            textAlign: "left",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            height: "100%",
                          }}
                          className={styles.updatableButton}
                        >
                          <StyledButton
                            style={{
                              verticalAlign: "middle",
                              backgroundColor: "transparent",
                              border: "none",
                              color: "black",
                              boxShadow: "none",
                              borderRadius: "20px",
                              height: "60px",
                              margin: "0",
                            }}
                          >
                            <img
                              src="icons/heart.png"
                              width="24px"
                              style={{ verticalAlign: "middle" }}
                            />{" "}
                            <span style={{ verticalAlign: "middle" }}>
                              {obj.likes.toLocaleString()}
                            </span>
                          </StyledButton>

                          <StyledButton
                            style={{
                              verticalAlign: "middle",
                              borderRadius: "20px",
                              height: "100%",
                              margin: "0",
                            }}
                            onClick={
                              hasNotes
                                ? () => {
                                    viewNote(obj.uuid);
                                  }
                                : () => {
                                    buyNote(obj.uuid);
                                  }
                            }
                          >
                            {hasNotes ? (
                              "Open"
                            ) : parseInt(obj.points) == 0 ? (
                              "Free"
                            ) : (
                              <span>
                                <Coin
                                  className={styles.icon}
                                  color={buttonIconColor}
                                  size={22}
                                />{" "}
                                {obj.points.toLocaleString()}{" "}
                              </span>
                            )}
                          </StyledButton>
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        );
      } else {
        loadMain();
      }
    } else if (action == "exit") {
      loadMain();
    }
  }
  function urlBase64ToUint8Array(base64String) {
    var padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    var base64 = (base64String + padding)
      .replace(/\-/g, "+")
      .replace(/_/g, "/");

    var rawData = window.atob(base64);
    var outputArray = new Uint8Array(rawData.length);

    for (var i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  async function unsubscribeUser() {
    var registration = await navigator.serviceWorker.getRegistration();
    var subscription = await registration.pushManager.getSubscription();
    setModalContent(
      <>
        {loadingIcon}
        <br />
        Unsubscribing...
      </>
    );
    setOpenModal(true);
    fetch(`${thisURL}/api/unsubscribeToNotifications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        uuid: userdata.uuid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        setModalContent(
          <>
            <Cross
              size={32}
              color={accentColor.split("&")[0]}
              onClick={() => {
                setOpenModal(false);
              }}
              style={{
                float: "right",
                cursor: "pointer",
              }}
            />
            <br />
            <h1>Done!</h1>
            <p>
              You will no longer receive notifications from {productName} on any
              of your devices. You can re-enable them at any time from the
              device you want to receive notifications on.
            </p>
          </>
        );
      })
      .catch((error) => {
        setModalContent(<ErrorInfo>{error}</ErrorInfo>);
        setOpenModal(true);
      });
  }
  async function subscribeUserToPush() {
    setModalContent(
      <>
        {loadingIcon}
        <br /> Setting up notifications...
      </>
    );
    setOpenModal(true);
    const registration = await navigator.serviceWorker.register("/sw.js");
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(
        "BFAVv6CP04Ajqcm1ycZOOAMA_w5WHdxFbjwOdbIFrFXVYEXp95h_DnZnvgkhkmqzY68HMRLwygzPhIqePNRApi4"
      ),
    };
    const pushSubscription = await registration.pushManager.subscribe(
      subscribeOptions
    );
    console.log(
      "Received PushSubscription: ",
      JSON.stringify(pushSubscription)
    );
    fetch(`${thisURL}/api/subscribeToNotification`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        uuid: userdata.uuid,
        subscription: JSON.stringify(pushSubscription),
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setModalContent(
          <>
            <Cross
              size={32}
              color={accentColor.split("&")[0]}
              onClick={() => {
                setOpenModal(false);
              }}
              style={{
                float: "right",
                cursor: "pointer",
              }}
            />
            <br />
            <h1>Done!</h1>
            <p>You will now receive notifications from {productName}!</p>
          </>
        );
        setOpenModal(true);
      })
      .catch((error) => {
        setModalContent(<ErrorInfo>{error}</ErrorInfo>);
        setOpenModal(true);
      });
  }
  function testPushMessage() {
    setModalContent(
      <>
        {loadingIcon}
        Sending...
      </>
    );
    fetch(`${thisURL}/api/testPushMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        uuid: userdata.uuid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.data == "success") {
          console.log(data);
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <h1>Done!</h1>
            </>
          );
          setOpenModal(true);
        } else {
          setModalContent(
            <>
              <Cross
                size={32}
                color={accentColor.split("&")[0]}
                onClick={() => {
                  setOpenModal(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <TriangleAlertFill
                color="red"
                size={48}
                style={{
                  margin: "auto",
                }}
              />
              <br />
              <p>Something went wrong.</p>
            </>
          );
          setOpenModal(true);
        }
      })
      .catch((error) => {
        setModalContent(<ErrorInfo>{error}</ErrorInfo>);
        setOpenModal(true);
      });
  }
  function askPermission() {
    setModalContent(
      <>
        {loadingIcon}
        <br />
        Asking for permission...
      </>
    );
    return new Promise(function (resolve, reject) {
      const permissionResult = Notification.requestPermission(function (
        result
      ) {
        resolve(result);
      });

      if (permissionResult) {
        permissionResult.then(resolve, reject);
      }
    }).then(function (permissionResult) {
      console.log(permissionResult);
      if (permissionResult !== "granted") {
        console.log("We weren't granted permission.");
        setModalContent(
          <>
            <Cross
              size={32}
              color={accentColor.split("&")[0]}
              onClick={() => {
                setOpenModal(false);
              }}
              style={{
                float: "right",
                cursor: "pointer",
              }}
            />
            <br />
            <h1>Notifications disabled</h1>
            <p>
              You will not receive notifications from {productName} on this
              device. You can re-enable them at any time from your device's
              settings app.
            </p>
          </>
        );
        setOpenModal(true);
      } else {
        console.log("We were granted permission.");
        subscribeUserToPush();
      }
    });
  }
  async function loadMain() {
    setState(
      <h1>
        <img
          src="icons/loadingLogo.png"
          width="64px"
          height="64px"
          style={{ verticalAlign: "middle" }}
        />
        <br />
        Starting up...
      </h1>
    );
    if (redirect != "null") {
      router.push(redirect);
    }
    setShowDesktopNoteType(false);
    changeIconHighlight("home");
    setShowSearch(true);
    setNoteState(true);
    setShowNoteType(false);
    setCurrentActionFocus("home");
    if (
      router.query.followthrough == "m" &&
      window.navigator.userAgent.toLowerCase().includes("mobi") &&
      !window.matchMedia("(display-mode: standalone)").matches
    ) {
      setModalContent(
        <div style={{ textAlign: "center" }}>
          <h2>Are you still on the web version?</h2>
          <p>
            Install the {productName} Web App for better features and faster
            loading speeds.
          </p>
          <h2>Install guide:</h2>
          <h3>iOS:</h3>
          <ul style={{ textDecoration: "none", textAlign: "left" }}>
            <li>
              Click the{" "}
              <ShareBox className={styles.icon} color={iconColor} size={28} />{" "}
              share button
            </li>
            <li>Click "Add to Home Screen"</li>
            <li>Click "Add"</li>
          </ul>
          <h3>Android:</h3>
          <ul style={{ textDecoration: "none", textAlign: "left" }}>
            <li>
              Click the{" "}
              <MoreVerticalFill
                className={styles.icon}
                color={iconColor}
                size={28}
              />{" "}
              button in the top right corner of the browser
            </li>
            <li>Click "Add to Home Screen"</li>
            <li>Click "Add"</li>
          </ul>
          <StyledButton
            onClick={() => {
              setOpenModal(false);
            }}
          >
            Opinion rejected 🗿
          </StyledButton>
        </div>
      );
      setOpenModal(true);
    }
    if (router?.query?.followthrough?.startsWith("post/")) {
      var postuuid = router.query.followthrough.split("/")[1];
      openPosts(true, true);
      router.push(`/main#${postuuid}`);
    }

    changeIconHighlight("home");
    if (userdata.verified) {
      setShowSearch(true);
      if (uuidValidate(cookies.get("useruuid"))) {
        loadBar();
        var userPoints;
        var fname;
        var out = [];
        var outN = [];
        setPointVal(<span>{userdata.points.toLocaleString()}</span>);
        isMount = true;
        userPoints = userdata.points;
        fname = userdata.fname;
        var data = userdata.feed;
        var registration;
        var isSubscribed;
        if ("serviceWorker" in navigator && "PushManager" in window) {
          registration = await navigator.serviceWorker.register("/sw.js");
          isSubscribed = await registration.pushManager.getSubscription();
        }
        setState(
          <>
            <p style={{ margin: "5px 20px" }}>
              {isGlobal
                ? `Welcome to the ${productName} Global Community!`
                : `Welcome to the ${productName} Community for ${infoData.name}!`}
              <br />
              <br />
              You have <b>{userdata.points.toLocaleString()}</b> points!
            </p>
            <br />
            <br />
            {"serviceWorker" in navigator && "PushManager" in window ? (
              !isSubscribed ? (
                <>
                  <div
                    className={styles.adjustWidth}
                    style={{
                      borderRadius: "20px",
                      boxShadow: `0 0 10px 4px #e5e5e5`,
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      backdropFilter: "blur(15px)",
                      padding: "10px",
                      margin: "auto",
                      width: "80%",
                    }}
                  >
                    <h2>Enable notifications!</h2>
                    <p>
                      Get notified when someone buys or likes your notes, or
                      when there's a note or post you might be interested in.
                    </p>
                    <StyledButton
                      onClick={() => {
                        askPermission();
                      }}
                    >
                      Enable Notifications!
                    </StyledButton>
                  </div>
                  <br />
                </>
              ) : null
            ) : null}
            <br />
            {"all" in availableNotices ? (
              <>
                <div
                  className={styles.adjustWidth}
                  style={{
                    borderRadius: "20px",
                    boxShadow: `0 0 10px 4px #e5e5e5`,
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    backdropFilter: "blur(15px)",
                    padding: "10px",
                    margin: "auto",
                    width: "80%",
                  }}
                >
                  <p>Organisation-wide broadcast</p>
                  <h2>{availableNotices.all.title}</h2>
                  <p
                    align="center"
                    dangerouslySetInnerHTML={{
                      __html: availableNotices.all.content,
                    }}
                  ></p>
                  <span style={{ color: "black" }}>
                    {convertDate(
                      new Date(parseInt(availableNotices.all.timestamp))
                    ).includes("%%%")
                      ? convertDate(
                          new Date(parseInt(availableNotices.all.timestamp))
                        ).split("%%%")[0]
                      : null}
                    {convertDate(
                      new Date(parseInt(availableNotices.all.timestamp))
                    ).includes("%%%") ? (
                      <br className={styles.brMobile} />
                    ) : null}
                    {convertDate(
                      new Date(parseInt(availableNotices.all.timestamp))
                    ).includes("%%%")
                      ? convertDate(
                          new Date(parseInt(availableNotices.all.timestamp))
                        ).split("%%%")[1]
                      : null}
                  </span>
                </div>
                <br />
              </>
            ) : null}
            <br />
            {userdata.class in availableNotices ? (
              <>
                <div
                  className={styles.adjustWidth}
                  style={{
                    borderRadius: "20px",
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    boxShadow: `0 0 10px 4px #e5e5e5`,
                    color: "black",
                    backdropFilter: "blur(15px)",
                    padding: "10px",
                    margin: "auto",
                    width: "80%",
                  }}
                >
                  <h2>{availableNotices[userdata.class].title}</h2>
                  <p
                    align="center"
                    dangerouslySetInnerHTML={{
                      __html: availableNotices[userdata.class].content,
                    }}
                  ></p>
                  <span>
                    {convertDate(
                      new Date(parseInt(availableNotices.all.timestamp))
                    ).includes("%%%")
                      ? convertDate(
                          new Date(parseInt(availableNotices.all.timestamp))
                        ).split("%%%")[0]
                      : null}
                    {convertDate(
                      new Date(parseInt(availableNotices.all.timestamp))
                    ).includes("%%%") ? (
                      <br className={styles.brMobile} />
                    ) : null}
                    {convertDate(
                      new Date(parseInt(availableNotices.all.timestamp))
                    ).includes("%%%")
                      ? convertDate(
                          new Date(parseInt(availableNotices.all.timestamp))
                        ).split("%%%")[1]
                      : null}
                  </span>
                </div>
                <br />
              </>
            ) : null}
            {!(userdata.class in availableNotices) &&
            !("all" in availableNotices) ? (
              <div>
                <p>You have no important notices today.</p>
                <br />
                <br />
              </div>
            ) : null}
            <br />
            <h2>Posts you may like:</h2>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
              }}
            >
              {getRandomPost.map((obj) => {
                var likes = JSON.parse(obj.likes);
                var replies = JSON.parse(obj.replies);
                return (
                  <div
                    style={{
                      border: "1px solid #e5e5e5",
                      borderRadius: "20px",
                      boxShadow: "0 0 10px 1px #e5e5e5",
                      backdropFilter: "blur(15px)",
                      padding: "20px",
                      textAlign: "left",
                      width: "80%",
                      margin: "auto",
                    }}
                  >
                    <StyledLink
                      onClick={() => {
                        getUserData(obj.authoruuid, obj.org);
                      }}
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        gap: "10px",
                        cursor: "pointer",
                      }}
                    >
                      <div style={{ verticalAlign: "middle" }}>
                        {/*postUserEmojis[obj.authoruuid]*/}
                        <AvatarComponent
                          classes="avatar"
                          useGravatar={true}
                          useGravatarFallback={true}
                          fallback="retro"
                          size={64}
                          rating="g"
                          email={obj.email || ""}
                        />
                      </div>
                      <span
                        style={{
                          fontSize: "24px",
                          display: "flex",
                          flexDirection: "column",
                        }}
                      >
                        <b style={{ color: accentColor.split("&")[0] }}>
                          {obj.username}{" "}
                        </b>
                        <span
                          style={{
                            color: "lightgray",
                            fontSize: "16px",
                          }}
                        >
                          {obj.org}
                        </span>
                      </span>
                    </StyledLink>
                    <br />
                    <b
                      style={{ fontSize: "24px", margin: "5px" }}
                      id={obj.uuid}
                    >
                      {obj.title}
                    </b>
                    <p
                      style={{ margin: "5px" }}
                      dangerouslySetInnerHTML={{
                        __html: obj.content,
                      }}
                    />
                    <br />
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        gap: "10px",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            padding: "10px",
                            display: "flex",
                            flexDirection: "row",
                            justifyContent: "space-between",
                            gap: "30px",
                          }}
                        >
                          <span>
                            {likes.includes(userdata.uuid) ? (
                              <img
                                width="24px"
                                height="24px"
                                src="icons/heart.png"
                                style={{
                                  verticalAlign: "middle",
                                }}
                              />
                            ) : (
                              <Heart
                                color={iconColor}
                                size={24}
                                style={{ verticalAlign: "middle" }}
                              />
                            )}{" "}
                            {likes.length}
                          </span>
                          <span
                            style={{
                              textAlign: "right",
                            }}
                          >
                            <ChatBubble
                              size={24}
                              style={{ verticalAlign: "middle" }}
                            />{" "}
                            {replies.length}
                          </span>
                        </div>

                        <i
                          style={{
                            color: "lightgray",
                            marginLeft: "10px",
                          }}
                        >
                          {decipherPostTimestamp(obj.timestamp)}
                        </i>
                      </div>
                    </div>
                  </div>
                );
              })}
              <StyledButton
                onClick={openPosts}
                style={{ width: "90%", margin: "auto" }}
              >
                See more!
              </StyledButton>
            </div>
          </>
        );
      } else {
        window.location.replace("/home");
      }
    } else {
      setModalContent(
        <div>
          <TriangleAlertFill size={48} color="red" />
          <br />
          <p>You aren't verified!</p>
          <p>
            Check your email for a verification link, and then refresh this page
            or click{" "}
            <StyledLink
              style={{ color: accentColor.split("&")[0] }}
              href={"/main"}
            >
              here
            </StyledLink>
          </p>
          <StyledButton
            onClick={() => {
              cookies.remove("useruuid");
              window.location.replace("/home");
            }}
          >
            <SignOut className={styles.icon} /> Log out
          </StyledButton>
        </div>
      );
      setOpenModal(true);
    }

    if ("serviceWorker" in navigator && "PushManager" in window) {
      return navigator.serviceWorker
        .register("/sw.js")
        .then(function (registration) {
          console.log("Service worker successfully registered.");
          return registration;
        })
        .catch(function (err) {
          console.error("Unable to register service worker.", err);
        });
    }
  }
  function compIndex(i) {
    if (i == 1) return "🥇";
    if (i == 2) return "🥈";
    if (i == 3) return "🥉";
    return i;
  }

  function notes() {
    setShowNoteType(true);
    setState(
      <>
        <h1>Notes</h1>
        <br />
        {desktopNoteItems}
        <br />
      </>
    );
  }

  function ldr() {
    changeIconHighlight("leaderboard");

    if (uuidValidate(cookies.get("useruuid"))) {
      setNoteState(false);
      setState(<h2>Loading</h2>);
      setShowSearch(true);
      var i = 0;
      var pointsWithCorrespondence = [];
      var compiledTables = [];
      ldrData.sort((a, b) => {
        return b.points - a.points;
      });
      ldrData.forEach((obj, index) => {
        if (obj.teacher == false) {
          pointsWithCorrespondence.push(obj.points);
          if (pointsWithCorrespondence[i - 1] != obj.points) {
            i++;
          }
          if (i == 0) i++;

          compiledTables.push(
            <tr
              onClick={() => {
                getUserData(obj.uuid, infoData.name);
              }}
              className={styles.ldrItem}
              style={{
                padding: "0px 5px",
                borderRadius: "10px",
              }}
              key={index}
            >
              <td style={{ fontSize: "32px", verticalAlign: "middle" }}>
                {compIndex(i)}
              </td>
              <td
                style={{
                  margin: "auto",
                  textAlign: "left",
                  width: "fit-content",
                  fontSize: "20px",
                }}
              >
                <AvatarComponent
                  classes="avatar"
                  useGravatar={true}
                  useGravatarFallback={true}
                  fallback="retro"
                  size={24}
                  rating="g"
                  email={obj.email || "e"}
                />{" "}
                {obj.uuid === cookies.get("useruuid") ? (
                  <b
                    style={{
                      cursor: "pointer",
                      color: accentColor.split("&")[0],
                    }}
                    onClick={() => {
                      getUserData(obj.uuid, infoData.name);
                    }}
                  >
                    You
                  </b>
                ) : (
                  <span
                    style={{
                      cursor: "pointer",
                      color: accentColor.split("&")[0],
                    }}
                    onClick={() => {
                      getUserData(obj.uuid, infoData.name);
                    }}
                  >
                    {obj.fname}
                  </span>
                )}
              </td>
              {isGlobal ? null : (
                <td style={{ textAlign: "left", margin: "auto" }}>
                  {obj.class}
                </td>
              )}

              <td style={{ textAlign: "left", margin: "auto" }}>
                {obj.points.toLocaleString()}
              </td>
            </tr>
          );
        }
      });
      setState(
        <div>
          <h1 style={{ textAlign: "center" }}>Leaderboard</h1>
          <br />
          <table style={{ margin: "auto", width: "100%" }}>
            <tr>
              <th>
                <h2>#</h2>
              </th>
              <th style={{ textAlign: "left", margin: "auto" }}>
                <h2>Name</h2>
              </th>
              {isGlobal ? null : (
                <th style={{ textAlign: "left", margin: "auto" }}>
                  <h2>Grade</h2>
                </th>
              )}
              <th style={{ textAlign: "left", margin: "auto" }}>
                <h2>Points</h2>
              </th>
            </tr>
            {compiledTables}
          </table>
          <br />
          <br />
        </div>
      );
    } else {
      window.location.replace("/home");
    }
  }

  function forYou() {
    var out = [];
    //get last 4 notes: 2 from purchased, 2 from liked
    var purchasedNotes = JSON.parse(userdata.notes).reverse().slice(0, 2);
    var likedNotes = JSON.parse(userdata.liked).reverse().slice(0, 2);
    var subjectsPurchasedOrLiked = [];
    //add all subjects by looking up from trendingNotes
    purchasedNotes.forEach((obj, index) => {
      var allNoteData = trendingNotes.filter((note) => note.uuid == obj.uuid);
      if (allNoteData.length != 0) {
        var noteData = allNoteData[0];
        if (!subjectsPurchasedOrLiked.includes(noteData.subject)) {
          subjectsPurchasedOrLiked.push(noteData.subject);
        }
      }
    });
    likedNotes.forEach((obj, index) => {
      var allNoteData = trendingNotes.filter((note) => note.uuid == obj);
      if (allNoteData.length != 0) {
        var noteData = allNoteData[0];
        if (!subjectsPurchasedOrLiked.includes(noteData.subject)) {
          subjectsPurchasedOrLiked.push(noteData.subject);
        }
      }
    });
    trendingNotes.forEach((obj, index) => {
      if (subjectsPurchasedOrLiked.includes(obj.subject)) {
        out.push(
          <>
            <br />
            <div
              className={styles.adjustWidth}
              style={{
                border: "1px solid white",
                borderRadius: "20px",
                width: "90%",
                backgroundColor: "rgba(255, 255, 255, 1)",
                boxShadow: "0 0 10px 1px #fefefe",
                backdropFilter: "blur(15px)",
                color: "black",
                margin: "auto",
              }}
            >
              {" "}
              <div>
                <h3>{obj.title}</h3>
                <img
                  src={`https://ik.imagekit.io/schoolthing/imgs/${obj.org}/${obj.privateuuid}/0.png`}
                  style={{
                    width: "100%",
                    objectFit: "contain",
                    maxHeight: "400px",
                  }}
                />
              </div>
              <div style={{ padding: "10px" }}>
                <p dangerouslySetInnerHTML={{ __html: obj.content }}></p>
                <p style={{ textAlign: "left" }}>
                  <span>
                    {isGlobal ? null : `${infoData.grades[obj.class]} - `}
                    {infoData.subjects[obj.subject]} <br />
                    {obj.points.toLocaleString()} points
                  </span>
                  <br />
                  <StyledButton
                    onClick={
                      obj.uuid in compiledNotes
                        ? () => {
                            viewNote(obj.uuid);
                          }
                        : () => {
                            buyNote(obj.uuid);
                          }
                    }
                  >
                    {obj.uuid in compiledNotes ? "Open" : "Buy"}
                  </StyledButton>
                </p>
              </div>
            </div>
          </>
        );
      }
    });
    setState(
      <>
        <h1>For you</h1>
        {out}
      </>
    );
  }
  function transferToCertainEmail(transferemail, name) {
    setModalContent(
      <>
        <Cross
          size={32}
          color={accentColor.split("&")[0]}
          onClick={() => {
            setOpenModal(false);
          }}
          style={{
            float: "right",
            cursor: "pointer",
          }}
        />
        <br />
        <h2>Transfer points</h2>
        Transfer points to <b>{name}</b>:
        <br />
        <br />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          ref={transferamount}
          required
          style={{
            width: "80%",
          }}
        />
        <br />
        <StyledButton
          onClick={() => {
            transferPoints(transferemail, name);
          }}
        >
          Transfer!
        </StyledButton>
      </>
    );
    setOpenModal(true);
  }

  function trending() {
    setCurrentActionFocus("trending");
    setShowSearch(true);
    changeIconHighlight("trending");
    if (uuidValidate(cookies.get("useruuid"))) {
      var noteTable = [];
      trendingNotes.forEach((obj, index) => {
        noteTable.push(
          <tr key={index}>
            <td>{compIndex(index + 1)}</td>
            <td>{obj.title}</td>
            <td>{obj.likes}</td>
            <td>
              {obj.uuid in compiledNotes ? (
                <StyledButton
                  onClick={() => {
                    viewNote(obj.uuid);
                  }}
                >
                  Open
                </StyledButton>
              ) : (
                <StyledButton
                  onClick={() => {
                    buyNote(obj.uuid);
                  }}
                >
                  <Coin size={24} className={styles.icon} color={iconColor} />{" "}
                  {obj.points}
                </StyledButton>
              )}
            </td>
          </tr>
        );
      });
      setState(<h2>Loading</h2>);
      var i = 0;

      setState(
        <div className={styles.trendMargin} style={{ marginTop: "-2%" }}>
          <h1>Trending</h1>
          <br />
          <table style={{ margin: "auto", padding: "10px" }}>
            <tr>
              <th>
                <h2>#</h2>
              </th>
              <th>
                <h2>Title</h2>
              </th>
              <th>
                <h2>Likes</h2>
              </th>
              <th>
                <h2></h2>
              </th>
            </tr>
            {noteTable}
          </table>
          <br />
          <br />
        </div>
      );
    } else {
      window.location.replace("/home");
    }
  }

  function managePoints() {
    var ledger = [];
    var debitedAmt = 0;
    var creditedAmt = 0;
    var feed = JSON.parse(userdata.feed).reverse();
    feed.forEach((obj, index) => {
      var dateObj = new Date(obj.timestamp);
      if (obj.message.includes(" has been sent ")) {
        var objMessageSplit = obj.message.split(" has been sent ");
        debitedAmt =
          debitedAmt + parseInt(objMessageSplit[1].replace("points").trim());
        ledger.push(
          <>
            <tr>
              <td style={{ textAlign: "left" }}>
                <h2>
                  <span style={{ fontSize: "42px", verticalAlign: "middle" }}>
                    {generateRandomEmoji()}{" "}
                  </span>
                  {objMessageSplit[0]}
                  <br />
                  <span
                    style={{
                      color: "lightgrey",
                      paddingTop: "25px",
                      fontSize: "19px",
                      fontWeight: "normal",
                    }}
                  >
                    {convertDate(dateObj).includes("%%%")
                      ? convertDate(dateObj).split("%%%")[1]
                      : convertDate(dateObj)}
                  </span>
                </h2>
              </td>
              <td
                style={{ color: "red", fontSize: "22px", textAlign: "right" }}
              >
                -{objMessageSplit[1].replace("points", "")}{" "}
                <Coin size={22} className={styles.icon} color={iconColor} />
              </td>
            </tr>
            <br />
          </>
        );
      } else if (obj.message.includes(" has sent you ")) {
        var objMessageSplit = obj.message.split(" has sent you ");
        creditedAmt =
          creditedAmt + parseInt(objMessageSplit[1].replace("points").trim());
        ledger.push(
          <>
            <tr>
              <td style={{ textAlign: "left" }}>
                <h2>
                  <span style={{ fontSize: "42px", verticalAlign: "middle" }}>
                    {generateRandomEmoji()}{" "}
                  </span>
                  {objMessageSplit[0]}
                  <br />
                  <span
                    style={{
                      color: "lightgrey",
                      paddingTop: "25px",
                      fontSize: "19px",
                      fontWeight: "normal",
                    }}
                  >
                    {convertDate(dateObj).includes("%%%")
                      ? convertDate(dateObj).split("%%%")[1]
                      : convertDate(dateObj)}
                  </span>
                </h2>
              </td>
              <td
                style={{
                  color: "lightgreen",
                  fontSize: "22px",
                  textAlign: "right",
                }}
              >
                +{objMessageSplit[1].replace("points", "")}{" "}
                <Coin size={22} className={styles.icon} color={iconColor} />
              </td>
            </tr>
            <br />
          </>
        );
      }
    });
    changeIconHighlight("points");
    setShowSearch(false);
    setState(<h2>Loading</h2>);
    if (uuidValidate(cookies.get("useruuid"))) {
      var res = [];
      userEmails.sort((a, b) => {
        return a.name.localeCompare(b.name);
      });
      userEmails.forEach((obj, index) => {
        if (obj.email != userdata.email) {
          res.push(
            <option value={obj.email} key={index}>
              {obj.name}
            </option>
          );
        }
      });
      function openTransferModal() {
        setModalContent(
          <>
            <Cross
              size={32}
              color={accentColor.split("&")[0]}
              onClick={() => {
                setOpenModal(false);
              }}
              style={{
                float: "right",
                cursor: "pointer",
              }}
            />
            <br />
            <h2>Transfer points</h2>
            <p>Select the email to transfer money to</p>
            <select
              name="toemail"
              ref={transfertoemail}
              style={{
                width: "80%",
                height: "60px",
                fontSize: "16px",
                borderRadius: "10px",
              }}
            >
              {res}
            </select>
            <br />
            <br />
            <input
              type="number"
              name="amount"
              placeholder="Amount"
              ref={transferamount}
              required
              style={{
                width: "80%",
              }}
            />
            <br />
            <StyledButton
              onClick={() => {
                transferPoints(
                  transfertoemail.current.value,
                  userEmails.filter(
                    (obj) => obj.email == transfertoemail.current.value
                  )[0].name
                );
              }}
            >
              Transfer!
            </StyledButton>
          </>
        );
        setOpenModal(true);
      }
      setNoteState(false);
      setState(
        <div align="center">
          <div className={styles.pointHeader}>
            <div>
              <h1 style={{ fontSize: "48px" }}>
                <Coin size={48} color="white" className={styles.icon} />{" "}
                {userdata.points.toLocaleString()}
              </h1>
              <StyledButton
                style={{
                  color: "black",
                  background: "white",
                  borderRadius: "30px",
                  boxShadow: `0 0 8px 4px ${accentColor.split("&")[0]}`,
                }}
                onClick={openTransferModal}
              >
                Send Points
              </StyledButton>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <h1
              style={{
                fontSize: "42px",
                color: "#ff3b30",
                textAlign: "center",
              }}
            >
              <Coin size={42} color="#ff3b30" className={styles.icon} />
              &nbsp;
              {formatNumberIntoReadable(debitedAmt)}
              <br />
              <p
                style={{
                  display: "inline",
                  fontWeight: "normal",
                  color: "lightgrey",
                  fontSize: "22px",
                  marginTop: "-20px",
                }}
              >
                debited
              </p>
            </h1>
            <h1
              style={{
                fontSize: "42px",
                color: "#34c759",
                textAlign: "center",
              }}
            >
              <Coin size={42} color="#34c759" className={styles.icon} />
              &nbsp;
              {formatNumberIntoReadable(creditedAmt)}
              <br />
              <p
                style={{
                  display: "inline",
                  fontWeight: "normal",
                  color: "lightgrey",
                  fontSize: "22px",
                  marginTop: "-20px",
                }}
              >
                credited
              </p>
            </h1>
          </div>
          <h1>Transactions</h1>
          <table className="ledger">{ledger}</table>
        </div>
      );
    } else {
      window.location.replace("/home");
    }
  }
  useEffect(() => {
    loadMain();

    if ("serviceWorker" in navigator && "PushManager" in window) {
      return navigator.serviceWorker
        .register("/sw.js")
        .then(function (registration) {
          console.log("Service worker successfully registered.");
          return registration;
        })
        .catch(function (err) {
          console.log("Unable to register service worker.", err);
        });
    }
  }, []);

  function comprehendSubject(subject) {
    var out = "";
    for (var key in infoData.subjects) {
      if (key == subject) {
        out = infoData.subjects[key];
      }
    }
    return out;
  }
  function comprehendOutput(output) {
    if (output == "undefined" || output == "") {
      return "No notes yet!";
    } else return output;
  }

  function getNotes(subject, sortByOption = "newest") {
    changeIconHighlight("notes");
    setShowSearch(true);
    var dataset = [];
    var out = [];
    setState(
      <>
        {loadingIcon}
        <h1>Loading notes</h1>{" "}
      </>
    );
    if (uuidValidate(cookies.get("useruuid"))) {
      if (
        subject != "yourNotes" &&
        subject != "purchNotes" &&
        subject != "allNotes"
      ) {
        fetch(`${thisURL}/api/getNotesBySubject`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            org: cookies.get("org"),
            useruuid: cookies.get("useruuid"),
            subject: subject,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            var data = json.notes;
            if (json.status == "fail") {
              setModalContent(
                <>
                  <Cross
                    size={32}
                    color={accentColor.split("&")[0]}
                    onClick={() => {
                      setOpenModal(false);
                    }}
                    style={{
                      float: "right",
                      cursor: "pointer",
                    }}
                  />
                  <br />
                  <TriangleAlertFill size={48} color="red" />
                  <br />
                  <p>
                    Something unexpected happened! Please contact
                    support@schoolthing.org.
                  </p>
                </>
              );
              setOpenModal(true);
            } else {
              dataset = json.notes;
              openNoteStoreView(json.notes, subject);
            }
          })
          .catch((error) => {
            setModalContent(<ErrorInfo>{error}</ErrorInfo>);
            setOpenModal(true);
          });
      } else if (subject == "purchNotes") {
        out = [];
        fetch(`${thisURL}/api/getAllNotes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            org: cookies.get("org"),
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            var data = json.notes;
            openNoteStoreView(json.notes, subject);
          })
          .catch((error) => {
            setModalContent(<ErrorInfo>{error}</ErrorInfo>);
            setOpenModal(true);
          });
      } else if (subject == "yourNotes") {
        out = [];
        fetch(`${thisURL}/api/getAllNotes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            org: cookies.get("org"),
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            var data = json.notes;
            data.forEach((obj) => {
              var hasNotes =
                compiledNotes[obj.uuid] == "written" ? true : false;
              if (hasNotes) {
                dataset.push(obj);
              }
            });
            openNoteStoreView(dataset, subject);
          })
          .catch((error) => {
            setModalContent(<ErrorInfo>{error}</ErrorInfo>);
            setOpenModal(true);
          });
      } else if (subject == "allNotes") {
        console.log("fetching: allNotes");
        fetch(`${thisURL}/api/getAllNotes`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams({
            org: cookies.get("org"),
          }),
        })
          .then((res) => res.json())
          .then((json) => {
            console.log("fetched: allNotes");
            openNoteStoreView(json.notes, subject);
          })
          .catch((error) => {
            setModalContent(<ErrorInfo>{error}</ErrorInfo>);
            setOpenModal(true);
          });
      } else {
        setModalContent(
          <>
            <Cross
              size={32}
              color={accentColor.split("&")[0]}
              onClick={() => {
                setOpenModal(false);
              }}
              style={{
                float: "right",
                cursor: "pointer",
              }}
            />
            <br />

            <TriangleAlertFill size={48} color="red" />
            <br />
            <p>
              Something very unexpected happened! Please email
              support@schoolthing.org with your email.
            </p>
          </>
        );
      }
      function openNoteStoreView(targetData, subject) {
        if (sortByOption == "newest") {
          targetData = targetData;
        } else if (sortByOption == "oldest") {
          targetData = targetData.reverse();
        } else if (sortByOption == "hightolow") {
          targetData = targetData.sort((a, b) => {
            return b.points - a.points;
          });
        } else if (sortByOption == "lowtohigh") {
          targetData = targetData.sort((a, b) => {
            return a.points - b.points;
          });
        } else if (sortByOption == "mostpopular") {
          targetData = targetData.sort((a, b) => {
            return b.likes - a.likes;
          });
        } else if (sortByOption == "leastpopular") {
          targetData = targetData.sort((a, b) => {
            return a.likes - b.likes;
          });
        }
        targetData.forEach((obj) => {
          var hasNotes = obj.uuid in compiledNotes;
          out.push(
            <>
              <div
                className={
                  obj.teacher
                    ? `${styles.adjustWidth} ${styles.teacherNote}`
                    : styles.adjustWidth
                }
                style={{
                  border: "1px solid white",
                  borderRadius: "20px",
                  backgroundColor: "rgba(255, 255, 255, 1)",
                  boxShadow: `0 0 10px ${
                    obj.teacher
                      ? `4px ${accentColor.split("&")[0]}`
                      : "1px #e5e5e5"
                  }`,
                  backdropFilter: "blur(15px)",
                  width: "85%",
                  color: "black",
                  margin: "auto",
                  overflowX: "hidden",
                }}
              >
                <div>
                  <img
                    src={`https://ik.imagekit.io/schoolthing/imgs/${obj.org}/${obj.privateuuid}/0.png`}
                    style={{
                      width: "100%",
                      objectFit: "cover",
                      maxHeight: "300px",
                      zIndex: "-3",
                      borderTopLeftRadius: "20px",
                      borderTopRightRadius: "20px",
                    }}
                  />
                </div>

                {obj.teacher ? (
                  <b
                    style={{
                      fontSize: "20px",
                      color: accentColor.split("&")[0],
                    }}
                  >
                    Teacher Note
                  </b>
                ) : null}
                <div style={{ padding: "10px" }}>
                  <h3>
                    {obj.title}
                    <br />
                    <b style={{ fontSize: "14px" }}>
                      {infoData.subjects[obj.subject].toUpperCase()}
                    </b>
                  </h3>

                  <p dangerouslySetInnerHTML={{ __html: obj.content }}></p>
                  <div
                    style={{
                      position: "sticky",
                      bottom: "2%",
                      width: "100%",
                      textAlign: "center",
                      background: "white",
                      boxShadow: "0 0 10px 4px #e5e5e5",
                      borderRadius: "20px",
                      height: "60px",
                    }}
                  >
                    <p
                      style={{
                        textAlign: "left",
                        display: "flex",
                        flexDirection: "row",
                        justifyContent: "space-between",
                        height: "100%",
                      }}
                      className={styles.updatableButton}
                    >
                      <StyledButton
                        style={{
                          verticalAlign: "middle",
                          backgroundColor: "transparent",
                          border: "none",
                          color: "black",
                          boxShadow: "none",
                          borderRadius: "20px",
                          height: "60px",
                          margin: "0",
                        }}
                      >
                        <img
                          src="icons/heart.png"
                          width="24px"
                          style={{ verticalAlign: "middle" }}
                        />{" "}
                        <span style={{ verticalAlign: "middle" }}>
                          {obj.likes.toLocaleString()}
                        </span>
                      </StyledButton>

                      <StyledButton
                        style={{
                          verticalAlign: "middle",
                          borderRadius: "20px",
                          height: "100%",
                          margin: "0",
                        }}
                        onClick={
                          hasNotes
                            ? () => {
                                viewNote(obj.uuid);
                              }
                            : () => {
                                buyNote(obj.uuid);
                              }
                        }
                      >
                        {hasNotes ? (
                          "Open"
                        ) : parseInt(obj.points) == 0 ? (
                          "Free"
                        ) : (
                          <span>
                            <Coin
                              className={styles.icon}
                              color={buttonIconColor}
                              size={22}
                            />{" "}
                            {obj.points.toLocaleString()}{" "}
                          </span>
                        )}
                      </StyledButton>
                    </p>
                  </div>
                </div>
              </div>
            </>
          );
        });
        setState(
          <>
            <h1>
              {subject == "allNotes"
                ? "All Notes"
                : subject == "purchNotes"
                ? "Purchased Notes"
                : subject == "yourNotes"
                ? "My Notes"
                : `${subject} Notes`}
            </h1>
            <div className={styles.desktopnoteTypeActions}>
              <div
                className={styles.desktopnoteTypeActionItem}
                onClick={() => {
                  getNotes("allNotes");
                }}
              >
                <p style={{ display: "inline", fontSize: "20px" }}>All Notes</p>
              </div>
              <div className={styles.desktopnoteTypeSelectItem}>
                <p>
                  <select
                    onChange={() => {
                      getNotes(subjectSelectRef.current.value);
                    }}
                    ref={subjectSelectRef}
                    style={{ display: "inline", fontSize: "20px" }}
                  >
                    {subjectSelect}
                  </select>
                </p>
              </div>
              <div
                className={styles.desktopnoteTypeActionItem}
                onClick={() => {
                  getNotes("purchNotes");
                }}
              >
                <p style={{ display: "inline", fontSize: "20px" }}>
                  Purchased Notes
                </p>
              </div>

              <div
                className={styles.desktopnoteTypeActionItem}
                onClick={() => {
                  getNotes("yourNotes");
                }}
              >
                <p style={{ display: "inline", fontSize: "20px" }}>My Notes</p>
              </div>
            </div>
            <span>Sort by:</span>
            <br />
            <br />
            <div className={styles.sortRow}>
              <select
                onChange={(e) => {
                  getNotes(subject, e.target.value);
                }}
              >
                <option value="newest">Newest</option>
                <option value="oldest">Oldest</option>
                <option value="mostpopular">Most popular</option>
                <option value="leastpopular">Least popular</option>
              </select>
              <select
                onChange={(e) => {
                  getNotes(subject, e.target.value);
                }}
              >
                <option value="hightolow">High-to-low</option>
                <option value="lowtohigh">Low-to-high</option>
              </select>
            </div>
            <br />
            <br />
            <br />
            <div className={styles.notes}>{out}</div>
            <br />
            <br />
            <br />
            <br />
            <br />
            <br />
          </>
        );
        setOpenModal(false);
      }
    } else {
      window.location.replace("/home");
    }
  }
  return (
    <div style={{ overflowX: "hidden" }}>
      <Head>
        <title>
          {userdata.fname} | {productName}
        </title>
        <meta name="description" content={productName} />
        <meta
          name="theme-color"
          content={
            darkMode === true ? "#121212" : openModal ? "#C7C7C7" : "#F9F9F9"
          }
        />
      </Head>

      <div
        className={
          darkMode == true ? `${styles.cont} ${styles.dark}` : styles.cont
        }
        id="container"
      >
        <section className={styles.backFill}></section>
        <Modal isOpen={openModal} style={customStyles} ariaHideApp={false}>
          <div style={{ textAlign: "center" }}>{modalContent}</div>
        </Modal>
        <Modal
          isOpen={openNoteViewModal}
          style={noteViewStyle}
          onRequestClose={() => {
            setOpenNoteViewModal(false);
          }}
        >
          {noteViewContent}
        </Modal>
        <Modal
          ariaHideApp={false}
          isOpen={showMoreModal}
          closeTimeoutMS={250}
          onRequestClose={() => {
            setShowMoreModal(false);
          }}
          onAfterClose={() => {
            setEndModal(true);
          }}
          style={moreModalSettings}
        >
          <div
            className={
              showMoreModal
                ? `${styles.settingsModal} ${styles.oneTime}`
                : endMoreModal
                ? `${styles.settingsModal} ${styles.lastTime}`
                : styles.settingsModal
            }
            style={{
              textAlign: "left",
              paddingBottom: "20px",
            }}
          >
            <h2>More</h2>
            <div>
              <a
                style={{ color: darkMode == true ? "white" : "black" }}
                className={styles.moreItem}
                onClick={() => {
                  setShowMoreModal(false);
                  managePoints();
                }}
              >
                <Coin
                  strokeWidth={2}
                  size={28}
                  style={{ verticalAlign: "middle" }}
                  color={iconColor}
                />{" "}
                <a
                  style={{
                    color: darkMode == true ? "white" : "black",
                    textAlign: "left",
                  }}
                  className={styles.pointMobile}
                >
                  {userdata.points.toLocaleString()}
                </a>
              </a>
              <br />
              <a
                onClick={() => {
                  setShowMoreModal(false);
                  feed();
                }}
                className={styles.moreItem}
                style={{ color: darkMode == true ? "white" : "black" }}
              >
                <Bell
                  strokeWidth={2}
                  size={28}
                  style={{ verticalAlign: "middle" }}
                  color={
                    iconHighlightStatus.feed
                      ? accentColor.split("&")[0]
                      : iconColor
                  }
                />{" "}
                <span
                  style={{
                    textAlign: "left",
                    color: iconHighlightStatus.feed
                      ? accentColor.split("&")[0]
                      : iconColor,
                  }}
                >
                  Feed
                </span>
              </a>
              <br />
              <a
                onClick={() => {
                  setShowMoreModal(false);
                  settings();
                }}
                style={{ color: darkMode == true ? "white" : "black" }}
                className={styles.moreItem}
              >
                <Gear
                  strokeWidth={2}
                  size={28}
                  style={{ verticalAlign: "middle" }}
                  color={
                    iconHighlightStatus.settings
                      ? accentColor.split("&")[0]
                      : iconColor
                  }
                />{" "}
                <span
                  style={{
                    textAlign: "left",
                    color: iconHighlightStatus.settings
                      ? accentColor.split("&")[0]
                      : iconColor,
                    cursor: "pointer",
                  }}
                >
                  Settings
                </span>
              </a>
              <br />
              <a
                onClick={() => {
                  setShowMoreModal(false);
                  feedback();
                }}
                style={{ color: darkMode == true ? "white" : "black" }}
                className={styles.moreItem}
              >
                <Bug
                  strokeWidth={2}
                  size={28}
                  style={{ verticalAlign: "middle" }}
                  color={
                    iconHighlightStatus.feedback
                      ? accentColor.split("&")[0]
                      : iconColor
                  }
                />{" "}
                <span
                  style={{
                    textAlign: "left",
                    color: iconHighlightStatus.feedback
                      ? accentColor.split("&")[0]
                      : iconColor,
                  }}
                >
                  Feedback
                </span>
              </a>
            </div>
          </div>
        </Modal>
        <>
          <div
            className={
              showSidebar
                ? styles.sidebar
                : `${styles.sidebar} ${styles.closingSidebar}`
            }
          >
            <div
              className={styles.hideMobile}
              style={{
                display: "flex",
                justifyContent: "space-between",
                padding: "10px",
              }}
            >
              <DarkModeSwitch
                onClick={() => {
                  cookies.set("mode", darkMode == true ? false : true);
                  setDarkMode(darkMode ? false : true);
                }}
                checked={darkMode}
                onChange={() => {
                  cookies.set("mode", darkMode == true ? false : true);
                  setDarkMode(darkMode ? false : true);
                }}
                size={30}
              />
              <PanelLeft
                strokeWidth={2}
                size={30}
                className={styles.icon}
                color={iconColor}
                onClick={() => {
                  setShowSidebar(!showSidebar);
                }}
                style={{
                  cursor: "pointer",
                }}
              />
            </div>
            <div className={styles.mobileCont}>
              <div
                className={
                  darkMode
                    ? `${styles.mobile} ${styles.mobileDark}`
                    : styles.mobile
                }
              >
                <a onClick={loadMain} className={styles.lHover}>
                  <Home
                    className={styles.icon}
                    color={
                      iconHighlightStatus.home
                        ? accentColor.split("&")[0]
                        : iconColor
                    }
                    size={28}
                  />{" "}
                  <span
                    className={styles.hideMobile}
                    style={{
                      color: iconHighlightStatus.home
                        ? accentColor.split("&")[0]
                        : iconColor,
                    }}
                  >
                    &nbsp;Home
                  </span>
                </a>

                <a
                  onClick={() => {
                    openPosts(true, false);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  <PeopleGroup
                    className={styles.icon}
                    color={
                      iconHighlightStatus.posts
                        ? accentColor.split("&")[0]
                        : iconColor
                    }
                    size={28}
                  />{" "}
                  <span
                    className={styles.hideMobile}
                    style={{
                      color: iconHighlightStatus.posts
                        ? accentColor.split("&")[0]
                        : iconColor,
                    }}
                  >
                    &nbsp;Posts
                  </span>
                </a>

                <a className={`${styles.lHover}  ${styles.hideMobile}`}>
                  <Link href="/createNote">
                    <span>
                      <Edit
                        className={`${styles.icon}`}
                        color={iconColor}
                        size={28}
                      />
                      <span className={styles.hideMobile}>
                        &nbsp;Create Note
                      </span>
                    </span>
                  </Link>
                </a>
                <a className={`${styles.lHover} ${styles.hideDesktop}`}>
                  <Link href="/createNote">
                    <Edit
                      className={`${styles.icon} ${styles.highlightCircle} ${styles.hideDesktop}`}
                      color="#54BAB9"
                      size={50}
                    />
                  </Link>
                </a>
                <a onClick={ldr} className={styles.lHover}>
                  <AlignLeft
                    className={styles.icon}
                    color={
                      iconHighlightStatus.leaderboard
                        ? accentColor.split("&")[0]
                        : iconColor
                    }
                    size={28}
                  />{" "}
                  <span
                    className={styles.hideMobile}
                    style={{
                      color: iconHighlightStatus.leaderboard
                        ? accentColor.split("&")[0]
                        : iconColor,
                    }}
                  >
                    &nbsp;Leaderboard
                  </span>
                </a>
                <a onClick={managePoints} className={styles.lHover}>
                  <Wallet
                    className={styles.icon}
                    color={
                      iconHighlightStatus.points
                        ? accentColor.split("&")[0]
                        : iconColor
                    }
                    size={28}
                  />{" "}
                  <span
                    className={styles.hideMobile}
                    style={{
                      color: iconHighlightStatus.points
                        ? accentColor.split("&")[0]
                        : iconColor,
                    }}
                  >
                    &nbsp;Wallet
                  </span>
                </a>
                <a
                  onClick={trending}
                  className={`${styles.lHover} ${styles.hideMobile}`}
                >
                  <Fire
                    className={styles.icon}
                    color={
                      iconHighlightStatus.trending
                        ? accentColor.split("&")[0]
                        : iconColor
                    }
                    size={28}
                  />{" "}
                  <span
                    className={styles.hideMobile}
                    style={{
                      color: iconHighlightStatus.trending
                        ? accentColor.split("&")[0]
                        : iconColor,
                    }}
                  >
                    &nbsp;Trending
                  </span>
                </a>
                <a
                  onClick={() => {
                    getNotes("allNotes", "newest");
                  }}
                  className={`${styles.lHover} ${styles.hideMobile}`}
                >
                  <Pencil
                    color={
                      iconHighlightStatus.notes
                        ? accentColor.split("&")[0]
                        : iconColor
                    }
                    strokeWidth={2}
                    size={28}
                  />{" "}
                  <span
                    style={{
                      color: iconHighlightStatus.notes
                        ? accentColor.split("&")[0]
                        : iconColor,
                    }}
                    className={styles.hideMobile}
                  >
                    &nbsp;Notes
                  </span>
                </a>
              </div>
            </div>
            <div
              className={
                darkMode
                  ? `${styles.twoBody} ${styles.twoBodyDark}`
                  : styles.twoBody
              }
            >
              <header
                className={styles.twoRow}
                style={{ padding: "0px 10px", marginLeft: "7px" }}
              >
                <span
                  onClick={() => {
                    setState(
                      <>
                        {loadingIcon}
                        <br />
                        Refreshing webapp...
                      </>
                    );
                    window.location.reload();
                  }}
                >
                  {/* <img
                    src={logo}
                    width={lDim}
                    height={lDim}
                    style={{ verticalAlign: "middle" }}
                    alt={`The ${productName} Logo`}
                  />*/}
                  <img
                    src={`https://secure.gravatar.com/avatar/${md5(
                      userdata.email
                    )}?s=256&d=https%3A%2F%2Fschoolthing.org%2Ficons%2FloadingLogo.png&r=g`}
                    style={{
                      verticalAlign: "middle",
                      width: 64,
                      borderRadius: "50%",
                    }}
                  />
                  <h1
                    style={{
                      padding: "0px 20px",
                      display: "inline",
                      fontSize: "20px",
                    }}
                  >
                    {userdata.fname.split("").length <= 12
                      ? userdata.fname
                      : productName}
                  </h1>
                </span>
                <span>
                  <a>
                    <DarkModeSwitch
                      checked={darkMode}
                      onChange={() => {
                        cookies.set("mode", darkMode ? false : true);
                        setDarkMode(darkMode ? false : true);
                      }}
                      style={{ verticalAlign: "middle", marginBottom: "10px" }}
                      size={30}
                    />
                  </a>
                  <a
                    onClick={() => {
                      setShowMoreModal(true);
                    }}
                  >
                    <ThreeLineHorizontal
                      strokeWidth={2}
                      size={30}
                      className={styles.icon}
                      color={iconColor}
                    />
                  </a>
                </span>
              </header>
            </div>
            <div className={styles.hideDesktop}>
              <br />
              <br />
            </div>
            <p className={styles.twoRow} style={{ padding: "0px 10px" }}></p>
            <div ref={notesRef}>
              {showSearch ? (
                <div
                  className={styles.hideDesktop}
                  style={{ margin: "5px 10px" }}
                >
                  <br />
                  <br />
                  <input
                    type="text"
                    placeholder="Search for notes..."
                    ref={searchMobileRef}
                    onFocus={() => {
                      setExitSearch(true);
                      search("focus", true);
                    }}
                    onInput={() => {
                      search("search", true);
                    }}
                    style={{
                      border: "1px solid white",
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      boxShadow: `0 0 8px 4px ${accentColor.split("&")[0]}`,
                      backdropFilter: "blur(15px)",
                      fontSize: "16px",
                      margin: "auto",
                      width: "75%",
                      color: staticIconColor,
                      fontFamily: "Rubik",
                    }}
                  />
                  &nbsp;&nbsp;&nbsp;
                  <StyledButton
                    onClick={() => {
                      loadMain();
                      searchMobileRef.current.value = "";
                    }}
                    style={{
                      height: "73px",
                      width: "20%",
                      marginLeft: "5px",
                    }}
                  >
                    <Cross
                      size={24}
                      className={styles.icon}
                      color={staticIconColor}
                    />
                  </StyledButton>{" "}
                  {noteState ? (
                    <div id="notes">
                      <br />
                      <div className={styles.actions}>
                        <div
                          className={styles.actionItem}
                          onClick={() => {
                            setCurrentActionFocus("home");
                            setShowNoteType(false);
                            loadMain();
                          }}
                        >
                          <Home
                            className={styles.icon}
                            color={iconColor}
                            size={24}
                            style={{ padding: "0 5px" }}
                          />
                          <p style={{ display: "inline", fontSize: "20px" }}>
                            {currentActionFocus == "home" ? "Home" : null}
                          </p>
                        </div>

                        <div
                          className={styles.actionItem}
                          onClick={() => {
                            trending();
                          }}
                        >
                          <Fire
                            className={styles.icon}
                            color={iconColor}
                            size={24}
                            style={{ padding: "0 5px" }}
                          />

                          <p style={{ display: "inline", fontSize: "20px" }}>
                            {currentActionFocus == "trending"
                              ? "Trending"
                              : null}
                          </p>
                        </div>
                        <div
                          className={styles.actionItem}
                          onClick={() => {
                            setCurrentActionFocus("fy");
                            setShowNoteType(false);
                            forYou();
                          }}
                        >
                          <Plant
                            className={styles.icon}
                            color={iconColor}
                            size={24}
                            style={{ padding: "0 5px" }}
                          />

                          <p style={{ display: "inline", fontSize: "20px" }}>
                            {currentActionFocus == "fy" ? "For You" : null}
                          </p>
                        </div>

                        <div
                          className={styles.actionItem}
                          onClick={() => {
                            setCurrentActionFocus("notes");
                            setShowNoteType(true);
                            getNotes("allNotes");
                          }}
                        >
                          <Pencil
                            className={styles.icon}
                            color={iconColor}
                            size={24}
                            style={{ padding: "0 5px" }}
                          />
                          <p style={{ display: "inline", fontSize: "20px" }}>
                            {currentActionFocus == "notes" ? "Notes" : null}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {showNoteType ? (
                    <div className={styles.noteTypeActions}>
                      <div
                        className={styles.noteTypeActionItem}
                        onClick={() => {
                          getNotes("allNotes");
                        }}
                      >
                        <p style={{ display: "inline", fontSize: "20px" }}>
                          All Notes
                        </p>
                      </div>
                      <div className={styles.noteTypeSelectItem}>
                        <p>
                          <select
                            onChange={() => {
                              getNotes(subjectSelectRef.current.value);
                            }}
                            ref={subjectSelectRef}
                            style={{ display: "inline", fontSize: "20px" }}
                          >
                            {subjectSelect}
                          </select>
                        </p>
                      </div>
                      <div
                        className={styles.noteTypeActionItem}
                        onClick={() => {
                          getNotes("purchNotes");
                        }}
                      >
                        <p style={{ display: "inline", fontSize: "20px" }}>
                          Purchased Notes
                        </p>
                      </div>

                      <div
                        className={styles.noteTypeActionItem}
                        onClick={() => {
                          getNotes("yourNotes");
                        }}
                      >
                        <p style={{ display: "inline", fontSize: "20px" }}>
                          My Notes
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>
              ) : null}
              <div className={styles.hideDesktop}>
                <br />
                {noteState}
              </div>
            </div>
            <div
              className={styles.hideMobile}
              style={{
                padding: "0px 10px",
                paddingTop: "50%",
                cursor: "pointer",
              }}
            >
              <a onClick={managePoints}>
                <Coin size={28} className={styles.icon} color={iconColor} />{" "}
                <span>&nbsp;&nbsp;{pointVal}</span>
              </a>

              <a
                onClick={feed}
                className={styles.hideMobile}
                style={{
                  color: iconHighlightStatus.feed
                    ? accentColor.split("&")[0]
                    : iconColor,
                  cursor: "pointer",
                }}
              >
                <Bell
                  className={styles.icon}
                  color={
                    iconHighlightStatus.feed
                      ? accentColor.split("&")[0]
                      : iconColor
                  }
                  size={28}
                />
                &nbsp;&nbsp;Feed
              </a>
              <a
                onClick={settings}
                className={styles.hideMobile}
                style={{
                  color: iconHighlightStatus.settings
                    ? accentColor.split("&")[0]
                    : iconColor,
                  cursor: "pointer",
                }}
              >
                <Gear
                  className={styles.icon}
                  color={
                    iconHighlightStatus.settings
                      ? accentColor.split("&")[0]
                      : iconColor
                  }
                  size={28}
                />
                &nbsp;&nbsp;Settings
              </a>
            </div>
          </div>

          <div
            className={showSidebar ? styles.content : styles.contentFull}
            style={{ textAlign: "center" }}
          >
            <div
              className={
                showSidebar
                  ? `${styles.showSidebarButton} ${styles.sidebarButtonClosingAnimation}`
                  : styles.showSidebarButton
              }
              onClick={() => {
                setShowSidebar(!showSidebar);
              }}
              style={{ textAlign: "center", cursor: "pointer" }}
            >
              <PanelLeft size={40} color={accentColor.split("&")[0]} />
            </div>
            <br />
            {showSearch ? (
              <div className={styles.hideMobile} style={{ margin: "5px 10px" }}>
                <input
                  type="text"
                  placeholder="Search for notes!"
                  ref={searchRef}
                  onFocus={() => {
                    setExitSearch(true);
                    search("focus");
                  }}
                  onInput={() => {
                    search("search");
                  }}
                  style={{
                    border: "1px solid white",
                    backgroundColor: "rgba(255, 255, 255, 1)",
                    boxShadow: `0 0 10px 5px ${accentColor.split("&")[0]}`,
                    backdropFilter: "blur(15px)",
                    fontSize: "16px",
                    margin: "auto",
                    width: "75%",
                    marginBottom: "50px",
                    color: iconColor,
                    fontFamily: "Rubik",
                  }}
                  className={styles.updatableButton}
                />
                &nbsp;&nbsp;&nbsp;
                <StyledButton
                  onClick={() => {
                    loadMain();
                  }}
                  style={{
                    height: "73px",
                    marginLeft: "5px",
                    border: "none",
                    borderRadius: "20px",
                  }}
                >
                  <Cross
                    size={24}
                    className={styles.icon}
                    color={staticIconColor}
                  />
                </StyledButton>
              </div>
            ) : null}
            {state === undefined || state == "" ? (
              <>
                <br />
                <TriangleAlertFill size={48} color="red" />
                <br />
                <p>
                  Something went wrong. Try again later, or force open the site
                  by clicking the button below.
                </p>
                <br />
                <StyledButton onClick={loadMain}>Start</StyledButton>
              </>
            ) : noteState == null ? (
              <div>{state}</div>
            ) : (
              <div>{state}</div>
            )}
            <br />
            <br />
            <br />
          </div>
        </>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  if (uuidValidate(ctx.req.cookies.useruuid) && ctx.req.cookies.org) {
    function comprehendOrdinal(n) {
      var s = ["th", "st", "nd", "rd"];
      var v = n % 100;
      return n + (s[(v - 20) % 10] || s[v] || s[0]);
    }
    var useruuid = ctx.req.cookies.useruuid;
    var org = ctx.req.cookies.org;
    const ldr =
      await sql`SELECT uuid, fname, lname, email, class, verified, points, teacher from users WHERE org=${org}`;
    var ldrRanked = ldr.rows;
    ldrRanked.sort((a, b) => {
      return b.points - a.points;
    });
    var userd =
      await sql`SELECT * from users WHERE uuid=${useruuid} AND org=${org}`;
    var notes = await sql`SELECT * from notes`;
    var info = await sql`SELECT * from organisations WHERE id=${org}`;
    var everySingleUser =
      await sql`SELECT email, fname, lname from users WHERE org=${org}`;
    var userEmails = [];
    everySingleUser.rows.forEach((obj) => {
      var name = `${obj.fname} ${obj.lname}`;
      userEmails.push({ email: obj.email, name: name });
    });
    var idata = info.rows[0];
    idata.grades = JSON.parse(idata.grades);
    idata.subjects = JSON.parse(idata.subjects);
    var i = 0;
    var ldrPlace;
    ldrRanked.map((obj) => {
      i++;
      if (obj.uuid == useruuid) {
        ldrPlace = comprehendOrdinal(i);
      }
    });
    var trendingNotes = await sql`SELECT * from notes WHERE org=${org}`;
    trendingNotes.rows.sort((a, b) => {
      return (b.likes + b.purchases) / 2 - (a.likes + a.purchases) / 2;
    });
    var notices = await sql`SELECT * from notices WHERE org=${org}`;
    var getRandomPost =
      await sql`select * from posts order by random() limit 3;`;
    return {
      props: {
        redirect: false,
        userdata: userd.rows[0],
        searchval: notes.rows,
        infoData: idata,
        ldrData: ldrRanked,
        ldrPlace: ldrPlace,
        userEmails: userEmails,
        trendingNotes: trendingNotes.rows,
        noticeData: notices.rows,
        userPreferMode: ctx.req.cookies.mode,
        userPreferColor: userd.rows[0].accentcolor,
        getRandomPost: getRandomPost.rows,
      },
    };
  } else {
    const { res } = ctx;
    return {
      props: {
        redirect: "/home",
        userPreferColor: 0,
      },
    };
  }
};
