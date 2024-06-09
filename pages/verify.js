import Head from "next/head";
import Link from "next/link";
import styles from "./Upload.module.scss";
import { useRef, useState, useEffect } from "react";
import { backendURL, productName } from "../resources/strings.js";
import Cookies from "universal-cookie";
import { validate as uuidValidate } from "uuid";
import { v4 as uuidv4 } from "uuid";
import { Editor } from "@tinymce/tinymce-react";
const cookies = new Cookies();
import { IKImage, IKVideo, IKContext, IKUpload } from "imagekitio-react";
import { useRouter } from "next/router";
import { sql } from "@vercel/postgres";
export default function Home({ response }) {
  return <h1>{response}</h1>;
}

export const getServerSideProps = async (ctx) => {
  var getUserDataREQ =
    await sql`SELECT * from users WHERE uuid=${ctx.query.pidgonglobal} AND org=${ctx.query.org}`;
  if (getUserDataREQ.rows.length == 0) {
    return {
      props: {
        response: "User not found. Please contact support@schoolthing.org for help.",
      },
    };
  } else {
    var getUserData = getUserDataREQ.rows[0];
    if (getUserData.verified == false) {
      var verifyUser =
        await sql`UPDATE users SET verified=true WHERE uuid=${ctx.query.pidgonglobal} AND org=${ctx.query.org}`;
      return { props: { response: "Verified!" } };
    } else {
      return { props: { response: "You're already verified!" } };
    }
  }
};
