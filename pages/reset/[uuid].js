import Head from "next/head";
import Link from "next/link";
import styles from "../main/Main.module.scss";
import { sql } from "@vercel/postgres";
import { useRef, useState, useEffect } from "react";
import { thisURL, productName } from "../../resources/strings.js";
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

export default function Home({ userdata }) {
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
  var newPasswordRef = useRef();
  function resetpassword() {
    if (passwordRef.current.value != newPasswordRef.current.value) {
      setModalContent(
        <>
          <h1>Passwords do not match</h1>
          <button onClick={() => setOpenModal(false)}>Try again</button>
        </>
      );
      setOpenModal(true);
    } else {
      setModalContent(
        <>
          {loadingIcon}
          <h1>Resetting password</h1>
        </>
      );
      setOpenModal(true);
      fetch(`${thisURL}/api/resetpassword/`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          password: passwordRef.current.value,
          uuid: router.query.uuid,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            setModalContent(
              <>
                <h1>{data.error}</h1>
                <button onClick={() => setOpenModal(false)}>Try again</button>
              </>
            );
            setOpenModal(true);
          } else {
            setModalContent(
              <>
                <h1>Password reset successfully</h1>
                <button onClick={() => setOpenModal(false)}>Continue</button>
              </>
            );
          }
          setOpenModal(true);
        })
        .catch((err) => {
          setModalContent(
            <>
              <h1>There was an error</h1>
              <button onClick={() => setOpenModal(false)}>Try again</button>
            </>
          );
          setOpenModal(true);
        });
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <meta name="theme-color" content={openModal ? "#C7C7C7" : "#F9F9F9"} />
      </Head>
      <Modal isOpen={openModal} style={customStyles}>
        <div style={{ textAlign: "center", padding: "20px" }}>
          {modalContent}
        </div>
      </Modal>
      <Head>
        <title>Reset Password | {productName}</title>
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
              width="40"
              height="40"
              style={{ verticalAlign: "middle", marginRight: "10px" }}
              alt={`The ${productName} Logo`}
            />
            Reset Password
          </h1>
        </div>
        <h3>Enter your new password</h3>
        <input type="password" ref={passwordRef} placeholder="P4ssw0rd"/>
        <h3>Enter your new password again</h3>
        <input type="password" ref={newPasswordRef}placeholder="P4ssw0rd" />
        <br />
        <button onClick={resetpassword}>Reset Password</button>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  const { uuid } = ctx.query;
  var getUserData = await sql`SELECT * FROM users WHERE uuid = ${uuid}`;
  if (getUserData.rows.length == 0) {
    return {
      redirect: {
        destination: "/home",
        permanent: false,
      },
    };
  } else {
    return {
      props: {
        userdata: getUserData.rows[0],
      },
    };
  }
};
