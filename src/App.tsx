// src/App.tsx

import { useState } from "react";
import { useAuth } from "./hooks/useAuth";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import TodoPage from "./pages/TodoPage";

type Page = "login" | "register";

function App() {
  const { currentUser, loading, login, register, logout } = useAuth();
  const [page, setPage] = useState<Page>("login");

  // Utilisateur connecté → ses todos
  if (currentUser) {
    return (
      <TodoPage
        username={currentUser.username}
        onLogout={logout}
      />
    );
  }

  // Inscription
  if (page === "register") {
    return (
      <RegisterPage
        onRegister={register}
        onGoToLogin={() => setPage("login")}
        loading={loading}
      />
    );
  }

  // Connexion
  return (
    <LoginPage
      onLogin={login}
      onGoToRegister={() => setPage("register")}
      loading={loading}
    />
  );
}

export default App;