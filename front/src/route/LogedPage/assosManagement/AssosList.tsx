import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import { Building, Mail, Phone, Globe, Facebook, Instagram, MessageCircle, Youtube, Edit, Trash2, Plus, Eye, ExternalLink } from "lucide-react";
import logo from "@/assets/logoclear.png";
import axios from "axios";
import { toast } from "sonner";
import { config } from "@/config/config";

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

function AssociationsList() {
  const navigate = useNavigate();
  const [associations, setAssociations] = useState<Association[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; association: Association | null }>({
    show: false,
    association: null,
  });

  useEffect(() => {
    fetchAssociations();
  }, []);

  const fetchAssociations = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${config.api.baseUrl}/associations`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });
      setAssociations(response.data);
      setError(null);
    } catch (error) {
      console.error("Error fetching associations:", error);
      setError("Erreur lors du chargement des associations");
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        toast.error("Session expirée, veuillez vous reconnecter");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (association: Association) => {
    // Naviguer vers le formulaire d'édition avec les données
    navigate("/logged/associations/edit", { state: { association } });
  };

  const handleDelete = async (association: Association) => {
    try {
      await axios.delete(`${config.api.baseUrl}/associations/${association.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      toast.success("Association supprimée avec succès");
      setDeleteModal({ show: false, association: null });
      fetchAssociations(); // Recharger la liste
    } catch (error) {
      console.error("Error deleting association:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 403) {
          toast.error("Vous n'avez pas les droits pour supprimer cette association");
        } else if (error.response?.status === 404) {
          toast.error("Association non trouvée");
        } else {
          toast.error("Erreur lors de la suppression");
        }
      }
    }
  };

  const getSocialLinks = (association: Association) => {
    const links = [];
    if (association.facebook) links.push({ icon: Facebook, url: association.facebook, name: "Facebook" });
    if (association.instagram) links.push({ icon: Instagram, url: association.instagram, name: "Instagram" });
    if (association.youtube) links.push({ icon: Youtube, url: association.youtube, name: "YouTube" });
    if (association.tiktok) links.push({ icon: ExternalLink, url: association.tiktok, name: "TikTok" });
    if (association.site_externe) links.push({ icon: Globe, url: association.site_externe, name: "Site web" });
    return links;
  };

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
    <div className="min-h-screen bg-gradient-to-br from-cgreen-50 via-white to-cgreen2/10 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-left mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Gestion des Associations</h1>
          <p className="text-gray-600">Gérez les associations de Villeneuve sur Auvers</p>
        </div>

        {/* Actions */}
        <div className="mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center">
          <div className="flex gap-4">
            <Link to="/logged/associations/create" className="inline-flex items-center px-4 py-2 bg-cgreen2 text-white rounded-lg hover:bg-cgreen3 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
              <Plus className="h-5 w-5 mr-2" />
              Nouvelle association
            </Link>
            <button onClick={fetchAssociations} className="inline-flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
              Actualiser
            </button>
          </div>
          <div className="text-sm text-gray-500">
            {associations.length} association{associations.length > 1 ? "s" : ""} trouvée{associations.length > 1 ? "s" : ""}
          </div>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
            <p className="text-red-800">{error}</p>
            <button onClick={fetchAssociations} className="mt-2 text-red-600 hover:text-red-800 underline">
              Réessayer
            </button>
          </div>
        )}

        {/* Liste des associations */}
        {associations.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-xl p-12 text-center border border-gray-100">
            <Building className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Aucune association</h3>
            <p className="text-gray-600 mb-6">Commencez par créer votre première association</p>
            <Link to="/logged/associations/create" className="inline-flex items-center px-6 py-3 bg-cgreen2 text-white rounded-lg hover:bg-cgreen3 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105">
              <Plus className="h-5 w-5 mr-2" />
              Créer une association
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {associations.map((association) => (
              <div key={association.id} className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
                {/* Header avec logo */}
                <div className="bg-gradient-to-r from-cgreen2 to-cgreen3 p-6 text-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold mb-2 line-clamp-2">{association.nom}</h3>
                      <div className="flex items-center text-cgreen-50">
                        <Mail className="h-4 w-4 mr-2" />
                        <span className="text-sm truncate">{association.email}</span>
                      </div>
                    </div>
                    {association.logo_url && <img src={association.logo_url} alt={`Logo ${association.nom}`} className="w-16 h-16 object-cover rounded-lg border-2 border-white/20 ml-4" />}
                  </div>
                </div>

                {/* Contenu */}
                <div className="p-6">
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{association.description}</p>

                  {/* Informations de contact */}
                  <div className="space-y-2 mb-4">
                    {association.telephone && (
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2 text-cgreen2" />
                        <span>{association.telephone}</span>
                      </div>
                    )}
                    {association.whatsapp && (
                      <div className="flex items-center text-sm text-gray-600">
                        <MessageCircle className="h-4 w-4 mr-2 text-cgreen2" />
                        <span>{association.whatsapp}</span>
                      </div>
                    )}
                  </div>

                  {/* Liens sociaux */}
                  {getSocialLinks(association).length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {getSocialLinks(association).map((link, index) => (
                        <a key={index} href={link.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs hover:bg-cgreen-50 hover:text-cgreen2 transition-colors" title={link.name}>
                          <link.icon className="h-3 w-3 mr-1" />
                          {link.name}
                        </a>
                      ))}
                    </div>
                  )}

                  {/* Date de création */}
                  <div className="text-xs text-gray-400 mb-4">Créée le {new Date(association.created_at).toLocaleDateString("fr-FR")}</div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(association)} className="flex-1 inline-flex items-center justify-center px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium">
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </button>
                    <button onClick={() => setDeleteModal({ show: true, association })} className="inline-flex items-center justify-center px-3 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal de confirmation de suppression */}
        {deleteModal.show && deleteModal.association && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Supprimer l'association</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Êtes-vous sûr de vouloir supprimer l'association <strong>"{deleteModal.association.nom}"</strong> ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteModal({ show: false, association: null })} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    Annuler
                  </button>
                  <button onClick={() => handleDelete(deleteModal.association!)} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
                    Supprimer
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AssociationsList;
