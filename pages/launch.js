import { thisURL, productName } from "../resources/strings";
import { TriangleAlert } from "akar-icons";
import { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { useWindowSize } from "react-use";
import { ChevronLeft } from "akar-icons";
export default function Launch() {
  const { width, height } = useWindowSize();
  var [commands, setCommands] = useState("");
  var [confetti, setConfetti] = useState(false);
  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  async function delayedLoop() {
    var items = [
      <p>Starting backend services...</p>,
      <p>Starting SchoolthingAI...</p>,
      <p>Activating Blockchain Authentication Layer...</p>,
      <p>Enabling SchoolthingX Sentry...</p>,
      <p>Deploying Cloud Integration Protocols...</p>,
      <p>
        <span style={{ color: "#34c759" }}>Schoolthing is live!</span>{" "}
        https://schoolthing.org
      </p>,
    ];
    var delay = 1200; // 1 second

    for (var i = 0; i < items.length; i++) {
      setCommands(items[i]);
      await sleep(delay);
    }
    setConfetti(true);
    setTimeout(() => {
        window.location.href = "https://schoolthing.org";
        }, 6000);
  }
  return (
    <>
      {confetti ? <Confetti width={width} height={height} /> : null}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "10% 80%",
          margin: "20px 0px",
        }}
      >
        {" "}
        <a>
        </a>
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
          Launch
        </h1>
      </div>

      <div
        style={{
          margin: "auto",
          marginTop: "10%",
          textAlign: "center",
        }}
      >
        {commands != "" ? (
          <div
            style={{
              width: "50%",
              margin: "auto",
              backgroundColor: "#000000",
              color: "#ffffff",
              padding: "10px",
              borderRadius: "10px",
              fontFamily: "monospace",
            }}
          >
            {commands}
          </div>
        ) : null}

       {commands == "" ? <button onClick={delayedLoop}>Launch Schoolthing</button> : null}
      </div>
    </>
  );
}
