import Head from "next/head";
import styles from "../styles/Home.module.scss";
import { useEffect, useRef, useState } from "react";
import { productName, thisURL, version } from "../resources/strings.js";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { validate as uuidValidate } from "uuid";
import { v4 as uuidv4 } from "uuid";
import { useRouter } from "next/router";
import { sql } from "@vercel/postgres";
import { ShareBox, MoreVerticalFill, ChevronLeft, Globe } from "akar-icons";
import shortid from "shortid";
import Link from "next/link";
/* cookies.set('myCat', 'Pacman', { path: '/' });
cookies.get('myCat')*/
const lDim = "100%";
export default function Home({ orgs }) {
  const router = useRouter();
  var [appCheck, setAppCheck] = useState();
  var schoolRef = useRef();
  var prettifiedKeyObjectRel = {};
  var schools = [<option value="home">Select a school</option>];
  orgs.forEach((org) => {
    if (org.id == "global") {
      return;
    } else {
      prettifiedKeyObjectRel[org.id] = org.name;
      schools.push(
        <option value={org.id} key={org.id}>
          {org.name}
        </option>
      );
    }
  });
  return (
    <div>
      <Head>
        <title>{productName}</title>
        <meta name="description" content={productName} />
        <meta name="theme-color" content={"#F9F9F9"} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
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
          <h1
            style={{
              verticalAlign: "middle",
              margin: "auto",
            }}
          >
            <img
              src="/icons/loadingLogo.png"
              width="64"
              height="64"
              style={{ verticalAlign: "middle", marginRight: "10px" }}
              alt={`The ${productName} Logo`}
            />
            {productName}
          </h1>
        </div>
        <br />
        <br />
        <h2>Select your community</h2>
        <br />
        {!cookies.get("useruuid") &&
        cookies.get("org") &&
        cookies.get("org") in prettifiedKeyObjectRel ? (
          <>
            {" "}
            <div
              className="adjustWidth"
              style={{
                border: "3px solid #80D7E0",
                borderRadius: "20px",
                boxShadow: "0 0 10px 1px #80D7E0",
                backdropFilter: "blur(15px)",
                padding: "10px",
                width: "330px",
                height: "20%",
                color: "black",
                margin: "auto",
              }}
            >
              <h3>Looks like you've already logged in!</h3>
              <p>
                We found that you last logged in to the{" "}
                <b>{prettifiedKeyObjectRel[cookies.get("org")]}</b> Community.
                Would you like to log back in?
              </p>
              <button
                onClick={() => {
                  router.push(`/${cookies.get("org")}`);
                }}
              >
                Log In
              </button>
              &nbsp;&nbsp;&nbsp;
              <p
                style={{ color: "#80D7E0", pointer: "none" }}
                onClick={() => {
                  cookies.remove("org");
                  router.reload();
                }}
              >
                Don't suggest this Community
              </p>
            </div>
            <br />
            <br />
          </>
        ) : null}
        <select
          ref={schoolRef}
          style={{
            width: "350px",
            height: "80px",
            fontSize: "16px",
            borderRadius: "15px",
            boxShadow: "0 0 10px 1px #80D7E0",
            border: "none",
          }}
        >
          {schools}
        </select>
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
            router.push(`/${schoolRef.current.value}`);
          }}
        >
          Go!
        </button>
        <br />
        <br />
        <h3>Is your school not on the list?</h3>
        <p style={{ fontSize: "16px" }}>
          Ask your school administrator to{" "}
          <a href="/preorder" style={{ textDecoration: "underline" }}>
            preorder
          </a>{" "}
          Schoolthing for your school.
        </p>
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
        <br />
        <br />
        <br />
      </div>
    </div>
  );
  //}
}

export const getServerSideProps = async (ctx) => {
  var orgDataREQ = await sql`SELECT id, name FROM organisations`;
  var orgData = orgDataREQ.rows;
  var comp = [];
  orgData.forEach((org) => {
    comp.push({ id: org.id, name: org.name });
  });
  return {
    props: {
      orgs: comp,
    },
  };
};
