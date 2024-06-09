import Head from "next/head";
import Link from "next/link";
import styles from "../styles/Home.module.scss";
import { useEffect, useRef } from "react";
import { backendURL, productName } from "../resources/strings.js";
import { sql } from "@vercel/postgres";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { validate as uuidValidate } from "uuid";
/* cookies.set('myCat', 'Pacman', { path: '/' });
cookies.get('myCat')*/
export default function Home({ verified }) {
  if (verified) {
    useEffect(() => {
      setTimeout(() => {
        window.location.replace("/main");
      }, 1000);
    }, []);
    return (
      <div align="center">
        <h1>Your email is verified!</h1>
        <p>
          You will be redirected automatically. If not, click{" "}
          <a href="/main" style={{ textDecoration: "underline" }}>
            this link
          </a>{" "}
          to go to home.
        </p>
      </div>
    );
  }
  return (
    <div align="center">
      <Head>
      <meta name="theme-color" content={"#F9F9F9"} />
      </Head>
      <h1>Your email is not verified</h1>
      <p>
        Once you've verified your email, refresh this page or click{" "}
        <a className="link" href="/" style={{ textDecoration: "underline" }}>
          here
        </a>
        .
      </p>
      <p>
        If you are unable to verify your email, please email support@schoolthing.org.
      </p>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  var getUserDataREQ =
    await sql`SELECT verified from users WHERE uuid=${ctx.req.cookies.useruuid} AND org=${ctx.req.cookies.org}`;
  return { props: {verified: getUserDataREQ.rows[0].verified} };
};
