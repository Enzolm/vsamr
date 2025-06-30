import { useState } from "react";
import { Link } from "react-router";
import { Mail, ArrowLeft, CheckCircle, AlertCircle } from "lucide-react";
import logo from "@/assets/logoclear.png";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset de l'erreur
    setError("");

    // Validation simple de l'email
    if (!email || !email.includes("@")) {
      setError("Veuillez saisir une adresse email valide");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/utilisateur/request-password-reset", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue");
      }

      const data = await response.json();
      console.log("Password reset email sent:", data.message);

      setIsSubmitted(true);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    // Reset de l'erreur quand l'utilisateur tape
    if (error) {
      setError("");
    }
  };

  const resetForm = () => {
    setIsSubmitted(false);
    setEmail("");
    setError("");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header avec logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img className="mx-auto h-16 w-auto" src={logo} alt="Logo Villeneuve sur Auvers" />
          </Link>
          <div className="mt-6 transition-all duration-300 ease-in-out">
            <h2 className="text-3xl font-bold text-gray-900">{isSubmitted ? "Email envoyé !" : "Mot de passe oublié"}</h2>
            <p className="mt-2 text-sm text-gray-600">{isSubmitted ? "Vérifiez votre boîte email pour réinitialiser votre mot de passe" : "Saisissez votre email pour recevoir un lien de réinitialisation"}</p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all duration-300 ease-in-out transform">
          {!isSubmitted ? (
            /* Formulaire de demande */
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={handleInputChange} className={`block w-full pl-10 pr-3 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-all duration-200 ${error ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="votre@email.com" disabled={isLoading} />
                </div>
                {/* Espace réservé pour le message d'erreur */}
                <div className="h-6 mt-1 flex items-start">
                  {error && (
                    <div className="flex items-center text-xs text-red-600 bg-red-50 px-2 py-1 rounded transition-opacity duration-200">
                      <AlertCircle className="h-3 w-3 mr-1" />
                      {error}
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton de soumission */}
              <div>
                <button type="submit" disabled={isLoading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cgreen2 hover:bg-cgreen3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgreen2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Envoi en cours...</span>
                    </div>
                  ) : (
                    <span className="transition-all duration-200">Envoyer le lien de réinitialisation</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation d'envoi */
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div className="space-y-3">
                <p className="text-gray-700">Un email avec les instructions de réinitialisation a été envoyé à :</p>
                <p className="font-medium text-cgreen2 bg-gray-50 py-2 px-4 rounded-lg">{email}</p>
                <p className="text-sm text-gray-600">Si vous ne recevez pas l'email dans les prochaines minutes, vérifiez votre dossier spam.</p>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button onClick={resetForm} className="w-full py-3 px-4 border border-cgreen2 text-sm font-medium rounded-lg text-cgreen2 bg-white hover:bg-cgreen2 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgreen2 transition-all duration-200 transform hover:scale-105">
                  Envoyer à une autre adresse
                </button>

                <Link to="/login" className="block w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cgreen2 hover:bg-cgreen3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgreen2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl text-center">
                  Retour à la connexion
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="text-center space-y-3">
          <Link to="/login" className="inline-flex items-center text-sm text-gray-600 hover:text-cgreen2 transition-colors">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à la connexion
          </Link>

          <div className="text-sm">
            <Link to="/" className="text-gray-600 hover:text-cgreen2 transition-colors">
              ← Retour à l'accueil
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
