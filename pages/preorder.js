import Head from "next/head";
import styles from "../styles/Homepage.module.scss";
import { useEffect, useRef, useState } from "react";
import { productName, thisURL } from "../resources/strings.js";
import Cookies from "universal-cookie";
const cookies = new Cookies();
import Modal from "react-modal";
/* cookies.set('myCat', 'Pacman', { path: '/' });
cookies.get('myCat')*/
const lDim = "100%";
const customStyles = {
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    zIndex: "5000",
  },
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "15px",
  },
};
export default function Home() {
  var [isOpen, setIsOpen] = useState(false);
  var [modalContent, setModalContent] = useState();
  var nameRef = useRef();
  var institutionRef = useRef();
  var roleRef = useRef();
  var emailRef = useRef();
  function submit() {
    var input = {
      name: nameRef.current.value,
      institution: institutionRef.current.value,
      role: roleRef.current.value,
      email: emailRef.current.value,
    };
    if (
      input.name.trim() == "" ||
      input.institution.trim() == "" ||
      input.role.trim() == "" ||
      input.email.trim() == ""
    ) {
      setModalContent(
        <>
          <h1 style={{ fontSize: "48px", textAlign: "center" }}>:/</h1>
          <h3>One or more fields are empty.</h3>
          <p style={{ textAlign: "center" }}>
            Please fill out all fields and try again.
          </p>
          <button onClick={() => setIsOpen(false)}>Try again</button>
        </>
      );
      setIsOpen(true);
      return;
    } else {
      setModalContent(
        <>
          <h3>Submitting your pre-order...</h3>
        </>
      );
      setIsOpen(true);
      fetch(`${thisURL}/api/preorder`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(input),
      })
        .then((res) => res.json())
        .then((data) => {
          setModalContent(
            <>
              <h1 style={{ fontSize: "48px", textAlign: "center" }}>🎉</h1>
              <h3>Thank you for pre-ordering!</h3>
              <p style={{ textAlign: "center" }}>
                We'll be in touch with you soon.
              </p>
              <button onClick={() => window.location.replace("/")}>
                Done!
              </button>
            </>
          );
          setIsOpen(true);
        })
        .catch((err) => {
          setModalContent(
            <>
              <h1 style={{ fontSize: "48px", textAlign: "center" }}>:/</h1>
              <h3>Something went wrong.</h3>
              <p style={{ textAlign: "center" }}>Please try again.</p>
              <button onClick={() => setIsOpen(false)}>Try again</button>
            </>
          );
          setIsOpen(true);
        });
    }
  }
  return (
    <div>
      <Head>
        <title>{productName}</title>
        <meta name="description" content={productName} />
        <meta name="theme-color" content={"#F9F9F9"} />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Modal isOpen={isOpen} style={customStyles}>
        {modalContent}
      </Modal>
      <div style={{ textAlign: "center" }}>
        <br />
        <br />
        <img
          src="/icons/loadingLogo.png"
          width="64"
          height="64"
          style={{ verticalAlign: "middle" }}
        />
        <h1 style={{ display: "inline" }}>Pre-Order</h1>
        <br />
        <br />
        <p>
          {productName} is not yet available for purchase. However, you can
          pre-order it now and we'll reach out to you when it's ready.
        </p>
        <br />
        <p>Enter your name</p>
        <input type="text" placeholder="Name" ref={nameRef} style={{width: '350px'}}/>
        <br />
        <p>What's your institution's name?</p>
        <input
          type="text"
          placeholder="Institution Name"
          ref={institutionRef}
          style={{width: '350px'}}
        />
        <br />
        <p>What's your role in your institution?</p>
        <select ref={roleRef} style={{width: '350px'}}>
          <option value="it">IT Administrator</option>
          <option value="teacher">Teacher</option>
          <option value="principal">Principal</option>
          <option value="director">Director</option>
          <option value="student">
            Student (Please provide your school administrator's email below)
          </option>
          <option value="other">Other</option>
        </select>
        <br />
        <p>What's your email address?</p>
        <input type="email" placeholder="Email" ref={emailRef} style={{width: '350px'}} />

        <p style={{color: 'lightgrey'}}>
          If you are a student, please enter<br /> your school administrator's email
          address.
        </p>
        <br />
        <br />
        <button onClick={submit} style={{width: '350px'}}>Pre-Order!</button>
      </div>
    </div>
  );
}
