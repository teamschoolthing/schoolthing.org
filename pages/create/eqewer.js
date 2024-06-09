import Head from "next/head";
import { useRef, useState } from "react";
import { productName, thisURL } from "../../resources/strings.js";
import Cookies from "universal-cookie";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  const editorRef = useRef(null);
  const [value, setValue] = useState(0);
  var idRef = useRef();
  var pointsRef = useRef();
  var domainRef = useRef();
  var subjectsRef = useRef();
  var gradesRef = useRef();
  var nameRef = useRef();
  var planRef = useRef();
  var demoCalcRef = useRef();
  var limitRef = useRef();
  var passwordRef = useRef();
  var [calc, setCalc] = useState(0);
  function submit() {
    var data = {
      domain: domainRef.current.value,
      id: idRef.current.value,
      name: nameRef.current.value,
      subjects: subjectsRef.current.value,
      grades: gradesRef.current.value,
      password: passwordRef.current.value,
    };
    fetch(`${thisURL}/api/create/org`, {
      method: "post",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams(data),
    }).then((res) => {
      alert("done");
    });
  }
  return (
    <div>
      <Head>
        <title>{productName} Control - Org Creation</title>
        <meta name="description" content={productName} />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ textAlign: "center" }}>
        <h2>Create Note - {productName}!</h2>
        <br />
        <br />
        <p>Enter org id (no space, JSON-unsafe characters)</p>
        <input
          type="text"
          placeholder="someschool"
          ref={idRef}
          required={true}
        />{" "}
        <br />
        <br />
        <p>Enter org name (all chars allowed)</p>
        <input
          type="text"
          placeholder="Some School"
          ref={nameRef}
          required={true}
        />{" "}
        <br />
        <p>Enter org plan</p>
        <select ref={planRef}>
          <option value="basic">Basic</option>
          <option value="pro">Pro</option>
        </select>
        <br />
        <p>Enter org data limits (in MB)</p>
        <h4>Plan calculator:</h4>
        Enter no. of students
        <br />
        <input
          type="number"
          ref={demoCalcRef}
          onChange={() => {
            setCalc(demoCalcRef.current.value);
          }}
        />
        <br />
        {calc * 4} MB user data [{calc}*4 MB]
        <br />
        {calc * 10} MB note data [{calc}*10 MB]
        <br />
        2 MB org data
        <br />
        1 MB notices
        <br />
        <br />
        Total: {calc * 4 + calc * 10 + 10 + 2 + 1} MB
        <br />
        <br />
        Select limit:
        <select ref={limitRef}>
          <option value="100">100 MB </option>
        </select>
        <br />
        <p>Create org access token</p>
        <input
          type="password"
          placeholder="password"
          ref={passwordRef}
          required={true}
        />{" "}
        <br />
        <br />
        <p>Org email domain</p>
        <input
          type="text"
          placeholder="no @, just domain.com"
          ref={domainRef}
          required={true}
        />
        <br />
        <br />
        <br />
        <br />
        <h1>JSON editor for subjects</h1>
        <textarea
          ref={subjectsRef}
          placeholder='{"math": "Mathematics", "phy": "Physics"}'
        ></textarea>
        <br />
        <br />
        <h1>JSON editor for grades</h1>
        <textarea
          ref={gradesRef}
          placeholder='{"9": "9", "10": "10"}'
        ></textarea>
        <br />
        <br />
        <button onClick={submit}>Create org!</button>
        <br />
        <br />
        <button onClick={() => router.push("/main")}>Cancel</button>
      </div>
    </div>
  );
}
