import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState("");

  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const setAccessToken = (accessToken) => {
    localStorage.setItem("access_token", accessToken);
    setToken(accessToken);
    console.log("Token set to:", accessToken);
  };

  const clearAccessToken = () => {
    localStorage.removeItem("access_token");
    setToken("");
  };

  return (
    <AuthContext.Provider value={{ token, setAccessToken, clearAccessToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
