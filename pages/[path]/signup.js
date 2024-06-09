import Head from "next/head";
import Link from "next/link";
import styles from "../main/Main.module.scss";
import { sql } from "@vercel/postgres";
import { useRef, useEffect, useState } from "react";
import {
  backendURL,
  productName,
  thisURL,
  version,
} from "../../resources/strings.js";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import { ArrowCycle, ChevronLeft, EyeOpen, EyeClosed } from "akar-icons";
import Modal from "react-modal";
const cookies = new Cookies();
var iconColor = "#1B2430";
export default function Home({ userdata, path }) {
  var loadingIcon = (
    <ArrowCycle
      strokeWidth={2}
      size={28}
      className={`${styles.icon} ${styles.loadingIcon}`}
      color={iconColor}
      style={{ margin: "auto" }}
    />
  );
  const router = useRouter();
  var emailRef = useRef();
  var passwordRef = useRef();
  var codeRef = useRef();
  var fnameRef = useRef();
  var lnameRef = useRef();
  var classRef = useRef();
  var titleRef = useRef();
  var [openModal, setOpenModal] = useState(false);
  var [showPassword, setShowPassword] = useState(false);
  var [isRequired, setIsRequired] = useState({
    fname: false,
    lname: false,
    email: false,
    password: false,
    class: path == "global" ? true : false,
  });
  var [modalContent, setModalContent] = useState();
  var [emailCode, setEmailCode] = useState("");
  var [useCode, setUseCode] = useState(false);
  var [code, setCode] = useState("");
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(15px)",
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
  var grades = [];
  var formattedGrades = JSON.parse(userdata.grades);
  for (var key in formattedGrades) {
    grades.push(<option value={key}>{formattedGrades[key]}</option>);
  }

  function val(e) {
    e.preventDefault();
    var isAllTrue = false;
    var itemThatIsFalse = "";
    for (var key in isRequired) {
      if (isRequired[key] == true) {
        isAllTrue = true;
      } else {
        isAllTrue = false;
        itemThatIsFalse = key;
        break;
      }
    }
    var data = {
      fname: fnameRef.current.value.trim(),
      lname: lnameRef.current.value.trim(),
      email: emailRef.current.value.trim().toLowerCase(),
      password: passwordRef.current.value,
      class: classRef.current.value || 0,
      org: userdata.id,
    };

    if (path == "global") {
      data.class = "all";
      var cIR = isRequired;
      cIR.class = true;
      setIsRequired(cIR);
    }
    if (useCode == true) {
      data.code = codeRef.current.value;
    } else {
      data.code = "null";
    }
    if (isAllTrue == true) {
      if (
        emailRef.current.value.includes("@" + userdata.domain) ||
        useCode ||
        path == "global"
      ) {
        setModalContent(
          <>
            {loadingIcon}
            <h1>Creating account...</h1>
          </>
        );
        setOpenModal(true);
        console.log("payload", data);
        fetch(`${thisURL}/api/createAccount`, {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: new URLSearchParams(data),
        })
          .then((res) => res.json())
          .then((json) => {
            if (json.status == "fail") {
              setModalContent(
                <>
                  <h1>Error :(</h1>
                  <p>
                    This email already exists. If this is your email, please log
                    in. If you've forgotten your password, email
                    support@schoolthing.org
                  </p>
                  <button
                    onClick={() => {
                      setOpenModal(false);
                    }}
                  >
                    Dismiss
                  </button>
                </>
              );
              setOpenModal(true);
            } else if (json.status == "incorrectCode") {
              setModalContent(
                <>
                  <h1>Error :(</h1>
                  <p>
                    Your login code is incorrect. Please try again or contact
                    your Schoolthing Community admin.
                  </p>
                  <button
                    onClick={() => {
                      setOpenModal(false);
                    }}
                  >
                    Dismiss
                  </button>
                </>
              );
              setOpenModal(true);
            } else if (json.status == "success") {
              setModalContent(
                <>
                  <h1>Success!</h1>
                  <p>
                    Your account has been created! Welcome to {productName}!
                    <br />
                    You will be redirected shortly.
                  </p>
                </>
              );
              setOpenModal(true);
              var date = new Date();
              date.setTime(date.getTime() + 60 * 24 * 60 * 60 * 1000);
              cookies.set("useruuid", json.data, {
                path: "/",
                expires: date,
                maxAge: 2592000000,
              });
              cookies.set("org", userdata.id, {
                path: "/",
                expires: date,
                maxAge: 2592000000,
              });
              cookies.set("mode", false, {
                path: "/",
                expires: date,
                maxAge: 2592000000,
              });
              router.push("/main?followthrough=m");
            } else {
              setModalContent(
                <>
                  <h1>Error :(</h1>
                  <p>
                    An unknown error occurred. Please try again or contact
                    support@schoolthing.org for help.
                  </p>
                </>
              );
              setOpenModal(true);
            }
          });
      } else if (!useCode) {
        setModalContent(
          <>
            <h1>Error :(</h1>
            <p>Please use an @{userdata.domain} email address.</p>
            <p>
              If you do not have an @{userdata.domain} address, you can request
              your Schoolthing Community admin to give you a code that will
              allow you to log in without the organisation email.
            </p>
            <button onClick={() => setOpenModal(false)}>Dismiss</button>
          </>
        );
        setOpenModal(true);
      }
    } else {
      var prettifiedError =
        itemThatIsFalse == "fname"
          ? "First Name"
          : itemThatIsFalse == "lname"
          ? "Last Name"
          : itemThatIsFalse == "email"
          ? "Email"
          : itemThatIsFalse == "password"
          ? "password"
          : "grade";
      setModalContent(
        <>
          <h1>Error:(</h1>
          <p>Please fill in the {prettifiedError} field.</p>
          <button onClick={() => setOpenModal(false)}>Dismiss</button>
        </>
      );
      setOpenModal(true);
    }
  }
  return (
    <div className={styles.container}>
      <Modal isOpen={openModal} style={customStyles}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          {modalContent}
        </div>
      </Modal>
      <Head>
        <title>{productName}</title>
        <meta name="description" content={productName} />
        <meta name="theme-color" content={openModal ? "#C7C7C7" : "#F9F9F9"} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ textAlign: "center" }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "10% 80%",
            margin: "20px 0px",
          }}
        >
          {" "}
          <Link href="/home">
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
            {userdata.name}
          </h1>
        </div>
        <br />
        <h2>Sign Up</h2>
        <br />
        <br />
        <h3>Get Started</h3>
        <input
          type="text"
          placeholder="First Name"
          ref={fnameRef}
          required={true}
          style={{ width: "350px" }}
          onChange={(e) => {
            if (e.target.value?.trim() == "") {
              var nIR = isRequired;
              nIR.fname = false;
              setIsRequired(nIR);
            } else {
              var nIR = isRequired;
              nIR.fname = true;
              setIsRequired(nIR);
            }
          }}
        />{" "}
        <br />
        <br />
        <input
          type="text"
          placeholder="Last Name"
          ref={lnameRef}
          required={false}
          style={{ width: "350px" }}
          onChange={(e) => {
            if (e.target.value?.trim() == "") {
              var nIR = isRequired;
              nIR.lname = false;
              setIsRequired(nIR);
            } else {
              var nIR = isRequired;
              nIR.lname = true;
              setIsRequired(nIR);
            }
          }}
        />
        <>
          {path != "global" ? (
            <>
              <br />
              <br />
            </>
          ) : null}
          <select
            {...(path == "global" ? { hidden: true } : {})}
            ref={classRef}
            onChange={(e) => {
              if (e.target.value == "") {
                var nIR = isRequired;
                nIR.class = false;
                setIsRequired(nIR);
              } else {
                var nIR = isRequired;
                nIR.class = true;
                setIsRequired(nIR);
              }
            }}
            defaultValue={""}
            style={{
              width: "350px",
            }}
          >
            <option value="" selected>
              Choose a grade
            </option>
            {grades}
          </select>
        </>
        <br />
        <br />
        <input
          className="input"
          type="email"
          onChange={(e) => {
            setEmailCode(emailRef.current.value);
            if (e.target.value?.trim() == "") {
              var nIR = isRequired;
              nIR.email = false;
              setIsRequired(nIR);
            } else {
              var nIR = isRequired;
              nIR.email = true;
              setIsRequired(nIR);
            }
          }}
          ref={emailRef}
          placeholder={`email@${userdata.domain}`}
          required={true}
          style={{ width: "350px" }}
        />
        <br />
        <br />
        <input
          className="input"
          type={showPassword ? "text" : "password"}
          placeholder="password"
          onChange={(e) => {
            if (e.target.value?.trim() == "") {
              var nIR = isRequired;
              nIR.password = false;
              setIsRequired(nIR);
            } else {
              var nIR = isRequired;
              nIR.password = true;
              setIsRequired(nIR);
            }
          }}
          ref={passwordRef}
          required={true}
          style={{ width: "350px" }}
        />
        <br />
        <span
          onClick={() => setShowPassword(!showPassword)}
          style={{
            width: "45px",
            padding: "10px",
            cursor: "pointer",
          }}
        >
          <br />
          {showPassword ? (
            <EyeOpen
              size={32}
              style={{
                verticalAlign: "middle",
              }}
            />
          ) : (
            <EyeClosed
              size={32}
              style={{
                verticalAlign: "middle",
              }}
            />
          )}{" "}
          {showPassword ? "Hide" : "Show"} Password
        </span>
        <br />
        {!emailCode.endsWith(`@${userdata.domain}`) &&
        emailCode.includes("@") &&
        path != "global" ? (
          <>
            <br />
            <br />
            <input
              ref={codeRef}
              placeholder="Enter Login Code"
              style={{ width: "350px" }}
              onChange={() => {
                setUseCode(
                  !["", undefined, null].includes(codeRef.current.value?.trim())
                    ? true
                    : false
                );
              }}
            />
          </>
        ) : null}
        <br />
        <button
          onClick={val}
          style={{
            borderRadius: "20px",
            width: "350px",
            height: "70px",
            boxShadow: "0px 0px 10px #efefef",
            color: "white",
            border: "2px solid #efefef",
          }}
        >
          Create account!
        </button>
        <br />
        <br />
        <p
          style={{
            width: "100%",
            textAlign: "center",
            borderBottom: " 1px solid lightgrey",
            lineHeight: "0.1em",
            width: "350px",
            margin: "auto",
          }}
        >
          <span
            style={{
              background: "#f9f9f9",
              padding: "0 10px",
              color: "lightgrey",
            }}
          >
            or
          </span>
        </p>
        <br />
        <button
          style={{
            borderRadius: "20px",
            width: "350px",
            height: "70px",
            boxShadow: "0px 0px 10px #efefef",
            color: "white",
            border: "2px solid #efefef",
          }}
          onClick={() => {
            router.push(`/${userdata.id}`);
          }}
        >
          Log In
        </button>
        <br />
        <br />
        <p
          style={{
            color: "lightgrey",
          }}
        >
          © {new Date().getFullYear()} {productName}&nbsp;|&nbsp;Version{" "}
          {version}.{" "}
          <a
            style={{
              color: "#80D7E0",
            }}
            href={`/whats-new`}
          >
            What's new?
          </a>
          &nbsp;|&nbsp;
          <a href="mailto:support@schoolthing.org">Report a Problem</a>
        </p>
      </div>
    </div>
  );
}
export const getServerSideProps = async (ctx) => {
  const { rows } =
    await sql`SELECT * from organisations WHERE id=${ctx.query.path}`;
  return { props: { userdata: rows[0], path: ctx.query.path } };
};
