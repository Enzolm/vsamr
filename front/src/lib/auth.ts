// Utilitaires pour la gestion de l'authentification
import axios from "axios";
import { config } from "@/config/config";

export interface User {
  id: number;
  email: string;
  fullname: string;
}

// Stocker les données d'authentification
export const setAuthData = (token: string, user: User) => {
  localStorage.setItem("authToken", token);
  localStorage.setItem("user", JSON.stringify(user));
};

// Récupérer le token
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

// Récupérer les données utilisateur
export const getUser = (): User | null => {
  const userStr = localStorage.getItem("user");
  return userStr ? JSON.parse(userStr) : null;
};

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = async (): Promise<boolean> => {
  if (!isAuthenticated()) {
    return false;
  }
  return true;
};

export const isAuthenticatedAdmin = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${config.api.baseUrl}/utilisateur/get/user/${getUser()?.id}`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    const user = response.data;
    console.log("User data:", response.data);
    return user.admin === 1;
  } catch (error) {
    console.error("Error checking admin authentication:", error);
    return false;
  }
};

export const isTokenValid = async (): Promise<boolean> => {
  try {
    const token = getAuthToken();
    if (!token) return false;

    const response = await axios.get(`${config.api.baseUrl}/utilisateur/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    console.log("Token validation response:", response);

    // Mettre à jour les données utilisateur si elles ont changé
    if (response.data.user.valideaccount === 1) {
      console.log("User data from token validation:", response.data.user);
      setAuthData(token, response.data.user);
    }

    return response.data.user.valideaccount === 1;
  } catch (error) {
    console.error("Token validation failed:", error);
    logout();
    return false;
  }
};

export const accountValidation = async (): Promise<boolean> => {
  try {
    const response = await axios.get(`${config.api.baseUrl}/utilisateur/verify-token`, {
      headers: { Authorization: `Bearer ${getAuthToken()}` },
    });
    console.log("Account validation response:", response.data.user.valideaccount);
    return response.data.user.valideaccount === 1;
  } catch (error) {
    console.error("Account validation failed:", error);
    return false;
  }
};

// Déconnecter l'utilisateur
export const logout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("user");
  // Optionnel: rediriger vers la page de connexion
  // window.location.href = "/login";
};

// Configurer axios pour inclure automatiquement le token
export const setupAxiosInterceptors = () => {
  // Vous pouvez importer axios ici et configurer les interceptors
  // pour inclure automatiquement le token dans les headers
};
