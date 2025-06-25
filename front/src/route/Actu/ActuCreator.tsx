import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";

export default function ActuCreator() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-4">Création d'une actu</h1>
      <p className="mb-6">Utilisez l'éditeur ci-dessous pour créer une nouvelle actu.</p>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Éditeur de contenu</h2>
        <SimpleEditor />
      </div>

      <div className="h-30 w-30 bg-cwhite2"></div>
      <div className="h-30 w-30 bg-cwhite"></div>
      <div className="h-3000 w-30 bg-cwhite3"></div>
    </div>
  );
}
