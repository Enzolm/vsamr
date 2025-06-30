import { useState } from "react";
import { Link } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import logo from "@/assets/logoclear.png";
import axios from "axios";
import { toast } from "sonner";

// Schémas de validation Zod
const loginSchema = z.object({
  email: z.string().trim().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string().trim().min(1, "Le mot de passe est requis").min(6, "Le mot de passe doit contenir au moins 6 caractères"),
  rememberMe: z.boolean().optional(),
});

const registerSchema = z
  .object({
    firstName: z.string().trim().min(1, "Le prénom est requis").min(2, "Le prénom doit contenir au moins 2 caractères"),
    lastName: z.string().trim().min(1, "Le nom est requis").min(2, "Le nom doit contenir au moins 2 caractères"),
    email: z.string().trim().min(1, "L'email est requis").email("Format d'email invalide"),
    password: z.string().trim().min(1, "Le mot de passe est requis").min(6, "Le mot de passe doit contenir au moins 6 caractères"),
    confirmPassword: z.string().trim().min(1, "La confirmation du mot de passe est requise"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Les mots de passe ne correspondent pas",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type RegisterFormData = z.infer<typeof registerSchema>;

function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Formulaire de connexion
  const loginForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    mode: "onChange", // Validation en temps réel
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  // Formulaire d'inscription
  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange", // Validation en temps réel
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onLoginSubmit = async (data: LoginFormData) => {
    // Cette fonction ne sera appelée que si la validation passe
    console.log("Login attempt:", data);
    try {
      const response = await axios.post("http://localhost:3001/utilisateur/login/user", data);
      console.log("Login successful:", response.data);

      // Stocker le token et les infos utilisateur dans localStorage
      const { token, user } = response.data;
      localStorage.setItem("authToken", token);
      localStorage.setItem("user", JSON.stringify(user));

      toast.success("Connexion réussie.");

      // Optionnel: rediriger vers la page d'accueil
      // window.location.href = "/";
    } catch (error) {
      console.error("Error during login:", error);
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          toast.error("Email ou mot de passe incorrect.");
        } else if (error.response?.status === 409) {
          toast.error("Cet email est déjà utilisé.");
        } else {
          toast.error("Une erreur est survenue lors de la connexion.");
        }
      } else {
        toast.error("Une erreur réseau est survenue.");
      }
    }
  };

  const onRegisterSubmit = async (data: RegisterFormData) => {
    // Cette fonction ne sera appelée que si la validation passe
    console.log("Register :", data);
    try {
      const response = await axios.post("http://localhost:3001/utilisateur/create/user", data);
      console.log("Registration successful:", response.data);

      // Stocker le token et les infos utilisateur dans localStorage (auto-login après inscription)
      const { token, user } = response.data;
      if (token && user) {
        localStorage.setItem("authToken", token);
        localStorage.setItem("user", JSON.stringify(user));
      }

      toast.success("Compte créé avec succès ! Vous êtes maintenant connecté.");

      // Optionnel: rediriger vers la page d'accueil
      // window.location.href = "/";
    } catch (error) {
      console.error("Error during registration:", error);
      if (axios.isAxiosError(error) && error.response?.status === 409) {
        toast.error("Cet email est déjà utilisé.");
      } else {
        toast.error("Une erreur est survenue lors de la création du compte.");
      }
    }
  };

  const switchToMode = (mode: boolean) => {
    setIsLogin(mode);
    // Reset des formulaires lors du changement de mode
    if (mode) {
      registerForm.reset();
    } else {
      loginForm.reset();
    }
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
            <h2 className="text-3xl font-bold text-gray-900">{isLogin ? "Connexion" : "Créer un compte"}</h2>
            <p className="mt-2 text-sm text-gray-600">{isLogin ? "Accédez à votre espace personnel" : "Rejoignez la communauté de Villeneuve sur Auvers"}</p>
          </div>
        </div>

        {/* Switch Mode */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all duration-300 ease-in-out transform">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button type="button" onClick={() => switchToMode(true)} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${isLogin ? "bg-white text-cgreen2 shadow-sm transform scale-105" : "text-gray-500 hover:text-gray-700"}`}>
              Connexion
            </button>
            <button type="button" onClick={() => switchToMode(false)} className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 ${!isLogin ? "bg-white text-cgreen2 shadow-sm transform scale-105" : "text-gray-500 hover:text-gray-700"}`}>
              Inscription
            </button>
          </div>

          {isLogin ? (
            /* Formulaire de connexion */
            <form className="space-y-6" onSubmit={loginForm.handleSubmit(onLoginSubmit)}>
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="email" type="email" autoComplete="email" {...loginForm.register("email")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${loginForm.formState.errors.email ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="votre@email.com" />
                  {loginForm.formState.errors.email && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{loginForm.formState.errors.email.message}</div>}
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="password" type={showPassword ? "text" : "password"} autoComplete="current-password" {...loginForm.register("password")} className={`block w-full pl-10 pr-12 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${loginForm.formState.errors.password ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="••••••••" />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center z-10" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </button>
                  {loginForm.formState.errors.password && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{loginForm.formState.errors.password.message}</div>}
                </div>
              </div>

              {/* Se souvenir de moi */}
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input id="remember-me" type="checkbox" {...loginForm.register("rememberMe")} className="h-4 w-4 text-cgreen2 focus:ring-cgreen2 border-gray-300 rounded" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Se souvenir de moi
                  </label>
                </div>
                <div className="text-sm">
                  <Link to="/forgot-password" className="font-medium text-cgreen2 hover:text-cgreen3 transition-colors">
                    Mot de passe oublié ?
                  </Link>
                </div>
              </div>

              {/* Bouton de connexion */}
              <div>
                <button type="submit" disabled={!loginForm.formState.isValid || loginForm.formState.isSubmitting} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cgreen2 hover:bg-cgreen3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgreen2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg">
                  <span className="transition-all duration-200">{loginForm.formState.isSubmitting ? "Connexion..." : "Se connecter"}</span>
                </button>
              </div>
            </form>
          ) : (
            /* Formulaire d'inscription */
            <form className="space-y-6" onSubmit={registerForm.handleSubmit(onRegisterSubmit)}>
              {/* Prénom et Nom */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                    Prénom
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="firstName" type="text" {...registerForm.register("firstName")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${registerForm.formState.errors.firstName ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="Votre prénom" />
                    {registerForm.formState.errors.firstName && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{registerForm.formState.errors.firstName.message}</div>}
                  </div>
                </div>
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                    Nom
                  </label>
                  <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input id="lastName" type="text" {...registerForm.register("lastName")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${registerForm.formState.errors.lastName ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="Votre nom" />
                    {registerForm.formState.errors.lastName && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{registerForm.formState.errors.lastName.message}</div>}
                  </div>
                </div>
              </div>

              {/* Email */}
              <div>
                <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse email
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="register-email" type="email" autoComplete="email" {...registerForm.register("email")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${registerForm.formState.errors.email ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="votre@email.com" />
                  {registerForm.formState.errors.email && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{registerForm.formState.errors.email.message}</div>}
                </div>
              </div>

              {/* Mot de passe */}
              <div>
                <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                  Mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="register-password" type={showPassword ? "text" : "password"} autoComplete="new-password" {...registerForm.register("password")} className={`block w-full pl-10 pr-12 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${registerForm.formState.errors.password ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="••••••••" />
                  <button type="button" className="absolute inset-y-0 right-0 pr-3 flex items-center z-10" onClick={() => setShowPassword(!showPassword)}>
                    {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />}
                  </button>
                  {registerForm.formState.errors.password && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap max-w-xs break-words pointer-events-none">{registerForm.formState.errors.password.message}</div>}
                </div>
              </div>

              {/* Confirmation mot de passe */}
              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirmer le mot de passe
                </label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="confirmPassword" type={showPassword ? "text" : "password"} autoComplete="new-password" {...registerForm.register("confirmPassword")} className={`block w-full pl-10 pr-3 py-3 border-2 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-colors duration-200 ${registerForm.formState.errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300 bg-gray-50 focus:bg-white"}`} placeholder="••••••••" />
                  {registerForm.formState.errors.confirmPassword && <div className="absolute top-full left-0 mt-1 bg-red-600 text-white text-xs rounded px-2 py-1 shadow-lg opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity duration-200 z-20 whitespace-nowrap pointer-events-none">{registerForm.formState.errors.confirmPassword.message}</div>}
                </div>
              </div>

              {/* Bouton d'inscription */}
              <div>
                <button type="submit" disabled={!registerForm.formState.isValid || registerForm.formState.isSubmitting} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cgreen2 hover:bg-cgreen3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgreen2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none disabled:shadow-lg">
                  <span className="transition-all duration-200">{registerForm.formState.isSubmitting ? "Création..." : "Créer le compte"}</span>
                </button>
              </div>
            </form>
          )}

          {/* Toggle connexion/inscription */}
          <div className="text-center mt-6">
            <button type="button" onClick={() => switchToMode(!isLogin)} className="text-sm text-gray-600 hover:text-cgreen2 transition-all duration-200">
              <span className="transition-all duration-300 ease-in-out">
                {isLogin ? (
                  <>
                    Pas encore de compte ? <span className="font-medium text-cgreen2 hover:text-cgreen3">Créer un compte</span>
                  </>
                ) : (
                  <>
                    Déjà un compte ? <span className="font-medium text-cgreen2 hover:text-cgreen3">Se connecter</span>
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Retour à l'accueil */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center text-sm text-gray-600 hover:text-cgreen2 transition-colors">
            ← Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
