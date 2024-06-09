import Head from "next/head";
import Link from "next/link";
import styles from "../main/Main.module.scss";
import { sql } from "@vercel/postgres";
import { useRef, useState, useEffect } from "react";
import { thisURL, productName, version } from "../../resources/strings.js";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
const cookies = new Cookies();
import {
  ArrowCycle,
  ChevronLeft,
  EyeOpen,
  EyeClosed,
  Clipboard,
  Cross,
  TriangleAlertFill,
} from "akar-icons";
const accentColor = '#80D7E0&white'
import { validate as uuidValidate } from "uuid";
import Modal from "react-modal";
var iconColor = "#1B2430";
const customStyles = {
  overlay: {
    backgroundColor: "#00000033",
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
  var [openModal, setOpenModal] = useState(false);
  var [modalContent, setModalContent] = useState();
  var [showPassword, setShowPassword] = useState(false);

  var forgotEmailRef = useRef();
  var passwordRef = useRef();
  function val() {
    setOpenModal(true);

    setModalContent(
      <>
        {loadingIcon}
        <h1>Authenticating...</h1>
      </>
    );
    fetch(`${thisURL}/api/validate/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        org: userdata.id,
        teacher: false,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
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
            <p>Your email or password is incorrect.</p>
          </>
          );
        } else {
          //set cookies to expire in 60 days
          var date = new Date();
          date.setTime(date.getTime() + 60 * 24 * 60 * 60 * 1000);
          setModalContent(
            <>
              <h1>Logged in!</h1>
              <p>You will be redirected shortly.</p>
            </>
          );
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
          window.location.href = "/main?followthrough=m";
        }
      })
      .catch((err) => {
        setOpenModal(true);
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
            <p>There was an error connecting to the server.</p>
          </>
        );
      });
  }

  function forgot() {
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
        <h1>Forgot Password</h1>
        <p>
          Enter your email below and we will send you a link to reset your
          password.
        </p>
        <br />
        <input
          type="email"
          placeholder={`email@${userdata.domain}`}
          ref={forgotEmailRef}
          style={{ width: "80%" }}
        />
        <br />{" "}
        <button
          onClick={() => {
            setOpenModal(false);
          }}
          style={{
            background: "#f9f9f9",
          }}
        >
          Close
        </button>
        &nbsp;&nbsp;&nbsp;&nbsp;
        <button
          onClick={() => {
            sendReset(forgotEmailRef.current.value);
          }}
        >
          Send
        </button>
      </>
    );
    setOpenModal(true);
    function sendReset(email) {
      if (email.includes("@") && email.includes(".")) {
        setModalContent(
          <>
            {loadingIcon}
            <h1>Sending email</h1>
          </>
        );
        fetch(`${thisURL}/api/forgot`, {
          method: "POST",
          headers: { "Content-Type": "application/x-www-form-urlencoded" },
          body: new URLSearchParams({
            email: email,
            org: userdata.id,
          }),
        })
          .then((res) => res.json())
          .then((json) => {
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
                  <p>{json.message}</p>
                </>
              );
              setOpenModal(true);
            } else {
              setModalContent(
                <>
                  <h1>Email sent!</h1>
                  <p>You will receive an email shortly.</p>
                </>
              );
              setOpenModal(true);
            }
          })
          .catch((err) => {
            setOpenModal(true);
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
                <p>There was an error connecting to the server.</p>
              </>
            );
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
            <p>Please enter a valid email.</p>
          </>
        );
        setOpenModal(true);
      }
    }
  }
  if (uuidValidate(cookies.get("useruuid"))) {
    window.location.href = "/main";
    return <h1></h1>;
  } else {
    cookies.remove("useruuid");
    return (
      <div className={styles.container}>
        <Head>
          <meta
            name="theme-color"
            content={openModal ? "#C7C7C7" : "#F9F9F9"}
          />
        </Head>
        <Modal isOpen={openModal} style={customStyles}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            {modalContent}
          </div>
        </Modal>
        <Head>
          <title>{productName} Login</title>
          <meta name="description" content={productName} />
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
                width="50"
                height="50"
                style={{ verticalAlign: "middle", marginRight: "10px" }}
                alt={`The ${productName} Logo`}
              />
              {userdata.name}
            </h1>
          </div>
          <br />
          <h2>Log In</h2>
          <br />
          <input
            type="email"
            placeholder={`email@${userdata.domain}`}
            ref={emailRef}
            style={{ width: "350px", borderRadius: "20px" }}
          />
          <br />
          <br />
          <div>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              ref={passwordRef}
              style={{
                width: "350px",
                verticalAlign: "middle",
                borderRadius: "20px",
              }}
            />
          </div>
          <button
            onClick={() => {
              val();
            }}
            style={{
              borderRadius: "20px",
              width: "350px",
              height: "70px",
              boxShadow: "0px 0px 10px #efefef",
              color: "white",
              border: "2px solid #efefef",
            }}
          >
            Log In
          </button>
          <br />
          <a onClick={forgot} style={{ color: "lightgrey", fontSize: "18px" }}>
            Forgot password?
          </a>
          <br />
          <br />
          <button
            onClick={() => {
              router.push(`/${userdata.id}/signup`);
            }}
            style={{
              borderRadius: "20px",
              width: "350px",
              height: "70px",
              boxShadow: "0px 0px 10px #efefef",
              color: "white",
              border: "2px solid #efefef",
            }}
          >
            Sign Up
          </button>
          <br />
          <br />
          <p
            style={{
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
          <div
            style={{
              boxShadow: "0px 0px 10px #efefef",
              borderRadius: "20px",
              border: "2px solid #efefef",
              width: "350px",
              background: "white",
              display: "grid",
              gridTemplateColumns: "15% 5% 70%",
              gap: "25px",
              margin: "auto",
              padding: "10px",
              cursor: "pointer",
            }}
            onClick={() => {
              router.push(`/${userdata.id}/teacher`);
            }}
          >
            <Clipboard
              size={72}
              strokeWidth={1}
              style={{ verticalAlign: "middle" }}
            />
            <span
              style={{
                width: "2px",
                height: "80px",
                verticalAlign: "middle",
                background: "grey",
              }}
            ></span>
            <h2
              style={{
                verticalAlign: "middle",
                margin: "0px 0px 0px 20px",
                textAlign: "left",
              }}
            >
              Log In as a Teacher
            </h2>
          </div>
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
          <br />
          <br />
          <br />
        </div>
      </div>
    );
  }
}

export const getServerSideProps = async (ctx) => {
  const { path } = ctx.query;
  var getOrgDataREQ = await sql`SELECT * FROM organisations WHERE id=${path}`;
  var ud = getOrgDataREQ.rows[0];
  if (getOrgDataREQ.rows.length != 0) {
    ud.grades = JSON.parse(ud.grades);
    ud.subjects = JSON.parse(ud.subjects);

    return {
      props: {
        userdata: ud,
        path: path,
      },
    };
  } else {
    return {
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }
};
