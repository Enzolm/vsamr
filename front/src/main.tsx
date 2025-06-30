import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Home from "@/route/Home/Home";
import NotFound from "@/route/404";
import InfoMaire from "@/route/Horaire-Contact/InfoMaire";
import Login from "@/route/Login/Login";
import ForgotPassword from "@/route/ForgotPassword";
import ResetPassword from "@/route/ResetPassword";
import { Toaster } from "@/components/ui/sonner";
import LogedPage from "@/route/LogedPage/LogedPage";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Toaster position="top-center" richColors />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="" element={<NotFound />} />
      <Route path="/*" element={<InfoMaire />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/logged" element={<LogedPage />} />
    </Routes>
  </BrowserRouter>
);
