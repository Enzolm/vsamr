import { useState, useEffect } from "react";
import { Link } from "react-router";
import { Building, Mail, Phone, Globe, Facebook, Instagram, MessageCircle, Youtube, ExternalLink, ArrowRight, MapPin, Calendar, Users } from "lucide-react";
import logo from "@/assets/logoclear.png";
import axios from "axios";
import { toast } from "sonner";
import Navbar from "@/composant/Navbar";
import { config } from "@/config/config";
import { texte } from "@/config/texte";

interface Association {
  id: number;
  nom: string;
  description: string;
  email: string;
  logo_path?: string;
  logo_url?: string;
  telephone?: string;
  facebook?: string;
  instagram?: string;
  whatsapp?: string;
  tiktok?: string;
  youtube?: string;
  site_externe?: string;
  created_at: string;
  updated_at: string;
}

export default function AssociationsListAll() {
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.api.baseUrl}/associations`);
      setAssociations(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching associations:", error);
      setError("Erreur lors du chargement des associations");
      toast.error("Impossible de charger les associations");
    } finally {
      setLoading(false);
    }
  };

  const getSocialLinks = (association: Association) => {
    const links = [];
    if (association.facebook) links.push({ icon: Facebook, url: association.facebook, name: "Facebook", color: "text-blue-600" });
    if (association.instagram) links.push({ icon: Instagram, url: association.instagram, name: "Instagram", color: "text-pink-600" });
    if (association.youtube) links.push({ icon: Youtube, url: association.youtube, name: "YouTube", color: "text-red-600" });
    if (association.tiktok) links.push({ icon: ExternalLink, url: association.tiktok, name: "TikTok", color: "text-black" });
    if (association.site_externe) links.push({ icon: Globe, url: association.site_externe, name: "Site web", color: "text-cgreen2" });
    return links;
  };

  const filteredAssociations = associations.filter((association) => association.nom.toLowerCase().includes(searchTerm.toLowerCase()) || association.description.toLowerCase().includes(searchTerm.toLowerCase()));

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cgreen-50 via-white to-cgreen2/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cgreen2 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement des associations...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cgreen-50 via-white to-cgreen2/10">
      {/* Hero Section */}
      <Navbar />
      <h2 className="font-bold mb-4 text-xl lg:text-2xl  ml-5  max-w-2xl ">Les Associations de Villeneuve sur Auvers</h2>
      <p className="text-sm text-cgreen-50 max-w-2xl  ml-5">Découvrez toutes les associations qui font vivre notre commune et rejoignez-nous !</p>

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Barre de recherche */}
        <div className="mb-8 max-w-md mx-auto">
          <div className="relative">
            <input type="text" placeholder="Rechercher une association..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-4 py-3 pl-10 pr-4 border-2 border-gray-200 rounded-lg focus:border-cgreen2 focus:ring-2 focus:ring-cgreen2/20 focus:outline-none transition-colors" />
            <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Message d'erreur */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8 max-w-2xl mx-auto">
            <p className="text-red-800 text-center">{error}</p>
            <button onClick={fetchAssociations} className="mt-2 text-red-600 hover:text-red-800 underline block mx-auto">
              Réessayer
            </button>
          </div>
        )}

        {/* Résultats de recherche */}
        {searchTerm && (
          <div className="mb-6 text-center">
            <p className="text-gray-600">
              {filteredAssociations.length} résultat{filteredAssociations.length > 1 ? "s" : ""} pour "{searchTerm}"
            </p>
            {filteredAssociations.length === 0 && <p className="text-gray-500 mt-2">Aucune association ne correspond à votre recherche</p>}
          </div>
        )}

        {/* Liste des associations */}
        {filteredAssociations.length === 0 && !searchTerm ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune association disponible</h3>
            <p className="text-gray-600">Les associations seront bientôt disponibles sur cette page.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredAssociations.map((association) => (
              <Link key={association.id} to={`/associations/${association.id}`} className="group bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden transform transition-all duration-1000 ease-out hover:shadow-2xl hover:scale-105 hover:-translate-y-1">
                {" "}
                {/* Header avec logo et nom */}
                <div className="relative bg-gradient-to-r from-cgreen2 to-cgreen3 p-6 text-white min-h-[140px] flex items-center">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2 line-clamp-2 group-hover:text-cgreen-50 transition-colors">{association.nom}</h3>
                    <div className="flex items-center text-cgreen-100">
                      <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                      <span className="text-sm truncate">{association.email}</span>
                    </div>
                  </div>
                  {association.logo_url && (
                    <div className="ml-4 flex-shrink-0">
                      <img src={association.logo_url} alt={`Logo ${association.nom}`} className="w-16 h-16 object-cover rounded-lg border-2 border-white/20" />
                    </div>
                  )}

                  {/* Icône de lien */}
                  <div className="absolute top-4 right-4">
                    <ArrowRight className="h-5 w-5 text-white/70 group-hover:text-white group-hover:translate-x-1 transition-all duration-200" />
                  </div>
                </div>
                {/* Contenu */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3 leading-relaxed">{association.description}</p>

                  {/* Informations de contact */}
                  <div className="space-y-2 mb-4">
                    {association.telephone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-cgreen2 flex-shrink-0" />
                        <span>{association.telephone}</span>
                      </div>
                    )}
                    {association.whatsapp && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MessageCircle className="h-4 w-4 mr-2 text-cgreen2 flex-shrink-0" />
                        <span>{association.whatsapp}</span>
                      </div>
                    )}
                  </div>

                  {/* Liens sociaux */}
                  {getSocialLinks(association).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getSocialLinks(association).map((link, index) => (
                        <div
                          key={index}
                          className="inline-flex items-center px-2 py-1 bg-gray-100 rounded text-xs hover:bg-gray-200 transition-colors"
                          onClick={(e) => e.preventDefault()} // Empêche la navigation quand on clique sur les liens sociaux
                        >
                          <link.icon className={`h-3 w-3 mr-1 ${link.color}`} />
                          <span className="text-gray-600">{link.name}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Date et call to action */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center text-xs text-gray-400">
                      <Calendar className="h-3 w-3 mr-1" />
                      <span>Depuis {new Date(association.created_at).getFullYear()}</span>
                    </div>
                    <span className="text-sm font-medium text-cgreen2 group-hover:text-cgreen3 transition-colors">En savoir plus →</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Call to action */}
        <div className="mt-16 bg-white rounded-2xl shadow-xl p-8 text-center border border-gray-100">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Votre association n'est pas dans la liste ?</h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">Contactez la mairie pour ajouter votre association à l'annuaire et faire découvrir vos activités aux habitants de Villeneuve sur Auvers.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:mairie@villeneuve-sur-auvers.fr"
              className="inline-flex items-center px-6 py-3 bg-cgreen2 text-white rounded-lg 
               hover:bg-cgreen3 hover:shadow-xl hover:scale-105 hover:-translate-y-1
               transition-all duration-300 ease-out transform
               focus:outline-none focus:ring-4 focus:ring-cgreen2/20
               active:scale-95"
            >
              <Mail className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200 ease-out" />
              Contacter la mairie
            </a>
            <a
              href={`tel:${texte.contact.mairie.telephone}`}
              className="inline-flex items-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg 
               hover:bg-gray-200 hover:shadow-lg hover:scale-105 hover:-translate-y-1
               transition-all duration-300 ease-out transform
               focus:outline-none focus:ring-4 focus:ring-gray-200
               active:scale-95"
            >
              <Phone className="h-5 w-5 mr-2 group-hover:scale-110 transition-transform duration-200 ease-out" />
              {texte.contact.mairie.telephone}
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
