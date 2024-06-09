import { useRef } from "react";
import { thisURL } from "../../resources/strings.js";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useRouter } from "next/router";
export default function Push({ uuid }) {
  var router = useRouter();
  var titleRef = useRef();
  var messageRef = useRef();
  function sendPush() {
    alert("Sending push noification to all users. This might take some time.");
    fetch(`${thisURL}/api/sendAllMessage`, {
      method: "POST",
      body: new URLSearchParams({
        title: titleRef.current.value,
        message: messageRef.current.value,
        url: "https://schoolthing.org/main",
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == "success") {
          alert("Done");
        }
      })
      .catch((err) => {
        alert("Error " + err.toString());
      });
  }
  if (uuid == "f0f1ac90-3b93-4f2a-b41e-c9ba7ad586ee") {
    return (
      <div style={{ margin: "auto", padding: "20px", textAlign: "center" }}>
        <h2 style={{ textAlign: "center" }}>Schoolthing</h2>
        <h1 style={{ textAlign: "center" }}>Admin Enclave</h1>
        <br />
        <div align={{ margin: "auto", textAlign: "center" }}>
          <button
            onClick={() => {
              router.push("/admin/orgs");
            }}
          >
            Organisations
          </button>
          &nbsp;&nbsp;
          <button
            style={{ background: "coral", textAlign: "center" }}
            onClick={() => {
              router.push("/admin/push");
            }}
          >
            Push Notifications
          </button>
          &nbsp;&nbsp;
          <button
            onClick={() => {
              cookies.remove("adminuuid");
              router.push("/admin");
            }}
          >
            Logout
          </button>
        </div>
        <br />
        <div style={{ textAlign: "center" }}>
          <h2>Send a Push Notification</h2>
          <p>You can type @fname@ to replace with the user's first name</p>
          <input type="text" placeholder="Title" id="title" style={{width: '80%'}} ref={titleRef} />
          <br />
          <br />
          <textarea
            placeholder="Message"
            id="message"
            ref={messageRef}
          ></textarea><br /><br />
          <button onClick={sendPush}>Send</button>
        </div>
      </div>
    );
  } else {
    return (
      <div style={{ textAlign: "center", margin: "auto", padding: "30px" }}>
        <h2>Schoolthing</h2>
        <h1>Admin Enclave</h1>
        <br />
        <br />
        <h2>Restricted Access</h2>
      </div>
    );
  }
}

export const getServerSideProps = async (ctx) => {
  var uuid = ctx.req.cookies.adminuuid ? ctx.req.cookies.adminuuid : "";
  return {
    props: {
      uuid: uuid,
    },
  };
};
