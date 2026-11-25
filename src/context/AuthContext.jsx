import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

function readUsersFromStorage() {
  try {
    const parsed = JSON.parse(localStorage.getItem("sl_users"));
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function readCurrentUserFromStorage() {
  try {
    return JSON.parse(localStorage.getItem("sl_current_user")) || null;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => readCurrentUserFromStorage());
  const [registeredUsers, setRegisteredUsers] = useState(() => readUsersFromStorage());

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "sl_users") {
        setRegisteredUsers(readUsersFromStorage());
      }
      if (e.key === "sl_current_user") {
        setCurrentUser(readCurrentUserFromStorage());
      }
    };
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  const signup = ({ name, email, password, role }) => {
    const cleanName = (name || "").trim();
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = password || "";
    const cleanRole = role === "admin" ? "admin" : "user";

    const users = readUsersFromStorage();
    const existingIndex = users.findIndex(
      (u) => u.email.toLowerCase() === cleanEmail && u.role === cleanRole
    );

    let accountRecord;
    let updatedUsers;

    if (existingIndex !== -1) {
      accountRecord = {
        ...users[existingIndex],
        name: cleanName || users[existingIndex].name,
        email: cleanEmail,
        password: cleanPassword,
        role: cleanRole
      };
      updatedUsers = [...users];
      updatedUsers[existingIndex] = accountRecord;
    } else {
      accountRecord = {
        id: Date.now(),
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        role: cleanRole
      };
      updatedUsers = [...users, accountRecord];
    }

    localStorage.setItem("sl_users", JSON.stringify(updatedUsers));
    localStorage.setItem("sl_last_signup", JSON.stringify(accountRecord));
    setRegisteredUsers(updatedUsers);

    return { ok: true, user: accountRecord };
  };

  const login = ({ email, password, role }) => {
    const cleanEmail = (email || "").trim().toLowerCase();
    const cleanPassword = password || "";
    const cleanRole = role === "admin" ? "admin" : "user";

    if (cleanRole === "admin" && cleanEmail === "admin@gmail.com" && cleanPassword === "admin123") {
      const demoAdmin = {
        name: "Chief Commissioner",
        email: cleanEmail,
        password: cleanPassword,
        role: "admin"
      };
      localStorage.setItem("sl_current_user", JSON.stringify(demoAdmin));
      localStorage.setItem("sl_last_login", JSON.stringify(demoAdmin));
      setCurrentUser(demoAdmin);
      return { ok: true, user: demoAdmin };
    }

    if (cleanRole === "user" && cleanEmail === "fan@gmail.com" && cleanPassword === "fan123") {
      const demoUser = {
        name: "Pro Cricket Fan",
        email: cleanEmail,
        password: cleanPassword,
        role: "user"
      };
      localStorage.setItem("sl_current_user", JSON.stringify(demoUser));
      localStorage.setItem("sl_last_login", JSON.stringify(demoUser));
      setCurrentUser(demoUser);
      return { ok: true, user: demoUser };
    }

    const users = readUsersFromStorage();
    setRegisteredUsers(users);

    const matched = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail &&
        u.password === cleanPassword &&
        u.role === cleanRole
    );

    if (!matched) {
      return {
        ok: false,
        message: `Invalid ${cleanRole} credentials. Check your email, password, or selected role.`
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