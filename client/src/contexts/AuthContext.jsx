import { useState, useEffect, createContext, useContext } from "react";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedUser = window.localStorage.getItem("user");
    if (loggedUser) {
      try {
        const user = JSON.parse(loggedUser);
        setUser(user);
      } catch {
        window.localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = (data) => {
    window.localStorage.setItem("token", data.token);
    window.localStorage.setItem("user", JSON.stringify(data.user));
    setUser(data.user);
    setToken(data.token);
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    window.localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
export { AuthContext };
export default AuthProvider;

export const useAuth = () => useContext(AuthContext);
