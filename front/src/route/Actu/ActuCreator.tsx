import { useState } from "react";

export default function ActuCreator() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("actualite");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Handle form submission
    console.log({ title, content, category });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-cwhite via-cwhite2 to-cwhite3">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold text-cgreen mb-2">Création d'actualité</h1>
            <p className="text-cgreen/70">Créez et publiez une nouvelle actualité pour la commune</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-cgreen/10">
            {/* Title */}
            <div className="mb-6">
              <label htmlFor="title" className="block text-sm font-semibold text-cgreen mb-2">
                Titre de l'actualité
              </label>
              <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cgreen/20 focus:border-cgreen focus:ring-2 focus:ring-cgreen/10 outline-none transition-all duration-300 bg-white/50" placeholder="Entrez le titre de votre actualité..." required />
            </div>

            {/* Category */}
            <div className="mb-6">
              <label htmlFor="category" className="block text-sm font-semibold text-cgreen mb-2">
                Catégorie
              </label>
              <select id="category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-4 py-3 rounded-xl border border-cgreen/20 focus:border-cgreen focus:ring-2 focus:ring-cgreen/10 outline-none transition-all duration-300 bg-white/50">
                <option value="actualite">Actualité générale</option>
                <option value="evenement">Événement</option>
                <option value="travaux">Travaux</option>
                <option value="conseil">Conseil municipal</option>
                <option value="culture">Culture</option>
                <option value="sport">Sport</option>
              </select>
            </div>

            {/* Content */}
            <div className="mb-8">
              <label htmlFor="content" className="block text-sm font-semibold text-cgreen mb-2">
                Contenu de l'actualité
              </label>
              <textarea id="content" value={content} onChange={(e) => setContent(e.target.value)} rows={12} className="w-full px-4 py-3 rounded-xl border border-cgreen/20 focus:border-cgreen focus:ring-2 focus:ring-cgreen/10 outline-none transition-all duration-300 bg-white/50 resize-y min-h-[300px]" placeholder="Rédigez le contenu de votre actualité..." required />
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-4 justify-end">
              <button type="button" className="px-6 py-3 rounded-xl border border-cgreen/30 text-cgreen hover:bg-cgreen/5 transition-all duration-300 font-medium">
                Aperçu
              </button>
              <button type="submit" className="px-8 py-3 bg-cgreen text-white rounded-xl hover:bg-cgreen/90 transition-all duration-300 font-medium shadow-lg hover:shadow-xl">
                Publier l'actualité
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
