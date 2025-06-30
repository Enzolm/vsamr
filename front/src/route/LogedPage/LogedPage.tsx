import NavbarLoged from "./Component/NavbarLoged";

export default function LogedPage() {
  return (
    <div className="items-center flex h-screen bg-cgreen1">
      <NavbarLoged />
      {/* Contenu de la page loguée */}
      <h1>Bienvenue sur votre page</h1>
    </div>
  );
}
