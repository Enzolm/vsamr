import logoVSAMR from "@/assets/logoclear.png";
import { useState } from "react";
import { Link, Navigate } from "react-router";
import { logout, isAuthenticatedAdmin } from "@/lib/auth";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function NavbarLoged() {
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAdmin = async () => {
      const isAdmin = await isAuthenticatedAdmin();
      console.log("Is user an admin?", isAdmin);
      setIsAdmin(isAdmin);
    };
    checkAdmin();
  }, [navigate]);

  return (
    <nav className="bg-cgreen2 rounded-2xl h-[90vh] flex flex-col items-center shadow-xl ml-4">
      <ul className="mr-2 ml-2 mt-4">
        <li className="flex justify-center">
          <img src={logoVSAMR} alt="Logo du village" className="w-[120px]" />
        </li>
        <li className="mt-6">
          <Link
            className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
            to="/myaccount"
          >
            Mon Profil
          </Link>
        </li>
        <li className="mt-6">
          <Link
            className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
            to="/logged/myassociations"
          >
            Mon Associations
          </Link>
        </li>
        {isAdmin && (
          <>
            <li className="mt-6">
              <Link
                className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                to="/adminusers"
              >
                Utilisateurs
              </Link>
            </li>
            <li className="mt-6">
              <Link
                className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                to="/logged/associations"
              >
                Associations
              </Link>
            </li>
            <li className="mt-6">
              <Link
                className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                to="/logged/reservations"
              >
                Réservations
              </Link>
            </li>
            <li className="mt-6">
              <Link
                className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10"
                to="/adminpost"
              >
                Publications
              </Link>
            </li>
          </>
        )}
        <li className="mt-6">
          <Link
            className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-red-500/38"
            to="/"
            onClick={logout}
          >
            Déconnexion
          </Link>
        </li>
      </ul>
    </nav>
  );
}
