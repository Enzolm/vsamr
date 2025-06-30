import Navbar from "@/composant/Navbar";
import CalendarExample from "@/composant/Calendrier";

function Home() {
  return (
    <div>
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h2 className="font-bold mb-4 text-2xl lg:text-2xl">Les actualités de Villeneuve sur Auvers</h2>

        {/* Layout responsive : flex-col sur mobile, flex-row sur desktop */}
        <div className="flex flex-col lg:flex-row lg:justify-between mb-6 gap-6 h-full">
          {/* Section actualités - prend tout l'espace disponible */}
          <div className="flex-1 lg:max-w-[calc(100%-470px)]">
            <div className="rounded-lg shadow-md h-fit">
              <div className="aspect-video lg:aspect-[16/9] bg-gray-200 rounded-t-lg">
                <img src="" alt="" className="w-full h-full object-cover rounded-t-lg" />
              </div>
              <div className="bg-amber-100 p-4 rounded-b-lg">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold mb-1">Titre de l'actualité</h3>
                    <p className="text-sm text-gray-600">12/08/2025</p>
                  </div>
                  <div className="sm:ml-4">
                    <p className="text-sm">Voir plus</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section calendrier - largeur fixe sur desktop, pleine largeur sur mobile */}
          <div className="w-full lg:w-[450px] h-full lg:flex-shrink-0">
            {/* <iframe src="https://www.google.com/calendar/embed?showTitle=0&showPrint=0&showTabs=0&showCalendars=0&showTz=0&mode=AGENDA&height=350&wkst=2&bgcolor=%23006600&src=mck7v0kjmq5dhljp2oe3g4ghrc%40group.calendar.google.com&color=%23A32929&src=p%23weather%40group.v.calendar.google.com&color=%231B887A&ctz=Europe%2FParis" className="rounded-lg"></iframe> */}
            <CalendarExample />
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Éditeur de contenu</h2>
        </div>

        <div className="h-30 w-30 bg-cwhite2"></div>
        <div className="h-30 w-30 bg-cwhite"></div>
        <div className="h-3000 w-30 bg-cwhite3"></div>
      </div>
    </div>
  );
}

export default Home;
