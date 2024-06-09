import Link from "next/link";
import { ChevronLeft, FaceHappy, Plus, TrashBin, TrashCan } from "akar-icons";
import { productName, thisURL } from "../../resources/strings";
import Cookies from "universal-cookie";
import { useRef, useState } from "react";
import { sql } from "@vercel/postgres";
import styles from "../main/Teacher.module.scss";
import { useEffect } from "react";
import Modal from "react-modal";
const cookies = new Cookies();
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
    backgroundColor: "#FEFEFE",
    color: "#121212",
  },
};
export default function createWorksheet({ isTeacher, subjects, grades }) {
  var [questions, setQuestions] = useState([]);
  var [answers, setAnswers] = useState([]);
  var [finalQuestionState, setFinalQuestionState] = useState([]);
  var [openModal, setOpenModal] = useState(false);
  var [modalContent, setModalContent] = useState(<></>);
  var subjectList = [];
  for (var key in subjects) {
    subjectList.push(<option value={key}>{subjects[key]}</option>);
  }
  var gradesList = [];
  for (var key in grades) {
    gradesList.push(<option value={key}>{grades[key]}</option>);
  }
  useEffect(() => {
    addQuestion();
  }, []);
  function submitWorksheet() {
    setModalContent(
      <>
        <h1>Uploading...</h1>
      </>
    );
    setOpenModal(true);
    //check if all questions are filled out
    var allQuestionsFilledOut = true;
    questions.forEach((obj) => {
      for (var key in obj) {
        if (obj.question == "") {
          allQuestionsFilledOut = false;
        }
      }
      if (allQuestionsFilledOut == false) {
        setModalContent(
          <>
            <h1>Oops!</h1>
            <p>
              You forgot to fill out a question! Please make sure all questions
              are filled out before submitting.
            </p>
            <button
              onClick={() => {
                setOpenModal(false);
              }}
            >
              Dismiss
            </button>
          </>
        );
      } else {
        /*fetch(`${thisURL}/api/create/worksheet`, { //org TEXT, title TEXT, uuid TEXT, grade TEXT, subject TEXT, questions TEXT, answers TEXT, timestamp INT
          method: "POST",
          body: new URLSearchParams({
            org: cookies.get("org"),
            title: titleRef.current.value,
            subject: subref.current.value,
            grade: graref.current.value,
            questions: JSON.stringify(questions),
            answers: JSON.stringify(answers),
          }),
        })
          .then((res) => res.json())
          .then((data) => {
            if (data.success == true) {
              setModalContent(
                <>
                  <h1>Success!</h1>
                  <p>
                    Your worksheet has been created! You can now view it in the
                    worksheets tab.
                  </p>
                  <button
                    onClick={() => {
                      setOpenModal(false);
                      window.location.href = "/teacher";
                    }}
                  >
                    Dismiss
                  </button>
                </>
              );
              setOpenModal(true);
            } else {
              setModalContent(
                <>
                  <h1>Oops!</h1>
                  <p>
                    An error occured while creating your worksheet. Please try
                    again later.
                    Error Data: {JSON.stringify(data)}
                  </p>
                  <button
                    onClick={() => {
                      setOpenModal(false);
                    }}
                  >
                    Dismiss
                  </button>
                </>
              );
              setOpenModal(true);
            }
          });*/
        setModalContent(
          <>
            {JSON.stringify({
              org: cookies.get("org"),
              title: titleRef.current.value,
              subject: subref.current.value,
              grade: graref.current.value,
              questions: JSON.stringify(questions),
              answers: JSON.stringify(answers),
            })}
          </>
        );
      }
    });
  }
  function addQuestion() {
    var localQuestionData = questions;
    localQuestionData.push({
      question: "",
      options: ["", "", "", ""],
      answer: 0,
      index: localQuestionData.length,
      points: 0,
    });
    setQuestions(localQuestionData);
    var questionUpdateObj = [];
    questions.forEach((obj) => {
      var localOptionsDisplay = [];
      obj.options.forEach((option, index) => {
        const optionName = `Option ${index + 1}`;
        localOptionsDisplay.push(
          <li>
            <input
              style={{ width: "70%" }}
              defaultValue={obj.options[index]}
              onChange={(e) => {
                var localQuestionData = questions;
                localQuestionData[obj.index].options[index] = e.target.value;
                setQuestions(localQuestionData);
              }}
              placeholder={optionName}
            ></input>
            <br />
            <br />
          </li>
        );
      });
      questionUpdateObj.push(
        <>
          <br />
          <div
            style={{
              background: "white",
              boxShadow: "0px 0px 10px #f9f9f9",
              borderRadius: "15px",
              padding: "20px",
              width: "80%",
              margin: "auto",
            }}
          >
            <h2>Question {obj.index + 1}</h2>
            <input
              placeholder={`Question ${obj.index + 1}`}
              defaultValue={obj.question}
              style={{ width: "70%" }}
              onChange={(e) => {
                var localQuestionData = questions;
                localQuestionData[obj.index].question = e.target.value;
                setQuestions(localQuestionData);
              }}
            ></input>
            <br></br>
            <ol style={{ marginLeft: "15%" }}>{localOptionsDisplay}</ol>
            <br></br>
            <h3>Correct Answer</h3>
            <select
              onChange={(e) => {
                var localAnswerData = answers;
                localAnswerData[obj.index] = e.target.value;
                setAnswers(localAnswerData);
              }}
            >
              <option value={0}>Option 1</option>
              <option value={1}>Option 2</option>
              <option value={2}>Option 3</option>
              <option value={3}>Option 4</option>
            </select>
            <h3 style={{ fontSize: "20" }}>
              How many points do you want to add
            </h3>
            <input
              type="number"
              placeholder={`points`}
              defaultValue={obj.points}
              style={{ width: "70%" }}
              onChange={(e) => {
                var localQuestionData = questions;
                localQuestionData[obj.index].points = e.target.value;
                setQuestions(localQuestionData);
              }}
            ></input>
          </div>
          <br />
        </>
      );
    });
    setFinalQuestionState(questionUpdateObj);
  }
  if (!isTeacher) {
    return (
      <div className={styles.teacherBody}>
        <div style={{ textAlign: "center", margin: "0px 30px" }}>
          <h1>Access Restricted | Schoolthing Teacher</h1>
        </div>
      </div>
    );
  }
  var titleRef = useRef();
  //titleRef.current.value
  var subref = useRef();
  var graref = useRef();
  return (
    <div
      style={{
        margin: "0px 30px",
        textAlign: "center",
      }}
    >
      <Modal isOpen={openModal} style={customStyles} ariaHideApp={false}>
        <div style={{ textAlign: "center" }}>{modalContent}</div>
      </Modal>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "10% 80%",
          margin: "20px 0px",
        }}
      >
        {" "}
        <Link href="/main">
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
          Create Worksheet
        </h1>
      </div>
      <br></br>
      <h1 style={{ fontSize: "20px" }}>Getting Started</h1>
      <br></br>
      <input placeholder="Title" style={{ width: "80%" }} ref={titleRef} />
      <br />
      <br />
      <select ref={subref}>{subjectList}</select>
      <br />
      <br />
      <select ref={graref}>{gradesList}</select>
      <br />
      <br />
      <br />
      <h2>Questions</h2>
      <br />
      <br />
      <button onClick={addQuestion}>
        <Plus
          size={20}
          style={{
            verticalAlign: "middle",
          }}
        />
        Create Question
      </button>
      <button
        onClick={addQuestion}
        style={{
          borderRadius: "100px",
          position: "fixed",
          bottom: "20px",
          right: "20px",
        }}
      >
        <Plus
          size={32}
          style={{
            verticalAlign: "middle",
          }}
        />
      </button>
      <br /> <br />
      {finalQuestionState}
      <br /> <br />
      <br />
      <button onClick={submitWorksheet}>Done</button>
      <br />
      <br />
    </div>
  );
}
export async function getServerSideProps(ctx) {
  var getUserDataREQ =
    await sql`SELECT teacher FROM users WHERE uuid=${ctx.req.cookies.useruuid}`;
  var getSubjectDataREQ =
    await sql`SELECT * FROM organisations WHERE id=${ctx.req.cookies.org}`;
  return {
    props: {
      isTeacher: getUserDataREQ.rows[0].teacher,
      subjects: JSON.parse(getSubjectDataREQ.rows[0].subjects),
      grades: JSON.parse(getSubjectDataREQ.rows[0].grades),
    },
  };
}
