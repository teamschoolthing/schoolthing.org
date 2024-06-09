import Head from "next/head";
import Link from "next/link";
import { useRef, useState } from "react";
import styles from "../main/Main.module.scss";
var iconColor = "#1B2430";
import { backendURL, productName, thisURL } from "../../resources/strings";
import { Editor } from "@tinymce/tinymce-react";
import { ArrowCycle } from "akar-icons";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useRouter } from "next/router";
import { sql } from "@vercel/postgres";
import Modal from "react-modal";
export default function Home({ orgData, isTeacher }) {
  const customStyles = {
    overlay: {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      zIndex: "2000",
      backdropFilter: "blur(5px)",
      overflow: "unset",
    },
    content: {
      top: "50%",
      left: "50%",
      right: "auto",
      bottom: "auto",
      transform: "translate(-50%, -50%)",
      borderRadius: "15px",
      width: "80%",
      backdropFilter: "blur(300px)",
      backgroundColor: "#fefefe",
      color:  "#121212",
    },
  };
  var loadingIcon = (
    <ArrowCycle
      strokeWidth={2}
      size={28}
      className={`${styles.icon} ${styles.loadingIcon}`}
      color={iconColor}
      style={{ margin: "auto" }}
    />
  );
  var [openModal, setOpenModal] = useState(false);
  var [modalContent, setModalContent] = useState();
  const router = useRouter();
  const editorRef = useRef(null);
  const [value, setValue] = useState(0);

  var g = [<option value="all">Broadcast to all grades</option>];
  var classRef = useRef();
  var titleRef = useRef();
  var dateRef = useRef();
  var passwordRef = useRef();
  var gradesq = JSON.parse(orgData.grades);
  for (var key in gradesq) {
    g.push(<option value={key}>{gradesq[key]}</option>);
  }
  //
  function submit() {

    setModalContent(
      <>
      {loadingIcon}
      <h1>Creating notice</h1>
      </>
    )
    setOpenModal(true)
    // (org TEXT broadcast TEXT title TEXT timestamp TEXT content TEXT)
    var data = {
      org: cookies.get("org"),
      broadcast: classRef.current.value,
      title: titleRef.current.value,
      content: editorRef.current.getContent(),
      password: passwordRef.current.value,
      useruuid: cookies.get("useruuid"),
    };
    fetch(`${thisURL}/api/create/notice`, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    })
      .then((res) => res.json())
      .then((json) => {
        if (json.status == "fail") {
          setModalContent(
            <>
            <h1>:/</h1>
            <p>Your access token is incorrect.</p>
            <button onClick={() => setOpenModal(false)}>Close</button>
            </>
          )
          setOpenModal(true)
        } else {
          setModalContent(
      <>
      <h1>Done!</h1>
      </>
    )
    setOpenModal(true)
          router.push("/main");
        }
      });
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>{productName}</title>
        <meta name="description" content={productName} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ textAlign: "center" }}>
        <Modal isOpen={openModal} style={customStyles}>
          <div style={{ textAlign: "center", padding: "20px" }}>
            {modalContent}
          </div>
        </Modal>
        <h2>{productName}</h2>
        <h2>Create Notice - {orgData.name}</h2>
        <p>What grade is this for?</p>
        <select ref={classRef} required={true}>
          {g}
        </select>
        <br />
        <br />
        <p>Give your notice a title.</p>
        <input type="text" placeholder="Title" ref={titleRef} required={true} style={{width: '80%'}}/>
        <br />
        <br />
        <h1>Please type in the notice below.</h1>
        <br />
        <br />
        <div style={{ width: "80%", margin: "auto" }}>
          <Editor
            apiKey={editorAPIkey}
            onInit={(evt, editor) => (editorRef.current = editor)}
            initialValue="<p>Start writing your notice</p>"
            init={{
              height: 500,
              menubar: false,
              toolbar:
                "undo redo | casechange blocks | bold italic underline backcolor| " +
                "alignleft aligncenter alignright alignjustify| " +
                "bullist numlist checklist outdent indent | removeformat | a11ycheck code table help",
              content_style:
                "body { font-family:Helvetica,Arial,sans-serif; font-size:14px }",
            }}
          />
        </div>
        <br />
        <h3>Enter your organisation's access secret</h3>
        {isTeacher
          ? "Automatically verified with your Schoolthing Teacher Account"
          : null}
        <br />
        <input
          type="password"
          hidden={isTeacher}
          placeholder="Password"
          ref={passwordRef}
        />
        <br />
        <button onClick={submit}>Broadcast notice</button>
        <br />
        <br />
        <button onClick={() => router.push("/main")}>Cancel</button>
      </div>
    </div>
  );
}

export const getServerSideProps = async (ctx) => {
  var getInfoData =
    await sql`SELECT * from organisations WHERE id=${ctx.req.cookies.org}`;
  var getTeacherRole =
    await sql`SELECT * from users WHERE uuid=${ctx.req.cookies.useruuid}`;
  return {
    props: {
      orgData: getInfoData.rows[0],
      isTeacher: getTeacherRole.rows[0].teacher,
    },
  };
};
