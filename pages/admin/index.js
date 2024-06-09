import {useRef } from "react";
import { thisURL } from "../../resources/strings.js";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import { useRouter } from "next/router";
/* cookies.set('myCat', 'Pacman', { path: '/' });
cookies.get('myCat')*/
const lDim = "100%";
export default function Home() {
    var router = useRouter();
    var TwoFARef = useRef();
  function checkCode() {
    fetch(`${thisURL}/api/admin/actions/login`, {
      method: "POST",
      body: new URLSearchParams({
        code: TwoFARef.current.value,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.status == true) {
          cookies.set("adminuuid", data.data, { path: "/" });
          router.push("/admin/orgs");

        } else {
          alert("Invalid code");
        }
      })
      .catch((err) => {
        alert("Error " + err.toString());
      });
  }
  return (
    <div style={{ padding: "10px", textAlign: "center" }}>
      <h2>Schoolthing</h2>
      <h1>Admin Enclave</h1>
      <p>Enter 2FA code</p>
      <input type="number" placeholder="2FA code" limit="6" style={{width: '80%'}} ref={TwoFARef} /><br />
      <button onClick={checkCode}>Verify</button>
    </div>
  );
}
