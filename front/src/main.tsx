import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "@/route/Home/Home";
import NotFound from "@/route/404";
import InfoMaire from "@/route/Horaire-Contact/InfoMaire";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="" element={<NotFound />} />
        <Route path="/*" element={<InfoMaire />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
