import { useState, useEffect } from "react";
import { Link, useSearchParams, useNavigate } from "react-router";
import { Lock, Eye, EyeOff, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";
import logo from "@/assets/logoclear.png";

function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  // Rediriger si pas de token
  useEffect(() => {
    if (!token) {
      navigate("/forgot-password");
    }
  }, [token, navigate]);

  const validatePassword = (pwd: string) => {
    if (pwd.length < 6) {
      return "Le mot de passe doit contenir au moins 6 caractères";
    }
    return "";
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Reset de l'erreur
    setError("");

    // Validations
    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!token) {
      setError("Token manquant");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("http://localhost:3001/utilisateur/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token,
          newPassword: password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Une erreur est survenue");
      }

      const data = await response.json();
      console.log("Password reset successful:", data.message);

      setIsSuccess(true);

      // Rediriger vers login après 3 secondes
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      console.error("Password reset error:", err);
      setError(err instanceof Error ? err.message : "Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (error) {
      setError("");
    }
  };

  const handleConfirmPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setConfirmPassword(e.target.value);
    if (error) {
      setError("");
    }
  };

  if (!token) {
    return null; // Le useEffect va rediriger
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Header avec logo */}
        <div className="text-center">
          <Link to="/" className="inline-block">
            <img className="mx-auto h-16 w-auto" src={logo} alt="Logo Villeneuve sur Auvers" />
          </Link>
          <div className="mt-6 transition-all duration-300 ease-in-out">
            <h2 className="text-3xl font-bold text-gray-900">{isSuccess ? "Mot de passe modifié !" : "Nouveau mot de passe"}</h2>
            <p className="mt-2 text-sm text-gray-600">{isSuccess ? "Votre mot de passe a été modifié avec succès. Redirection vers la connexion..." : "Saisissez votre nouveau mot de passe"}</p>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all duration-300 ease-in-out transform">
          {!isSuccess ? (
            /* Formulaire de réinitialisation */
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Nouveau mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="password" name="password" type={showPassword ? "text" : "password"} autoComplete="new-password" required value={password} onChange={handlePasswordChange} className={`block w-full pl-10 pr-12 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-all duration-200 ${error && (error.includes("mot de passe") || error.includes("6 caractères")) ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="Votre nouveau mot de passe" disabled={isLoading} />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </button>
                </div>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} autoComplete="new-password" required value={confirmPassword} onChange={handleConfirmPasswordChange} className={`block w-full pl-10 pr-12 py-3 border rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-all duration-200 ${error && error.includes("correspondent") ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="Confirmez votre mot de passe" disabled={isLoading} />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                    {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </button>
                </div>
              </div>

              {/* Message d'erreur */}
              {error && (
                <div className="flex items-center text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200">
                  <AlertCircle className="h-4 w-4 mr-2 flex-shrink-0" />
                  {error}
                </div>
              )}

              {/* Bouton de soumission */}
              <div>
                <button type="submit" disabled={isLoading || !password || !confirmPassword} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cgreen2 hover:bg-cgreen3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgreen2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none">
                  {isLoading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      <span>Modification en cours...</span>
                    </div>
                  ) : (
                    <span className="transition-all duration-200">Modifier le mot de passe</span>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Confirmation de succès */
            <div className="text-center space-y-6">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>

              <div className="space-y-3">
                <p className="text-gray-700">Votre mot de passe a été modifié avec succès !</p>
                <p className="text-sm text-gray-600">Vous allez être redirigé vers la page de connexion...</p>
              </div>

              {/* Action manuelle */}
              <div>
                <Link to="/login" className="inline-flex items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cgreen2 hover:bg-cgreen3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgreen2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                  Se connecter maintenant
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        {!isSuccess && (
          <div className="text-center space-y-3">
            <Link to="/forgot-password" className="inline-flex items-center text-sm text-gray-600 hover:text-cgreen2 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Demander un nouveau lien
            </Link>

            <div className="text-sm">
              <Link to="/" className="text-gray-600 hover:text-cgreen2 transition-colors">
                ← Retour à l'accueil
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default ResetPassword;
