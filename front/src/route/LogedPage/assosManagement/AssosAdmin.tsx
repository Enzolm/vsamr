import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Building, Mail, Phone, Globe, Facebook, Instagram, MessageCircle, Youtube, Upload, X } from "lucide-react";
import logo from "@/assets/logoclear.png";
import axios from "axios";
import { toast } from "sonner";
import { config } from "@/config/config";

// Schéma de validation Zod
const associationSchema = z.object({
  nom: z.string().trim().min(1, "Le nom est requis").min(3, "Le nom doit contenir au moins 3 caractères"),
  description: z.string().trim().min(1, "La description est requise").min(10, "La description doit contenir au moins 10 caractères"),
  email: z.string().trim().min(1, "L'email est requis").email("Format d'email invalide"),
  // Champs facultatifs
  telephone: z.string().trim().optional(),
  facebook: z.string().trim().url("URL Facebook invalide").optional().or(z.literal("")),
  instagram: z.string().trim().url("URL Instagram invalide").optional().or(z.literal("")),
  whatsapp: z.string().trim().optional(),
  tiktok: z.string().trim().url("URL TikTok invalide").optional().or(z.literal("")),
  youtube: z.string().trim().url("URL YouTube invalide").optional().or(z.literal("")),
  siteExterne: z.string().trim().url("URL du site invalide").optional().or(z.literal("")),
});

type AssociationFormData = z.infer<typeof associationSchema>;

