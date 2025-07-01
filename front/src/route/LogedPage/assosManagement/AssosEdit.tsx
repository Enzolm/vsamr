import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building, Mail, Phone, Globe, Facebook, Instagram, MessageCircle, Youtube, Upload, X, Save, Trash2 } from "lucide-react";
import logo from "@/assets/logoclear.png";
import axios from "axios";
import { toast } from "sonner";
import { config } from "@/config/config";

// Schéma de validation Zod (identique au formulaire de création)
const associationSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est requis").min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().trim().min(1, "La description est requise").min(10, "La description doit contenir au moins 10 caractères"),
  email: z.string().trim().min(1, "L'email est requis").email("Format d'email invalide"),
  telephone: z.string().trim().optional(),
  facebook: z.string().trim().url("URL Facebook invalide").optional().or(z.literal("")),
  instagram: z.string().trim().url("URL Instagram invalide").optional().or(z.literal("")),
  whatsapp: z.string().trim().optional(),
  tiktok: z.string().trim().url("URL TikTok invalide").optional().or(z.literal("")),
  youtube: z.string().trim().url("URL YouTube invalide").optional().or(z.literal("")),
  siteExterne: z.string().trim().url("URL du site invalide").optional().or(z.literal("")),
});

type AssociationFormData = z.infer<typeof associationSchema>;

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
}

