import Head from "next/head";
import { productName } from "../resources/strings.js";
import { ChevronLeft } from "akar-icons";
import shortid from "shortid";
import Link from "next/link";
const lDim = "100%";
export default function WhatsNew() {
  return (
    <div>
      <Head>
        <title>What's New | {productName}</title>
        <meta name="description" content={productName} />
        <meta name="theme-color" content={"#F9F9F9"} />
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
          <a href="/">
            <ChevronLeft
              size={36}
              style={{
                verticalAlign: "middle",
                cursor: "pointer",
                margin: "auto",
              }}
            />
          </a>
          <h2
            style={{
              verticalAlign: "middle",
              margin: "auto",
            }}
          >
            <img
              src="/icons/DevIcon.png"
              width={576.94 / 9}
              height={466.07 / 9}
              style={{ verticalAlign: "middle", marginRight: "10px" }}
              alt={`The ${productName} Developers Logo`}
            />
            Developer
          </h2>
        </div>
        <br />

        <h1>What's new</h1>
        <p
          style={{
            fontSize: "20px",
            textDecoration: "capitalize",
            textAlign: "center",
            color: "lightgrey",
          }}
        >
          Schoolthing v7.5.0 | SCX-23w46c
        </p>
        <br />
        <p>
          <h2 style={{ textAlign: "left", margin: "0px 20px" }}>
            Release notes:
          </h2>
          <br />
          <ul
            style={{
              textAlign: "left",
              margin: "0px 20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <li>
              Schoolthing Sync has been fully rolled out. Changes made on the app will be instantly reflected on the client.
            </li>
            <li>
            Profile pictues are now supported through Gravatar. You can change your profile picture by going to the Settings page.
            </li>
            <li>
              [BETA] Added Notifications! Notifications will be available for all Desktop users and Mobile users with the PWA installed.
              </li>
              <li>
                Notifications can be enabled on unlimited devices, and can be disabled on a per-device basis.
              </li>
              <li>
                Richer PWA with app screenshots are now displayed on supported devices.
              </li>
              <li>Introducing Styles! You can now customise Schoolthing by changing the accent colour to one of 7 beautiful colours.</li>
              <li>
                Select Schoolthing Pro teachers will be able to access Worksheets, a feature releasing in Schoolthing 8.
              </li>
              <li>
                Background changes have been made in preparation for Worksheets.
              </li>
              <li>
                The log-in flow has been made much quicker.
              </li>
              <li>Overall site organisation</li>
              <li>
                Improved Modal appearance
              </li>
              <li>
                Reduced ingress data size
              </li>
              <li>
                Added a User Profile button to Post authors
              </li>
              <li>
                HTML/markdown supported in Posts and Bio
              </li>
              <li>
                Improved Posts UI
              </li>
              <li>A few small bug fixes</li>
          </ul>
        </p>
      </div>
    </div>
  );
}
