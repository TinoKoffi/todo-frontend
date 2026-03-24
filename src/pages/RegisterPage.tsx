// src/pages/RegisterPage.tsx

import { useState } from "react";
import { UserPlus, Check, X } from "lucide-react";

type Props = {
  onRegister: (username: string, email: string, password: string) => Promise<string | null>;
  onGoToLogin: () => void;
  loading: boolean;
};

type PasswordRule = {
  label: string;
  test: (p: string) => boolean;
};

const passwordRules: PasswordRule[] = [
  { label: "Au moins 8 caractères", test: (p) => p.length >= 8 },
  { label: "Une lettre majuscule", test: (p) => /[A-Z]/.test(p) },
  { label: "Une lettre minuscule", test: (p) => /[a-z]/.test(p) },
  { label: "Un chiffre", test: (p) => /\d/.test(p) },
];

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const RegisterPage = ({ onRegister, onGoToLogin, loading }: Props) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showRules, setShowRules] = useState(false);

  const allRulesValid = passwordRules.every((r) => r.test(password));
  const emailValid = emailRegex.test(email);
  const passwordsMatch = password === confirmPassword && confirmPassword !== "";

  async function handleSubmit() {
    if (!username || !email || !password || !confirmPassword) {
      setError("Tous les champs sont requis.");
      return;
    }
    if (!emailValid) {
      setError("L'email n'est pas valide.");
      return;
    }
    if (!allRulesValid) {
      setError("Le mot de passe ne respecte pas les règles.");
      return;
    }
    if (!passwordsMatch) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    const err = await onRegister(username, email, password);
    if (err) setError(err);
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm bg-base-300 p-8 rounded-2xl flex flex-col gap-5">

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <UserPlus className="w-10 h-10 text-primary" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold">Inscription</h1>
          <p className="text-sm text-base-content/60">Crée ton compte 🚀</p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="alert alert-error alert-soft text-sm">{error}</div>
        )}

        {/* Formulaire */}
        <div className="flex flex-col gap-3">
          <input
            type="text"
            className="input w-full"
            placeholder="Nom d'utilisateur (min. 3 caractères)"
            value={username}
            onChange={(e) => { setError(null); setUsername(e.target.value); }}
          />

          {/* Email avec indicateur */}
          <div className="relative">
            <input
              type="email"
              className={`input w-full ${email && (emailValid ? "input-success" : "input-error")}`}
              placeholder="Email"
              value={email}
              onChange={(e) => { setError(null); setEmail(e.target.value); }}
            />
            {email && (
              <span className="absolute right-3 top-1/2 -translate-y-1/2">
                {emailValid
                  ? <Check className="w-4 h-4 text-success" />
                  : <X className="w-4 h-4 text-error" />
                }
              </span>
            )}
          </div>

          {/* Mot de passe avec règles */}
          <input
            type="password"
            className={`input w-full ${password && (allRulesValid ? "input-success" : "input-error")}`}
            placeholder="Mot de passe"
            value={password}
            onFocus={() => setShowRules(true)}
            onChange={(e) => { setError(null); setPassword(e.target.value); }}
          />

          {/* Règles du mot de passe */}
          {showRules && (
            <ul className="flex flex-col gap-1 text-xs px-1">
              {passwordRules.map((rule) => (
                <li key={rule.label} className={`flex items-center gap-2 ${rule.test(password) ? "text-success" : "text-base-content/50"}`}>
                  {rule.test(password)
                    ? <Check className="w-3 h-3" />
                    : <X className="w-3 h-3" />
                  }
                  {rule.label}
                </li>
              ))}
            </ul>
          )}

          {/* Confirmation mot de passe */}
          <input
            type="password"
            className={`input w-full ${confirmPassword && (passwordsMatch ? "input-success" : "input-error")}`}
            placeholder="Confirmer le mot de passe"
            value={confirmPassword}
            onChange={(e) => { setError(null); setConfirmPassword(e.target.value); }}
          />

          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? <span className="loading loading-spinner loading-sm" />
              : "Créer mon compte"
            }
          </button>
        </div>

        {/* Lien connexion */}
        <p className="text-sm text-center text-base-content/60">
          Déjà un compte ?{" "}
          <button onClick={onGoToLogin} className="text-primary hover:underline font-medium">
            Se connecter
          </button>
        </p>

      </div>
    </div>
  );
};

export default RegisterPage;