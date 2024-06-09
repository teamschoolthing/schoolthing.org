import Head from "next/head";
import styles from "../styles/Homepage.module.scss";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { productName, thisURL, version } from "../resources/strings.js";
import { validate as uuidValidate } from "uuid";
import { useRouter } from "next/router";
import { Envelope, CircleCheckFill } from "akar-icons";
var logo = "icons/loadingLogo.png";
const imgDimension = 64;
const teamImg = "70%";
export default function Home() {
  const planCheckMark = (
    <>
      <CircleCheckFill style={{ verticalAlign: "middle" }} size={24} />{" "}
    </>
  );
  var router = useRouter();
  return (
    <div style={{ overflowX: "hidden" }}>
      <Head>
        <title>Learning, revolutionised. | {productName}</title>
        <meta
          name="description"
          content={`Meet ${productName}, the world's first social learning platform. Help your Community, earn points, and elevate your study game.`}
        />
        <meta
          name="keywords"
          content="schoolthing, primrose, pondicherry, mihir, mihir maroju, maroju, sudhan, sudhan ruban, notes, app for notes, sharing notes, community, manu adhitya, adhitya, manu, app for sharing notes, learning, revolutionised, revolutionized, platform"
        />
        <meta name="author" content="Pidgon Inc." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={thisURL} />
        <meta
          property="og:title"
          content={`${productName} - Learning, revolutionised.`}
        />
        <meta
          property="og:description"
          content={`Meet ${productName}, the world's first social learning platform. Help your Community, earn points, and elevate your study game.`}
        />
        <meta property="og:image" content="icons/loadingLogo.png" />
      </Head>
      <div className={styles.container}>
        <div className={styles.top}>
          <div
            onClick={() => {
              window.location.href = "/";
            }}
          >
            <img
              src={logo}
              style={{ verticalAlign: "middle" }}
              width={imgDimension}
              height={imgDimension}
              alt="Logo"
            />
            <h1
              style={{
                display: "inline",
                paddingLeft: "10px",
                verticalAlign: "middle",
              }}
            >
              {productName}
            </h1>
          </div>
          <Link href="#features" className={styles.topLink}>
            <span className={styles.link}>Features</span>
          </Link>
          <Link href="#plans" className={styles.topLink}>
            <span className={styles.link}>Plans</span>
          </Link>
          <Link href="#team" className={styles.topLink}>
            <span className={styles.link}>Team</span>
          </Link>
          <Link href="#contact" className={styles.topLink}>
            <span className={styles.link}>Contact</span>
          </Link>
          <Link href="/home">
            <button onClick={()=>{
              window.location.href = "/home"
            }}>Open App</button>
          </Link>
        </div>
        <div className={styles.content}>
          <br />
          <br />
          <div className={styles.hero}>
            <div>
              <br />
              <br />
              <h1 className={styles.responsiveTop}>
                Learning,
                <br /> revolutionised.
              </h1>
              <p>
                Meet {productName}, the world's first social learning platform.
                <br />
                Help your Community, earn points, and elevate your study game.
              </p>
              <br />
              <Link href="/home">
                <button>Open App</button>
              </Link>
              <br />
              <br />{" "}
              <Link href="/preorder" style={{ cursor: "pointer" }}>
                <span
                  style={{
                    color: "#80D7E0",
                  }}
                >
                  Pre-Order Schoolthing for your school
                </span>
              </Link>
              <br />
              <br />
              <br />
            </div>
            <img
              style={{ zIndex: 3 }}
              src="home/FrontPage.png"
              alt={`Two iPhone 13 Pros with the ${productName} app open, one in dark mode and one in light mode`}
            />
          </div>
          <div style={{ textAlign: "center", margin: "auto" }}>
            <h1
              id="features"
              style={{
                fontSize: "48px",
                textAlign: "center",
                margin: "auto",
              }}
            >
              <br />
              <br />
              Features
            </h1>
            <br />
            <p style={{ fontSize: "18px" }}>
              {productName} has so many features that they'll make you{" "}
              <span style={{ fontSize: "36px", verticalAlign: "middle" }}>
                <img
                  src="https://em-content.zobj.net/thumbs/120/apple/354/exploding-head_1f92f.png"
                  className={styles.mindBlown}
                />
              </span>
            </p>
          </div>
          <br />
          <br />
          <div className={styles.hero}>
            <div>
              <h1>
                Trending tabs that
                <br /> show you what's popular
              </h1>
              <p>
                {productName} has a powerful algorithm that ranks notes that
                have potential by detecting a rise in traction based on likes,
                purchases, views, and similar searches.
              </p>
            </div>
            <img
              src="home/trending.png"
              style={{ verticalAlign: "middle", zIndex: 3 }}
              alt={`An iPhone 13 Pro with the Trending tab on the  ${productName} app open`}
            />
          </div>
          <br />
          <br />
          <div className={styles.heroLeft}>
            <div style={{ textAlign: "right" }}>
              <h1>Show off to your friends by climbing the leaderboard!</h1>
              <p>
                {productName} has a points system that rewards you for being
                active on the app. You can use these points to buy notes, or
                save and climb the leaderboard!
              </p>
            </div>

            <img
              src="home/ldr.png"
              className={styles.img}
              style={{ verticalAlign: "middle", zIndex: 3 }}
              alt={`An iPhone 13 Pro with the Leaderboard tab on the ${productName} app open`}
            />
          </div>
          <br />
          <br />
          <div className={styles.hero}>
            <div>
              <h1>Search faster than ever with the powerful search engine</h1>
              <p>
                {productName} has a powerful search engine that can find notes
                based on keywords, subjects, and more, rank them based on
                points, popularity, and purchases and return results in a
                fraction of a second.
              </p>
            </div>
            <img
              src="home/search.png"
              className={styles.img}
              style={{ verticalAlign: "middle", zIndex: 3 }}
              alt={`An iPhone 13 Pro with the Trending tab on the ${productName} app open`}
            />
          </div>
          <h1
            id="plans"
            style={{ fontSize: "48px", textAlign: "center", margin: "auto" }}
          >
            <br />
            <br />
            Plans
          </h1>
          <br />
          <br />
          <table className="planTable">
            <tr>
              <th>
                <h1 style={{ fontSize: "48px" }}>Basic</h1>
              </th>
              <th>
                <h1 style={{ fontSize: "48px" }} className={styles.proPlan}>
                  Pro
                </h1>
              </th>
            </tr>
            <tr>
              <td></td>
              <td></td>
            </tr>
            <tr>
              <td>
                {planCheckMark} The Full {productName} student app
              </td>
              <td>
                {planCheckMark}The Full {productName} student app
              </td>
            </tr>
            <tr>
              <td>
                {planCheckMark}
                {productName} Content Moderation Software installed in your
                Community
              </td>
              <td>
                {planCheckMark}
                {productName} Content Moderation Software installed in your
                Community
              </td>
            </tr>
            <tr>
              <td>{planCheckMark}10 GB per student/month of note uploads</td>
              <td>{planCheckMark}20 GB per student/month of note uploads</td>
            </tr>
            <tr>
              <td>
                {planCheckMark}
                {productName} Global access for students to access high quality
                <br /> notes from other students across the world.
              </td>
              <td>
                {planCheckMark}
                {productName} Global access for students to access high quality
                <br /> notes from other students across the world.
              </td>
            </tr>
            <tr>
              <td>
                {planCheckMark}
                The {productName} Teacher app for teachers to manage
                <br /> students and create notes
              </td>
              <td>
                {planCheckMark} The Full {productName} Teacher for teachers to
                manage students, create
                <br />
                notes, generate login codes, and much more.
              </td>
            </tr>
            <tr>
              <td></td>
              <td>
                {planCheckMark} The powerful {productName} Testing Suite for
                teachers to assign and create
                <br />
                worksheets, forms, and quizzes
              </td>
            </tr>
            <tr>
              <td style={{ margin: "auto", textAlign: "center" }}>
                <button
                  style={{ color: "white", background: "black" }}
                  onClick={() => {
                    window.location.href = "/preorder";
                  }}
                >
                  Pre-order!
                </button>
              </td>
              <td style={{ margin: "auto", textAlign: "center" }}>
                <button
                  className={styles.proPlanButton}
                  onClick={() => {
                    window.location.href = "/preorder";
                  }}
                >
                  Pre-order!
                </button>
              </td>
            </tr>
          </table>
          <h1
            id="team"
            style={{ fontSize: "48px", textAlign: "center", margin: "auto" }}
          >
            <br />
            <br />
            Team
          </h1>
          <br />
          <div className={styles.team}>
            <div className={styles.teamMember}>
              <img
                src="team/Mihir.jpeg"
                alt="Mihir Maroju"
                height={teamImg}
                width={teamImg}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  width: "256px",
                  height: "256px",
                }}
              />
              <img
                src="handwriting/Mihir.png"
                width="60%"
                height="60%"
                alt="Mihir"
              />
              <span>Tech & Design</span>
              <Link href="mailto:mihir@schoolthing.org">
                <Envelope size={32} cursor={"pointer"} />
              </Link>
            </div>
            <div className={styles.teamMember}>
              <img
                src="team/Manu.jpg"
                alt="Manu Adhitya"
                height={teamImg}
                width={teamImg}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  width: "256px",
                  height: "256px",
                }}
              />
              <img
                src="handwriting/Manu.png"
                width="75%"
                height="75%"
                alt="Manu"
              />
              <span>Outreach & Research</span>
              <Link href="mailto:manu@schoolthing.org">
                <Envelope size={32} cursor={"pointer"} />
              </Link>
            </div>
            <div className={styles.teamMember}>
              <img
                src="team/Sudhan.jpg"
                alt="Sudhan Ruban"
                height={teamImg}
                width={teamImg}
                style={{
                  borderRadius: "50%",
                  objectFit: "cover",
                  width: "256px",
                  height: "256px",
                }}
              />
              <img
                src="handwriting/Sudhan.png"
                width="60%"
                height="60%"
                alt="Sudhan"
              />
              <span>Finance & Operations</span>
              <Link href="mailto:sudhan@schoolthing.org">
                <Envelope size={32} cursor={"pointer"} />
              </Link>
            </div>
          </div>
          <h1
            id="contact"
            style={{ fontSize: "48px", textAlign: "center", margin: "auto" }}
          >
            <br />
            <br />
            Contact
          </h1>
          <br />
          <p style={{ textAlign: "center", margin: "auto" }}>
            If you have any questions, comments, or concerns, please email us
            at&nbsp;
            <a href="mailto:support@schoolthing.org">support@schoolthing.org</a>
            &nbsp;and we'll get back to you as soon as possible.
          </p>
        </div>
      </div>
      <div className={styles.footer}>
        <div
          style={{
            color: "white",
          }}
        >
          © {new Date().getFullYear()} {productName}&nbsp;|&nbsp;Version{" "}
          {version}.{" "}
          <a
            style={{
              color: "white",
              textDecoration: "underline",
            }}
            href={`/whats-new`}
          >
            What's new?
          </a>
          &nbsp;|&nbsp;
          <a
            href="mailto:support@schoolthing.org"
            style={{ color: "white", textDecoration: "underline" }}
          >
            Report a Problem
          </a><br />
        A <a style={{ color: "white", textDecoration: "underline" }} href="https://pidgon.com">pidgon.com</a> project.
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  if (uuidValidate(ctx.req.cookies.useruuid)) {
    return {
      redirect: {
        destination: "/main",
        permanent: false,
      },
    };
  } else {
    return {
      props: {},
    };
  }
};
