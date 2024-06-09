import { useEffect } from "react";
import { useRouter } from "next/router";
import Cookies from "universal-cookie";
import Link from "next/link";
import { ChevronLeft } from "akar-icons";
import { productName } from "../resources/strings.js";
export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const cookies = new Cookies();
    cookies.remove("useruuid");
    cookies.remove("org");

    setTimeout(() => {
      router.push("/");
    }, 3000);
  }, []);
  return (
    <>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "10% 80%",
          margin: "20px 0px",
        }}
      >
        {" "}
        <Link href="/home">
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
            width="50"
            height="50"
            style={{ verticalAlign: "middle", marginRight: "10px" }}
            alt={`The ${productName} Logo`}
          />
          Log Out
        </h1>
        <p>You have been logged out.</p>
      </div>
    </>
  );
}
