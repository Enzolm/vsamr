import logo from "@/assets/logoclear.png";
import { Link } from "react-router";
import { NavButton } from "@/composant/ui/NavButton";

function Navbar() {
  const data = [
    {
      title: "Horaires",
      to: "/Info",
    },
    {
      title: "Les élus",
      to: "/sub2",
    },
    {
      title: "Plans et documents",
      to: "/sub4",
    },
    {
      title: "Services",
      to: "/sub5",
    },
  ];

  const btnVillage = [
    {
      title: "L'histoire de la commune",
      to: "/sub1",
    },
    {
      title: "Transport, Commerce, Services",
      to: "/sub2",
    },
    {
      title: "Gestion des déchets",
      to: "/sub4",
    },
    {
      title: "Randonnées et loisirs",
      to: "/sub5",
    },
  ];

  const btnJeunesse = [
    {
      title: "Scolarité",
      to: "/sub1",
    },
    {
      title: "Péri-scolaire",
      to: "/sub2",
    },
    {
      title: "Espace jeunes",
      to: "/sub4",
    },
  ];

  return (
    <header className="w-full flex justify-center items-center z-20">
      <nav className="bg-cgreen2 overflow-visible border-gray-200 px-2 sm:px-4 py-1.5 dark:bg-cwhite2 m-5 rounded min-w-[100vh] h-[75px] flex justify-between items-center shadow-xl">
        <Link className="font-medium text-xl text-white m-4" to="/">
          Accueil
        </Link>
        <NavButton title="Informations" data={data} />
        <NavButton title="Le village" data={btnVillage} />
        <img className="h-full" src={logo} alt="Logo du village" />

        <Link className="font-medium text-xl text-white m-4" to="/admin">
          Associations
        </Link>
        <NavButton title="Jeunesse" data={btnJeunesse} />
        <Link className="font-medium text-xl text-white m-4" to="/admin">
          Salle polyvalente
        </Link>
      </nav>
    </header>
  );
}

export default Navbar;
