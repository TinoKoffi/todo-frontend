// src/pages/LoginPage.tsx

import { useState } from "react";
import { LogIn, Eye, EyeOff } from "lucide-react";

type Props = {
  onLogin: (email: string, password: string) => Promise<string | null>;
  onGoToRegister: () => void;
  loading: boolean;
};

const LoginPage = ({ onLogin, onGoToRegister, loading }: Props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit() {
    if (!email || !password) {
      setError("Tous les champs sont requis.");
      return;
    }
    const err = await onLogin(email, password);
    if (err) setError(err);
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <div className="w-full max-w-sm bg-base-300 p-8 rounded-2xl flex flex-col gap-5">

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <LogIn className="w-10 h-10 text-primary" strokeWidth={1.5} />
          <h1 className="text-2xl font-bold">Connexion</h1>
          <p className="text-sm text-base-content/60">Content de te revoir 👋</p>
        </div>

        {/* Erreur */}
        {error && (
          <div className="alert alert-error alert-soft text-sm">{error}</div>
        )}

        {/* Formulaire */}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            className="input w-full"
            placeholder="Email"
            value={email}
            onChange={(e) => { setError(null); setEmail(e.target.value); }}
          />

          {/* Mot de passe avec œil */}
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              className="input w-full pr-10"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => { setError(null); setPassword(e.target.value); }}
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 hover:text-base-content"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword
                ? <EyeOff className="w-4 h-4" />
                : <Eye className="w-4 h-4" />
              }
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="btn btn-primary w-full"
            disabled={loading}
          >
            {loading
              ? <span className="loading loading-spinner loading-sm" />
              : "Se connecter"
            }
          </button>
        </div>

        {/* Lien inscription */}
        <p className="text-sm text-center text-base-content/60">
          Pas encore de compte ?{" "}
          <button onClick={onGoToRegister} className="text-primary hover:underline font-medium">
            S'inscrire
          </button>
        </p>

      </div>
    </div>
  );
};

export default LoginPage;