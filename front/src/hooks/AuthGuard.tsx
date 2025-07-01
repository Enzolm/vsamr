import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { getAuthToken, isTokenValid, logout, accountValidation } from "@/lib/auth";

const AuthGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    accountValidation();
    const checkAuthentication = async () => {
      try {
        setIsLoading(true);

        // Vérification rapide du token en local
        const token = getAuthToken();
        if (!token) {
          setIsAuthorized(false);
          navigate("/login");
          return;
        }

        // Vérification de la validité du token côté serveur
        const tokenValid = await isTokenValid();

        if (tokenValid) {
          setIsAuthorized(true);
        } else {
          setIsAuthorized(false);
          logout(); // Nettoyer le localStorage
          navigate("/login");
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setIsAuthorized(false);
        logout();
        navigate("/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthentication();
  }, []); // ← Pas de dépendance sur navigate pour éviter les re-renders

  // Afficher un loader pendant la vérification
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cgreen2 mx-auto"></div>
          <p className="mt-2 text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  // Si autorisé, afficher le contenu
  if (isAuthorized) {
    return <>{children}</>;
  }

  // Si pas autorisé, ne rien afficher (la redirection est en cours)
  return null;
};

export default AuthGuard;
