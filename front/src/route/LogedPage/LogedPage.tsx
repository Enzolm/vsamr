import NavbarLoged from "./Component/NavbarLoged";
import AssosAdmin from "./assosManagement/AssosAdmin";
import { Routes, Route } from "react-router";
import AssociationsList from "./assosManagement/AssosList";
import AssosEdit from "./assosManagement/AssosEdit";

export default function LogedPage() {
  return (
    <div className="items-center flex h-screen bg-cgreen1">
      <NavbarLoged />

      <div className="flex-1">
        <Routes>
          {/* <Route path="/*" element={<AssosAdmin />} /> */}
          <Route path="/associations/edit" element={<AssosEdit />} />
          <Route path="/associations" element={<AssociationsList />} />
          <Route path="/associations/create" element={<AssosAdmin />} /> {/* Route par défaut */}
        </Routes>
      </div>
    </div>
  );
}