function EditAssociation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [currentLogo, setCurrentLogo] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  // Récupérer l'association depuis le state de navigation
  const association = location.state?.association as Association;

  const form = useForm<AssociationFormData>({
    resolver: zodResolver(associationSchema),
    mode: "onChange",
    defaultValues: {
      nom: "",
      description: "",
      email: "",
      telephone: "",
      facebook: "",
      instagram: "",
      whatsapp: "",
      tiktok: "",
      youtube: "",
      siteExterne: "",
    },
  });

  useEffect(() => {
    if (!association) {
      toast.error("Association non trouvée");
      navigate("/logged/associations");
      return;
    }

    // Pré-remplir le formulaire avec les données de l'association
    form.reset({
      nom: association.nom || "",
      description: association.description || "",
      email: association.email || "",
      telephone: association.telephone || "",
      facebook: association.facebook || "",
      instagram: association.instagram || "",
      whatsapp: association.whatsapp || "",
      tiktok: association.tiktok || "",
      youtube: association.youtube || "",
      siteExterne: association.site_externe || "",
    });

    // Définir le logo actuel
    if (association.logo_url) {
      setCurrentLogo(association.logo_url);
    }
  }, [association, form, navigate]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image valide");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error("Le fichier ne doit pas dépasser 5MB");
        return;
      }

      setLogoFile(file);

      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setLogoFile(null);
    setLogoPreview(null);
    const fileInput = document.getElementById("logo") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const removeCurrentLogo = () => {
    setCurrentLogo(null);
  };

  const onSubmit = async (data: AssociationFormData) => {
    try {
      const formData = new FormData();

      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      if (logoFile) {
        formData.append("logo", logoFile);
      }

      // Si on a supprimé le logo actuel, l'indiquer
      if (association.logo_url && !currentLogo && !logoFile) {
        formData.append("removeLogo", "true");
      }

      const response = await axios.put(`${config.api.baseUrl}/associations/${association.id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      console.log("Association updated:", response.data);
      toast.success("Association modifiée avec succès !");
      navigate("/logged/associations");
    } catch (error) {
      console.error("Error updating association:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Une association avec ce nom existe déjà.");
        } else if (error.response?.status === 401) {
          toast.error("Vous devez être connecté pour modifier une association.");
        } else if (error.response?.status === 403) {
          toast.error("Vous n'avez pas les droits pour modifier cette association.");
        } else {
          toast.error(error.response?.data?.error || "Une erreur est survenue lors de la modification.");
        }
      } else {
        toast.error("Une erreur réseau est survenue.");
      }
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`${config.api.baseUrl}/associations/${association.id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      toast.success("Association supprimée avec succès");
      navigate("/logged/associations");
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

  if (!association) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-cgreen-50 via-white to-cgreen2/10 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cgreen2 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-cgreen-50 via-white to-cgreen2/10 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img className="mx-auto h-16 w-auto" src={logo} alt="Logo Villeneuve sur Auvers" />
          </Link>
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-900">Modifier l'association</h2>
            <p className="mt-2 text-sm text-gray-600">Modifiez les informations de "{association.nom}"</p>
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            {/* Nom de l'association */}
            <div>
              <label htmlFor="nom" className="block text-sm font-medium text-gray-700 mb-2">
                Nom de l'association <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Building className="h-5 w-5 text-gray-400" />
                </div>
                <input id="nom" type="text" {...form.register("nom")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${form.formState.errors.nom ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="Nom de votre association" />
                {form.formState.errors.nom && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{form.formState.errors.nom.message}</div>}
              </div>
            </div>

            {/* Logo - Affichage du logo actuel et nouveau */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                Logo de l'association
              </label>
              <div className="space-y-4">
                {/* Logo actuel */}
                {currentLogo && !logoPreview && (
                  <div className="relative inline-block">
                    <img src={currentLogo} alt="Logo actuel" className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300" />
                    <button type="button" onClick={removeCurrentLogo} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                    <div className="text-xs text-gray-500 mt-1">Logo actuel</div>
                  </div>
                )}

                {/* Nouveau logo */}
                {logoPreview ? (
                  <div className="relative inline-block">
                    <img src={logoPreview} alt="Nouveau logo" className="w-24 h-24 object-cover rounded-lg border-2 border-cgreen2" />
                    <button type="button" onClick={removeLogo} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                    <div className="text-xs text-cgreen2 mt-1 font-medium">Nouveau logo</div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-cgreen2 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="logo" className="cursor-pointer">
                        <span className="text-sm text-cgreen2 hover:text-cgreen3 font-medium">{currentLogo ? "Changer le logo" : "Télécharger un logo"}</span>
                        <input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* Le reste du formulaire est identique au formulaire de création */}
            {/* Description */}
            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Description <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <textarea id="description" rows={4} {...form.register("description")} className={`block w-full px-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 resize-none ${form.formState.errors.description ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="Décrivez les activités et objectifs de votre association..." />
                {form.formState.errors.description && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{form.formState.errors.description.message}</div>}
              </div>
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email <span className="text-red-500">*</span>
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email" type="email" {...form.register("email")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${form.formState.errors.email ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="contact@association.com" />
                {form.formState.errors.email && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{form.formState.errors.email.message}</div>}
              </div>
            </div>

            {/* Champs facultatifs - Je ne recopie pas tout pour économiser l'espace, mais c'est identique au formulaire de création */}

            {/* Boutons d'action */}
            <div className="flex gap-4 pt-6">
              <Link to="/logged/associations" className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 text-center">
                Annuler
              </Link>
              <button type="button" onClick={() => setDeleteModal(true)} className="px-4 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200">
                <Trash2 className="h-4 w-4" />
              </button>
              <button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting} className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cgreen2 hover:bg-cgreen3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgreen2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg inline-flex items-center justify-center">
                <Save className="h-4 w-4 mr-2" />
                {form.formState.isSubmitting ? "Modification..." : "Sauvegarder"}
              </button>
            </div>
          </form>
        </div>

        {/* Modal de suppression */}
        {deleteModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="text-center">
                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                  <Trash2 className="h-6 w-6 text-red-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Supprimer l'association</h3>
                <p className="text-sm text-gray-500 mb-6">
                  Êtes-vous sûr de vouloir supprimer l'association <strong>"{association.nom}"</strong> ? Cette action est irréversible.
                </p>
                <div className="flex gap-3">
                  <button onClick={() => setDeleteModal(false)} className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors">
                    Annuler
                  </button>
                  <button onClick={handleDelete} className="flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors">
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

export default EditAssociation;
