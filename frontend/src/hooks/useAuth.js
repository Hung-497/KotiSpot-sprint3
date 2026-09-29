import { getStoredAuth, saveAuth, clearAuth } from "../utils/authStorage";
import { useState, useEffect } from "react";
import { apiRequest } from "../services/api";


const useAuth = () => {
  const [auth, setAuth] = useState(() => getStoredAuth());

  const isLoggedIn = Boolean(auth?.user && auth?.token);
  const isAdmin = auth?.user?.role === "administrator";

  // Administrators moderate listings but don't sell or own any
  const canManageListings =
    ["seller", "agent"].includes(auth?.user?.role) &&
    Boolean(auth?.user?.verifiedAt);

  const noListingsRedirect = isAdmin ? "/adminpanel" : "/sell";

  // Sellers can still apply to become an agent
  const canApply =
    isLoggedIn && !["agent", "administrator"].includes(auth?.user?.role);

  useEffect(() => {
    const validateStoredAuth = async () => {
      const storedAuth = getStoredAuth();

      if (!storedAuth?.token) {
        return;
      }

      try {
        const data = await apiRequest("/users/me");

        const refreshedAuth = saveAuth(data.user, storedAuth.token);

        setAuth(refreshedAuth);
      } catch {
        clearAuth();
        setAuth(null);
      }
    };

    validateStoredAuth();
  }, []);

  const updateAuthUser = (user) => {
    const storedAuth = getStoredAuth();

    if (!storedAuth?.token) {
      return;
    }

    const updatedAuth = saveAuth(user, storedAuth.token);
    setAuth(updatedAuth);
  };

  const logIn = (user, token) => {
    const storedAuth = saveAuth(user, token);
    setAuth(storedAuth);
  };

  const logOut = () => {
    clearAuth();
    setAuth(null);
  };
  return {
    auth,
    isLoggedIn,
    isAdmin,
    canManageListings,
    canApply,
    noListingsRedirect,
    updateAuthUser,
    logIn,
    logOut,
  };
};

export default useAuth;