import logoVSAMR from "@/assets/logoclear.png";
import { Link } from "react-router";

export default function NavbarLoged() {
  return (
    <nav className="bg-cgreen2 rounded-2xl h-[90vh] flex flex-col items-center shadow-xl ml-4">
      <ul className="mr-2 ml-2 mt-4">
        <li className="flex justify-center">
          <img src={logoVSAMR} alt="Logo du village" className="w-[120px]" />
        </li>
        <li>
          <Link className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10" to="/">
            Mon Profil
          </Link>
        </li>
        <li>
          <Link className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10" to="/myassos">
            Mon Associations
          </Link>
        </li>
        {true && (
          <>
            <li>
              <Link className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10" to="/profile">
                Utilisateurs
              </Link>
            </li>
            <li>
              <Link className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10" to="/profile">
                Associations
              </Link>
            </li>
            <li>
              <Link className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10" to="/profile">
                Post
              </Link>
            </li>
          </>
        )}
        <li>
          <Link className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10" to="/logout">
            Déconnexion
          </Link>
        </li>
      </ul>
    </nav>
  );
}
