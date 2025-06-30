import { Link } from "react-router";
import { Eye, EyeOff, Mail, Lock, User } from "lucide-react";
import logo from "@/assets/logoclear.png";

function LoginStable() {
  let isLoginMode = true;
  let showPassword = false;

  const togglePasswordVisibility = () => {
    showPassword = !showPassword;

    // Get all password inputs in the currently visible form
    const visibleForm = document.querySelector('[data-form]:not([style*="none"])');
    if (visibleForm) {
      const passwordInputs = visibleForm.querySelectorAll('input[name="password"], input[name="confirmPassword"]');
      passwordInputs.forEach((input: Element) => {
        const htmlInput = input as HTMLInputElement;
        htmlInput.type = showPassword ? "text" : "password";
      });

      // Update eye icons in the visible form
      const eyeButtons = visibleForm.querySelectorAll("[data-toggle-password]");
      eyeButtons.forEach((button) => {
        const eyeIcon = button.querySelector("[data-eye-open]");
        const eyeOffIcon = button.querySelector("[data-eye-closed]");
        if (eyeIcon && eyeOffIcon) {
          if (showPassword) {
            (eyeIcon as HTMLElement).style.display = "none";
            (eyeOffIcon as HTMLElement).style.display = "block";
          } else {
            (eyeIcon as HTMLElement).style.display = "block";
            (eyeOffIcon as HTMLElement).style.display = "none";
          }
        }
      });
    }
  };

  const switchMode = (loginMode: boolean) => {
    isLoginMode = loginMode;

    // Update UI
    const loginTab = document.querySelector('[data-tab="login"]');
    const registerTab = document.querySelector('[data-tab="register"]');
    const loginForm = document.querySelector('[data-form="login"]');
    const registerForm = document.querySelector('[data-form="register"]');
    const title = document.querySelector("[data-title]");
    const subtitle = document.querySelector("[data-subtitle]");

    if (loginTab && registerTab && loginForm && registerForm && title && subtitle) {
      if (loginMode) {
        loginTab.className = "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 bg-white text-cgreen2 shadow-sm transform scale-105";
        registerTab.className = "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 text-gray-500 hover:text-gray-700";
        (loginForm as HTMLElement).style.display = "block";
        (registerForm as HTMLElement).style.display = "none";
        title.textContent = "Connexion";
        subtitle.textContent = "Accédez à votre espace personnel";

        // Update toggle text
        const toggleText = document.querySelector("#toggle-text");
        if (toggleText) {
          toggleText.innerHTML = 'Pas encore de compte ? <span class="font-medium text-cgreen2 hover:text-cgreen3">Créer un compte</span>';
        }
      } else {
        loginTab.className = "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 text-gray-500 hover:text-gray-700";
        registerTab.className = "flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 bg-white text-cgreen2 shadow-sm transform scale-105";
        (loginForm as HTMLElement).style.display = "none";
        (registerForm as HTMLElement).style.display = "block";
        title.textContent = "Créer un compte";
        subtitle.textContent = "Rejoignez la communauté de Villeneuve sur Auvers";

        // Update toggle text
        const toggleText = document.querySelector("#toggle-text");
        if (toggleText) {
          toggleText.innerHTML = 'Déjà un compte ? <span class="font-medium text-cgreen2 hover:text-cgreen3">Se connecter</span>';
        }
      }
    }

    // Clear form errors and reset styling
    const allInputs = document.querySelectorAll("input[name]");
    allInputs.forEach((input) => {
      input.className = input.className.replace("border-red-500 bg-red-50", "border-gray-300 bg-gray-50");

      // Clear error message in reserved space
      const errorSpace = input.parentNode?.parentNode?.querySelector("[data-error-space]");
      if (errorSpace) {
        errorSpace.textContent = "";
      }
    });

    // Reset password visibility for the new form
    showPassword = false;
    const passwordInputs = document.querySelectorAll('input[name="password"], input[name="confirmPassword"]');
    passwordInputs.forEach((input: Element) => {
      (input as HTMLInputElement).type = "password";
    });

    // Reset eye icons
    const eyeButtons = document.querySelectorAll("[data-toggle-password]");
    eyeButtons.forEach((button) => {
      const eyeIcon = button.querySelector("[data-eye-open]");
      const eyeOffIcon = button.querySelector("[data-eye-closed]");
      if (eyeIcon && eyeOffIcon) {
        (eyeIcon as HTMLElement).style.display = "block";
        (eyeOffIcon as HTMLElement).style.display = "none";
      }
    });

    // Reset form fields for non-active mode
    if (loginMode) {
      const registerInputs = document.querySelectorAll('[data-form="register"] input');
      registerInputs.forEach((input: Element) => {
        (input as HTMLInputElement).value = "";
      });
    } else {
      const loginInputs = document.querySelectorAll('[data-form="login"] input[type="email"], [data-form="login"] input[type="password"]');
      loginInputs.forEach((input: Element) => {
        (input as HTMLInputElement).value = "";
      });
    }
  };

  const validateForm = (formData: FormData, isLogin: boolean) => {
    const errors: Record<string, string> = {};

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email || !email.includes("@")) {
      errors.email = "Email invalide";
    }

    if (!password) {
      errors.password = "Mot de passe requis";
    } else if (!isLogin && password.length < 6) {
      errors.password = "Le mot de passe doit contenir au moins 6 caractères";
    }

    if (!isLogin) {
      const firstName = formData.get("firstName") as string;
      const lastName = formData.get("lastName") as string;
      const confirmPassword = formData.get("confirmPassword") as string;

      if (!firstName || firstName.length < 2) {
        errors.firstName = "Le prénom doit contenir au moins";
      }

      if (!lastName || lastName.length < 2) {
        errors.lastName = "Le nom doit contenir au moins 2 caractères";
      }

      if (password !== confirmPassword) {
        errors.confirmPassword = "Les mots de passe ne correspondent pas";
      }
    }

    return errors;
  };

  const displayErrors = (errors: Record<string, string>) => {
    // Clear previous errors and reset styling
    const allInputs = document.querySelectorAll("input[name]");
    allInputs.forEach((input) => {
      input.className = input.className.replace("border-red-500 bg-red-50", "border-gray-300 bg-gray-50");

      // Clear error message in reserved space
      const errorSpace = input.parentNode?.parentNode?.querySelector("[data-error-space]");
      if (errorSpace) {
        errorSpace.textContent = "";
      }
    });

    // Display new errors
    Object.entries(errors).forEach(([field, message]) => {
      const input = document.querySelector(`input[name="${field}"]`);
      if (input) {
        // Add error styling with red border
        input.className = input.className.replace("border-gray-300 bg-gray-50", "border-red-500 bg-red-50");

        // Add error message to reserved space
        const errorSpace = input.parentNode?.parentNode?.querySelector("[data-error-space]");
        if (errorSpace) {
          errorSpace.textContent = message;
          errorSpace.className = "h-5 mt-1 text-xs text-red-600 flex items-start";
        }
      }
    });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    // Debug: voir quel formulaire est soumis
    console.log("Form submitted:", form.getAttribute("data-form"));
    console.log("Form data:", Object.fromEntries(formData.entries()));

    const isLoginForm = form.getAttribute("data-form") === "login";

    const errors = validateForm(formData, isLoginForm);

    if (Object.keys(errors).length > 0) {
      displayErrors(errors);
      return;
    }

    // Clear any existing errors when form is valid
    const allInputs = form.querySelectorAll("input[name]");
    allInputs.forEach((input) => {
      input.className = input.className.replace("border-red-500 bg-red-50", "border-gray-300 bg-gray-50");

      // Clear error message in reserved space
      const errorSpace = input.parentNode?.parentNode?.querySelector("[data-error-space]");
      if (errorSpace) {
        errorSpace.textContent = "";
      }
    });

    if (isLoginForm) {
      console.log("=== LOGIN ATTEMPT ===");
      console.log({
        email: formData.get("email"),
        password: formData.get("password"),
        rememberMe: formData.get("rememberMe") === "on",
      });
    } else {
      console.log("=== REGISTER ATTEMPT ===");
      console.log({
        firstName: formData.get("firstName"),
        lastName: formData.get("lastName"),
        email: formData.get("email"),
        password: formData.get("password"),
      });
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
            <h2 data-title className="text-3xl font-bold text-gray-900">
              Connexion
            </h2>
            <p data-subtitle className="mt-2 text-sm text-gray-600">
              Accédez à votre espace personnel
            </p>
          </div>
        </div>

        {/* Switch Mode */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100 transition-all duration-300 ease-in-out transform">
          <div className="flex bg-gray-100 rounded-xl p-1 mb-6">
            <button type="button" data-tab="login" onClick={() => switchMode(true)} className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 bg-white text-cgreen2 shadow-sm transform scale-105">
              Connexion
            </button>
            <button type="button" data-tab="register" onClick={() => switchMode(false)} className="flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all duration-300 text-gray-500 hover:text-gray-700">
              Inscription
            </button>
          </div>

          {/* Formulaire de connexion */}
          <form data-form="login" className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="login-email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input id="login-email" name="email" type="email" autoComplete="email" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" placeholder="votre@email.com" />
              </div>
              {/* Espace réservé pour le message d'erreur */}
              <div data-error-space className="h-5 mt-1"></div>
            </div>

            <div>
              <label htmlFor="login-password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="login-password" name="password" type="password" autoComplete="current-password" className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" placeholder="••••••••" />
                <button type="button" data-toggle-password className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={togglePasswordVisibility}>
                  <Eye data-eye-open className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  <EyeOff data-eye-closed className="h-5 w-5 text-gray-400 hover:text-gray-600" style={{ display: "none" }} />
                </button>
              </div>
              {/* Espace réservé pour le message d'erreur */}
              <div data-error-space className="h-5 mt-1"></div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input id="remember-me" name="rememberMe" type="checkbox" className="h-4 w-4 text-cgreen2 focus:ring-cgreen2 border-gray-300 rounded" />
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

            <button type="submit" className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cgreen2 hover:bg-cgreen3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgreen2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Se connecter
            </button>
          </form>

          {/* Formulaire d'inscription */}
          <form data-form="register" className="space-y-6" style={{ display: "none" }} onSubmit={handleSubmit}>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  Prénom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="firstName" name="firstName" type="text" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" placeholder="Votre prénom" />
                </div>
                {/* Espace réservé pour le message d'erreur */}
                <div data-error-space className="h-5 mt-1"></div>
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  Nom
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input id="lastName" name="lastName" type="text" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" placeholder="Votre nom" />
                </div>
                {/* Espace réservé pour le message d'erreur */}
                <div data-error-space className="h-5 mt-1"></div>
              </div>
            </div>

            <div>
              <label htmlFor="register-email" className="block text-sm font-medium text-gray-700 mb-2">
                Adresse email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input id="register-email" name="email" type="email" autoComplete="email" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" placeholder="votre@email.com" />
              </div>
              {/* Espace réservé pour le message d'erreur */}
              <div data-error-space className="h-5 mt-1"></div>
            </div>

            <div>
              <label htmlFor="register-password" className="block text-sm font-medium text-gray-700 mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="register-password" name="password" type="password" autoComplete="new-password" className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" placeholder="••••••••" />
                <button type="button" data-toggle-password className="absolute inset-y-0 right-0 pr-3 flex items-center" onClick={togglePasswordVisibility}>
                  <Eye data-eye-open className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  <EyeOff data-eye-closed className="h-5 w-5 text-gray-400 hover:text-gray-600" style={{ display: "none" }} />
                </button>
              </div>
              {/* Espace réservé pour le message d'erreur */}
              <div data-error-space className="h-5 mt-1"></div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="confirmPassword" name="confirmPassword" type="password" autoComplete="new-password" className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cgreen2 focus:border-transparent transition-all duration-200 bg-gray-50 focus:bg-white" placeholder="••••••••" />
              </div>
              {/* Espace réservé pour le message d'erreur */}
              <div data-error-space className="h-5 mt-1"></div>
            </div>

            <button type="submit" onClick={() => console.log("Register button clicked!")} className="w-full py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-cgreen2 hover:bg-cgreen3 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cgreen2 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Créer le compte
            </button>
          </form>

          {/* Toggle text */}
          <div className="text-center mt-6">
            <button type="button" onClick={() => switchMode(!isLoginMode)} className="text-sm text-gray-600 hover:text-cgreen2 transition-all duration-200">
              <span id="toggle-text">
                Pas encore de compte ? <span className="font-medium text-cgreen2 hover:text-cgreen3">Créer un compte</span>
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

export default LoginStable;
