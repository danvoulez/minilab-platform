import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";
import { MinilabOfficialUI } from "@/ui/minilab-official-ui/minilab-official-ui";
import { Showcase } from "@/showcase/showcase";
import "@/styles/globals.css";

function Root() {
  const [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    const onChange = () => setHash(window.location.hash);
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return hash === "#showcase" ? <Showcase /> : <MinilabOfficialUI />;
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Root />
  </React.StrictMode>
);
