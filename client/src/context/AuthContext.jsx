import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("villageUser");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    // 1. If the data has a 'token', save it separately (Standard practice)
    if (userData.token) {
      localStorage.setItem("token", userData.token);
    }

    // 2. Un-wrap the user object if it's nested (e.g. { user: {...}, token: ... })
    // This fixes the issue where Profile Update might pass a wrapped object
    const userObj = userData.user ? userData.user : userData;

    setUser(userObj);
    localStorage.setItem("villageUser", JSON.stringify(userObj));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("villageUser");
    localStorage.removeItem("token"); // Clean up token on logout
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};