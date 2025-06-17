import Navbar from "@/composant/Navbar";
import MairieIMG from "@/assets/mairie.png";
import call_end from "@/assets/call_end.svg";
import Mail from "@/assets/Mail.svg";
import Fax from "@/assets/fax.svg";

export default function InfoMaire() {
  return (
    <div>
      <Navbar />
      <div className="max-w-5xl mx-auto px-4 py-8">
        <h1 className="font-me">Horaires / Contact</h1>
        <div className="flex flex-col md:flex-row justify-between items-start space-y-4 md:space-y-0 md:space-x-4">
          <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2630.6924281783174!2d2.2468929!3d48.4747133!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e5c5f4fd8c0001%3A0xd58a51959122b080!2sMairie%20de%20Villeneuve%20sur%20Auvers!5e0!3m2!1sfr!2sfr!4v1718624533097!5m2!1sfr!2sfr" width="600" height="450" loading="lazy" className="rounded-lg shadow-lg"></iframe>
          <div>
            <img src={MairieIMG} alt="Mairie de Villeneuve sur Auvers" className="rounded-lg shadow-lg" />
            <div className="mt-2 rounded-lg bg-white p-2 shadow-lg">
              <div onClick={() => window.open("mailto:contact@mairie-villeneuve.fr")} className="flex mt-2 ml-4 cursor-pointer">
                <img className="mr-2" src={Mail} alt="Mail" />
                <p>Mail : contact@mairie-villeneuve.fr</p>
              </div>
              <div onClick={() => window.open("tel:0160804225")} className="flex mt-2 ml-4 cursor-pointer">
                <img className="mr-2" src={call_end} alt="Téléphone" />
                <p>Tél. : 01 60 80 42 25</p>
              </div>
              <div className="flex mt-2 ml-4 cursor-pointer">
                <img className="mr-2" src={Fax} alt="Fax" />
                <p>Fax : 01 60 80 39 34</p>
              </div>
            </div>
            <div className="flex mt-4 rounded-lg bg-white p-2 shadow-lg">
              <div className="ml-2 max-w-30 border-r rounded-l-lg">Lundi et jeudi 15h00 à 18h00</div>
              <div>
                <div className="ml-4 mb-1 p-0.5 border-b">Un samedi sur deux de 10h à 12h</div>
                <div className="flex w-full justify-around">
                  <div className="align-middle text-center w-auto">
                    Janvier <br />
                    12, 14
                  </div>
                  <div className="border-r align-middle text-center w-auto"></div>
                  <div className="align-middle text-center w-auto">
                    Fevrier <br />
                    4, 18
                  </div>
                </div>
              </div>
            </div>
            <p>*Madame le Maire vous reçoit sur rendez-vous le samedi matin</p>
          </div>
        </div>
      </div>
      <footer className="fixed bottom-0 left-0 w-full overflow-clip z-10">
        <svg width="1728" height="230" viewBox="0 0 1728 230" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M2494 641.169C2494 931.118 1975.55 1166.17 1336 1166.17C696.454 1166.17 -723 1113.73 -723 823.778C-723 533.828 331.844 377.145 565 193.757C1228 -327.722 2494 351.219 2494 641.169Z" fill="#648445" />
          <path d="M1083 689.799C1083 979.748 564.546 1214.8 -75 1214.8C-714.546 1214.8 -1233 979.748 -1233 689.799C-1233 399.849 -399 194.299 -142.5 71.2985C438.09 -207.114 1083 399.849 1083 689.799Z" fill="#819F62" />
        </svg>
      </footer>
    </div>
  );
}