function CreateAssociation() {
  const navigate = useNavigate();
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);

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

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Vérifier le type de fichier
      if (!file.type.startsWith("image/")) {
        toast.error("Veuillez sélectionner un fichier image valide");
        return;
      }

      // Vérifier la taille (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Le fichier ne doit pas dépasser 5MB");
        return;
      }

      setLogoFile(file);

      // Créer un aperçu
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
    // Reset du champ input file
    const fileInput = document.getElementById("logo") as HTMLInputElement;
    if (fileInput) fileInput.value = "";
  };

  const onSubmit = async (data: AssociationFormData) => {
    console.log("Association data:", data);
    console.log("Logo file:", logoFile);

    try {
      // Créer FormData pour inclure le fichier
      const formData = new FormData();

      // Ajouter les données du formulaire
      Object.entries(data).forEach(([key, value]) => {
        if (value) formData.append(key, value);
      });

      // Ajouter le logo si présent
      if (logoFile) {
        formData.append("logo", logoFile);
      }

      const response = await axios.post(`${config.api.baseUrl}/associations/create`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("authToken")}`,
        },
      });

      console.log("Association created:", response.data);
      toast.success("Association créée avec succès !");
      navigate("/logged/associations"); // Ou vers la liste des associations
    } catch (error) {
      console.error("Error creating association:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 409) {
          toast.error("Une association avec ce nom existe déjà.");
        } else if (error.response?.status === 401) {
          toast.error("Vous devez être connecté pour créer une association.");
        } else {
          toast.error(error.response?.data?.error || "Une erreur est survenue lors de la création.");
        }
      } else {
        toast.error("Une erreur réseau est survenue.");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cgreen-50 via-white to-cgreen2/10 flex items-center justify-center px-4 py-12">
      <div className="max-w-2xl w-full space-y-8">
        {/* Header avec logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img className="mx-auto h-16 w-auto" src={logo} alt="Logo Villeneuve sur Auvers" />
          </Link>
          <div className="mt-6">
            <h2 className="text-3xl font-bold text-gray-900">Créer une association</h2>
            <p className="mt-2 text-sm text-gray-600">Ajoutez votre association à la communauté de Villeneuve sur Auvers</p>
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

            {/* Logo */}
            <div>
              <label htmlFor="logo" className="block text-sm font-medium text-gray-700 mb-2">
                Logo de l'association
              </label>
              <div className="space-y-4">
                {logoPreview ? (
                  <div className="relative inline-block">
                    <img src={logoPreview} alt="Aperçu du logo" className="w-24 h-24 object-cover rounded-lg border-2 border-gray-300" />
                    <button type="button" onClick={removeLogo} className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors">
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-cgreen2 transition-colors">
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="mt-2">
                      <label htmlFor="logo" className="cursor-pointer">
                        <span className="text-sm text-cgreen2 hover:text-cgreen3 font-medium">Télécharger un logo</span>
                        <input id="logo" type="file" accept="image/*" onChange={handleLogoChange} className="hidden" />
                      </label>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG jusqu'à 5MB</p>
                  </div>
                )}
              </div>
            </div>

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

            {/* Séparateur pour les champs facultatifs */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Informations facultatives</span>
              </div>
            </div>

            {/* Grille pour les champs facultatifs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Téléphone */}
              <div>
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700 mb-2">
                  Téléphone
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="telephone" type="tel" {...form.register("telephone")} className="block w-full pl-10 pr-3 py-3 border-2 border-gray-300 bg-gray-50 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent focus:bg-white transition-colors duration-200" placeholder="01 23 45 67 89" />
                </div>
              </div>

              {/* Site externe */}
              <div>
                <label htmlFor="siteExterne" className="block text-sm font-medium text-gray-700 mb-2">
                  Site web
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Globe className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="siteExterne" type="url" {...form.register("siteExterne")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${form.formState.errors.siteExterne ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="https://www.example.com" />
                  {form.formState.errors.siteExterne && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{form.formState.errors.siteExterne.message}</div>}
                </div>
              </div>

              {/* Facebook */}
              <div>
                <label htmlFor="facebook" className="block text-sm font-medium text-gray-700 mb-2">
                  Facebook
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Facebook className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="facebook" type="url" {...form.register("facebook")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${form.formState.errors.facebook ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="https://facebook.com/votre-page" />
                  {form.formState.errors.facebook && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{form.formState.errors.facebook.message}</div>}
                </div>
              </div>

              {/* Instagram */}
              <div>
                <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                  Instagram
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Instagram className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="instagram" type="url" {...form.register("instagram")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${form.formState.errors.instagram ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="https://instagram.com/votre-compte" />
                  {form.formState.errors.instagram && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{form.formState.errors.instagram.message}</div>}
                </div>
              </div>

              {/* WhatsApp */}
              <div>
                <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-2">
                  WhatsApp
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <MessageCircle className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="whatsapp" type="tel" {...form.register("whatsapp")} className="block w-full pl-10 pr-3 py-3 border-2 border-gray-300 bg-gray-50 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent focus:bg-white transition-colors duration-200" placeholder="+33 6 12 34 56 78" />
                </div>
              </div>

              {/* YouTube */}
              <div>
                <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-2">
                  YouTube
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Youtube className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="youtube" type="url" {...form.register("youtube")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${form.formState.errors.youtube ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="https://youtube.com/@votre-chaine" />
                  {form.formState.errors.youtube && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{form.formState.errors.youtube.message}</div>}
                </div>
              </div>

              {/* TikTok */}
              <div className="md:col-span-2">
                <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700 mb-2">
                  TikTok
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <div className="h-5 w-5 text-gray-400 font-bold">🎵</div>
                  </div>
                  <input id="tiktok" type="url" {...form.register("tiktok")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${form.formState.errors.tiktok ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="https://tiktok.com/@votre-compte" />
                  {form.formState.errors.tiktok && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{form.formState.errors.tiktok.message}</div>}
                </div>
              </div>
            </div>

            {/* Boutons */}
            <div className="flex gap-4 pt-6">
              <Link to="/logged/associations" className="flex-1 py-3 px-4 border-2 border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:border-transparent transition-all duration-200 text-center">
                Annuler
              </Link>
              <button type="submit" disabled={!form.formState.isValid || form.formState.isSubmitting} className="flex-1 py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cgreen2 hover:bg-cgreen3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgreen2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg">
                {form.formState.isSubmitting ? "Création..." : "Créer l'association"}
              </button>
            </div>
          </form>
        </div>

        {/* Retour */}
        <div className="text-center">
          <Link to="/logged/associations" className="inline-flex items-center text-sm text-gray-600 hover:text-cgreen2 transition-colors">
            ← Retour aux associations
          </Link>
        </div>
      </div>
    </div>
  );
}

export default CreateAssociation;
