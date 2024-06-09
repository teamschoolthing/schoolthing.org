import Head from "next/head";
import Link from "next/link";
import styles from "../../main/Main.module.scss";
import { sql } from "@vercel/postgres";
import { useRef, useState, useEffect } from "react";
import { thisURL, productName } from "../../../resources/strings.js";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
const cookies = new Cookies();
import { ArrowCycle, ChevronLeft } from "akar-icons";
import { validate as uuidValidate } from "uuid";
import Modal from "react-modal";
var iconColor = "#1B2430";
const customStyles = {
  overlay: {
    backgroundColor: "#00000033",
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

export default function Home({ userdata, prefMode }) {
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
  var passwordRef = useRef();
  function val() {
    setOpenModal(true);

    setModalContent(
      <>
        {loadingIcon}
        <h1>Authenticating</h1>
      </>
    );
    fetch(`${thisURL}/api/validate/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        email: emailRef.current.value,
        password: passwordRef.current.value,
        org: userdata.id,
        teacher: true,
      }),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status == "fail") {
          setModalContent(
            <>
              <h1>Error :(</h1>
              <p>Your email or password is incorrect</p>
              <br />
              <button
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Try again
              </button>
            </>
          );
        } else {
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
          window.location.href = "/teacher";
        }
      })
      .catch((err) => {
        setOpenModal(true);
        setModalContent(
          <>
            <h1>Error :(</h1>
            <p>There was an error connecting to the server.</p>
            <br />
            <button
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Try again
            </button>
          </>
        );
      });
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
          <title>{productName} Login - Teacher</title>
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
              Teacher
            </h1>
          </div>
          <h2>Log In</h2>
          <br />
          <br />
          <h2>{userdata.name}</h2>
          <br />
          <br />
          <br />
          <input
            type="email"
            placeholder={`email@${userdata.domain}`}
            ref={emailRef}
            style={{ width: "80%" }}
          />
          <br />
          <br />
          <input
            type="password"
            placeholder="password"
            ref={passwordRef}
            style={{ width: "80%" }}
          />
          <br />
          <button
            onClick={() => {
              val();
            }}
          >
            Log In
          </button>
          <br />
          <br />
          Site not responding? Please email support@schoolthing.org
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
  ud.grades = JSON.parse(ud.grades);
  ud.subjects = JSON.parse(ud.subjects);
  return {
    props: {
      userdata: ud,
    },
  };
};
