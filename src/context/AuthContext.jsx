import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => {
    return JSON.parse(localStorage.getItem("sl_current_user")) || null;
  });

  const [registeredUsers, setRegisteredUsers] = useState(() => {
    return JSON.parse(localStorage.getItem("sl_users")) || [];
  });

  const signup = ({ name, email, password, role }) => {
    const cleanName = name.trim();
    const cleanEmail = email.trim();
    const users = JSON.parse(localStorage.getItem("sl_users")) || [];

    if (
      users.some(
        (u) => u.email.toLowerCase() === cleanEmail.toLowerCase() && u.role === role
      )
    ) {
      return {
        ok: false,
        message: `A ${role} account with this email already exists. Please login.`
      };
    }

    const newUser = {
      id: Date.now(),
      name: cleanName,
      email: cleanEmail,
      password,
      role
    };

    const updatedUsers = [...users, newUser];
    localStorage.setItem("sl_users", JSON.stringify(updatedUsers));
    localStorage.setItem("sl_last_signup", JSON.stringify(newUser));
    setRegisteredUsers(updatedUsers);

    return { ok: true, user: newUser };
  };

  const login = ({ email, password, role }) => {
    const cleanEmail = email.trim();

    if (role === "admin" && cleanEmail === "admin@gmail.com" && password === "admin123") {
      const demoAdmin = { name: "Chief Commissioner", email: cleanEmail, password, role: "admin" };
      localStorage.setItem("sl_current_user", JSON.stringify(demoAdmin));
      localStorage.setItem("sl_last_login", JSON.stringify(demoAdmin));
      setCurrentUser(demoAdmin);
      return { ok: true, user: demoAdmin };
    }

    if (role === "user" && cleanEmail === "fan@gmail.com" && password === "fan123") {
      const demoUser = { name: "Pro Cricket Fan", email: cleanEmail, password, role: "user" };
      localStorage.setItem("sl_current_user", JSON.stringify(demoUser));
      localStorage.setItem("sl_last_login", JSON.stringify(demoUser));
      setCurrentUser(demoUser);
      return { ok: true, user: demoUser };
    }

    const users = JSON.parse(localStorage.getItem("sl_users")) || [];
    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail.toLowerCase() &&
        u.password === password &&
        u.role === role
    );

    if (!matched) {
      return {
        ok: false,
        message: `Invalid ${role} credentials. Check your email, password, or selected role.`
      };
    }

    const sessionUser = {
      name: matched.name,
      email: matched.email,
      password: matched.password,
      role: matched.role
    };

    localStorage.setItem("sl_current_user", JSON.stringify(sessionUser));
    localStorage.setItem("sl_last_login", JSON.stringify(sessionUser));
    setCurrentUser(sessionUser);
    return { ok: true, user: sessionUser };
  };

  const logout = () => {
    localStorage.removeItem("sl_current_user");
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider value={{ currentUser, registeredUsers, signup, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);