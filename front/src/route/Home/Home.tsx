import Navbar from "@/composant/Navbar";
import NavButton from "@/composant/ui/NavButton";

function Home() {
  return (
    <div>
      <Navbar />
      <h1>Home</h1>
      <p>Welcome to the home page!</p>

      <div className="h-30 w-30 bg-cwhite2"></div>
      <div className="h-30 w-30 bg-cwhite"></div>

      <div className="h-3000 w-30 bg-cwhite3"></div>
    </div>
  );
}

export default Home;
