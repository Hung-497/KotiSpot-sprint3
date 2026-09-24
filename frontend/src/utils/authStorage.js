const AUTH_STORAGE_KEY = "kotispotAuth";

const getStoredAuth = () => {
  try {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

    return storedAuth ? JSON.parse(storedAuth) : null;
  } catch {
    return null;
  }
};

const saveAuth = (user, token) => {
  const auth = {
    user,
    token,
  };

  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));

  return auth;
};

const clearAuth = () => {
  localStorage.removeItem(AUTH_STORAGE_KEY);
};

const getStoredToken = () => {
  return getStoredAuth()?.token ?? null;
};

export {
  getStoredAuth,
  saveAuth,
  clearAuth,
  getStoredToken,
};