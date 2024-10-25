import { createContext, useEffect, useState } from "react";
import axiosInstance from "../../lib/axiosInstance";

export const AuthContext = createContext(null);

export default function AuthProvider({ children }) {
  const [auth, setAuth] = useState({
    authenticate: false,
    user: null,
  });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axiosInstance.get("/auth/check");

        if (response?.data?.success) {
          setAuth({
            authenticate: true,
            user: response?.data?.data.user,
          });
        } else {
          setAuth({
            authenticate: false,
            user: null,
          });
        }
      } catch (err) {
        console.error(err);
        setAuth({
          authenticate: false,
          user: null,
        });
      }
    };

    checkAuth();
  }, [setAuth]);

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}
