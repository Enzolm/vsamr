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
import AuthGuard from "./hooks/AuthGuard";
import AssociationsListAll from "@/route/Assocations/AssocciationsListAll";
import AssociationsInfo from "@/route/Assocations/AssociationInfo";
import ReservationSalle from "@/route/ReservationSalle/ReservationSalle";

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Toaster position="top-center" richColors />
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="" element={<NotFound />} />
      <Route path="/info" element={<InfoMaire />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password" element={<ResetPassword />} />
      <Route path="/associations" element={<AssociationsListAll />} />
      <Route path="/associations/:id" element={<AssociationsInfo />} />
      <Route path="/reservation" element={<ReservationSalle />} />
      <Route path="/salle-polyvalente" element={<ReservationSalle />} />
      <Route
        path="/logged/*"
        element={
          <AuthGuard>
            <LogedPage />
          </AuthGuard>
        }
      />
    </Routes>
  </BrowserRouter>
);
