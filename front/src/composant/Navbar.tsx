import logo from "@/assets/logoclear.png";
import { Link } from "react-router";
import { NavButton } from "@/composant/ui/NavButton";
import { useState } from "react";
import { Menu, X, ChevronDown, ChevronUp } from "lucide-react";

function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdowns, setOpenDropdowns] = useState<{ [key: string]: boolean }>({
    informations: false,
    village: false,
    jeunesse: false,
  });

  const toggleDropdown = (key: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

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
    <header className="w-full flex justify-center items-center z-20 relative">
      {/* Desktop Navigation */}
      <nav className="hidden lg:flex bg-cgreen2 overflow-visible border-gray-200 px-6 py-3 m-5 rounded-2xl min-w-[90vw] max-w-[1200px] h-[70px] justify-between items-center shadow-xl">
        {/* Left side navigation */}
        <div className="flex items-center space-x-8">
          <Link className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10" to="/">
            Accueil
          </Link>
          <NavButton title="Informations" data={data} />
          <NavButton title="Le village" data={btnVillage} />
        </div>

        {/* Center logo */}
        <div className="flex-shrink-0 mx-12">
          <img className="h-12 w-auto" src={logo} alt="Logo du village" />
        </div>

        {/* Right side navigation */}
        <div className="flex items-center space-x-8">
          <NavButton title="Jeunesse" data={btnJeunesse} />
          <Link className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10" to="/associations">
            Associations
          </Link>
          <Link className="font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-2 rounded-lg hover:bg-white/10" to="/salle-polyvalente">
            Salle polyvalente
          </Link>
        </div>
      </nav>

      {/* Mobile Navigation */}
      <nav className="lg:hidden bg-cgreen2 w-full mx-5 my-5 rounded-lg shadow-xl">
        <div className="px-4 py-3">
          <div className="flex justify-between items-center">
            {/* Mobile logo */}
            <img className="h-10 w-auto" src={logo} alt="Logo du village" />

            {/* Mobile menu button */}
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-white p-2 rounded-lg hover:bg-white/10 transition-colors" aria-label="Toggle menu">
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile menu items */}
          <div className={`transition-all duration-300 ease-in-out overflow-hidden ${isMenuOpen ? "max-h-[600px] opacity-100 mt-4" : "max-h-0 opacity-0"}`}>
            <div className="space-y-2 pb-4">
              <Link className="block font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-3 rounded-lg hover:bg-white/10" to="/" onClick={() => setIsMenuOpen(false)}>
                Accueil
              </Link>

              {/* Mobile dropdown sections */}
              <div className="space-y-2">
                {/* Dropdown Informations */}
                <div className="px-4 py-2">
                  <button onClick={() => toggleDropdown("informations")} className="w-full flex items-center justify-between font-medium text-lg text-white hover:text-gray-200 transition-colors py-2 rounded-lg hover:bg-white/10">
                    <span>Informations</span>
                    {openDropdowns.informations ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openDropdowns.informations ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                    <div className="pl-4 space-y-1">
                      {data.map((item, index) => (
                        <Link key={index} className="block text-sm text-white/80 hover:text-white transition-colors py-2 px-2 rounded hover:bg-white/5" to={item.to} onClick={() => setIsMenuOpen(false)}>
                          - {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dropdown Village */}
                <div className="px-4 py-2">
                  <button onClick={() => toggleDropdown("village")} className="w-full flex items-center justify-between font-medium text-lg text-white hover:text-gray-200 transition-colors py-2 rounded-lg hover:bg-white/10">
                    <span>Le village</span>
                    {openDropdowns.village ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openDropdowns.village ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                    <div className="pl-4 space-y-1">
                      {btnVillage.map((item, index) => (
                        <Link key={index} className="block text-sm text-white/80 hover:text-white transition-colors py-2 px-2 rounded hover:bg-white/5" to={item.to} onClick={() => setIsMenuOpen(false)}>
                          - {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Dropdown Jeunesse */}
                <div className="px-4 py-2">
                  <button onClick={() => toggleDropdown("jeunesse")} className="w-full flex items-center justify-between font-medium text-lg text-white hover:text-gray-200 transition-colors py-2 rounded-lg hover:bg-white/10">
                    <span>Jeunesse</span>
                    {openDropdowns.jeunesse ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                  </button>
                  <div className={`transition-all duration-300 ease-in-out overflow-hidden ${openDropdowns.jeunesse ? "max-h-40 opacity-100 mt-2" : "max-h-0 opacity-0"}`}>
                    <div className="pl-4 space-y-1">
                      {btnJeunesse.map((item, index) => (
                        <Link key={index} className="block text-sm text-white/80 hover:text-white transition-colors py-2 px-2 rounded hover:bg-white/5" to={item.to} onClick={() => setIsMenuOpen(false)}>
                          - {item.title}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <Link className="block font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-3 rounded-lg hover:bg-white/10" to="/associations" onClick={() => setIsMenuOpen(false)}>
                Associations
              </Link>

              <Link className="block font-medium text-lg text-white hover:text-gray-200 transition-colors px-4 py-3 rounded-lg hover:bg-white/10" to="/salle-polyvalente" onClick={() => setIsMenuOpen(false)}>
                Salle polyvalente
              </Link>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
