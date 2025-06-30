// Utilitaires pour la gestion de l'authentification

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
export const isAuthenticated = (): boolean => {
  const token = getAuthToken();
  const user = getUser();
  return !!(token && user);
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
