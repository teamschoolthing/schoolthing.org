import "../styles/globals.scss";
import { Analytics } from "@vercel/analytics/react";
import { useEffect, useState } from "react";
import {thisURL, isDevMode, RollbarAccess, RollbarEnvironment} from "../resources/strings";
import Modal from "react-modal";
import { useRouter } from "next/router";
import Script from "next/script";
import { Provider, ErrorBoundary } from "@rollbar/react"; // Provider imports 'rollbar'
import { Cross } from "akar-icons";
import Rollbar from "rollbar";
const rollbarConfig = {
  accessToken: RollbarAccess,
  environment: RollbarEnvironment,
};
export default function MyApp({ Component, pageProps }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  const [isLoading, setIsLoading] = useState(true);
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
      color: "#121212",
    },
  };
  useEffect(() => {
    window.addEventListener("online", () => {
      setIsOpen(false);
      setIsConnected(true);
    });
    window.addEventListener("offline", () => {
      setIsOpen(true);
      setIsConnected(false);
    });

    router.isReady && setIsLoading(false);
  }, []);
  return (
    <>
      {isLoading ? (
        <>
          <div style={{ width: "100%", height: "100%" }}>
            <img src="/icons/loadingLogo.png" />
            <style jsx>{`
        img {
          position: absolute;
          margin: auto;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          width: 120px;
          height: 120px;
          animation: spin 2s ease-in-out infinite;
        }
        @keyframes spin {
          from {
            transform:rotate(0deg);
          }
          to {
            transform:rotate(360deg);
          }
        }
        section {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: black;
          width: 100%:
          height: 100%;
          z-index: -1;
        }
        `}</style>
            <section></section>
          </div>
        </>
      ) : (
        <Provider config={rollbarConfig}>
          <ErrorBoundary>
            <Script src="https://www.googletagmanager.com/gtag/js?id=G-VMLPTH28BD" />
            <Script id="google-analytics">
              {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', 'G-VMLPTH28BD');
        `}
            </Script>
            <Modal isOpen={isOpen} style={customStyles}>
              <Cross
                size={32}
                color="red"
                onClick={() => {
                  setIsOpen(false);
                }}
                style={{
                  float: "right",
                  cursor: "pointer",
                }}
              />
              <h1 style={{ fontSize: "48px", textAlign: "center" }}>:/</h1>
              <h3>Your device isn't connected to the Internet.</h3>
              <p style={{ textAlign: "center" }}>
                Check your connection and try again.
              </p>
            </Modal>

            <Component {...pageProps} />
            <Analytics />
          </ErrorBoundary>
        </Provider>
      )}
    </>
  );
}
