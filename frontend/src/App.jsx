import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Footer from "../src/components/Footer";
import Navbar from "../src/components/Navbar";
import Buy from "./pages/Buy";
import Contact from "./pages/Contact";
import ContactThankMessage from "./pages/ContactThankMessage";
import PropertyInfo from "./pages/PropertyInfo";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Rent from "./pages/Rent";
import Sell from "./pages/Sell";
import ApplicationForm from "./pages/ApplicationForm";
import ApplicationThankMessage from "./pages/ApplicationThankMessage";
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import MyListings from "./pages/MyListings";
import Listings from "./pages/Listings";
import AdminPanel from "./pages/AdminPanel";
import { useState, useEffect } from "react";
import useAuth from "./hooks/useAuth";
import { apiRequest } from "./services/api";
import NotFound from "./pages/NotFound";
import usePreferences from "./hooks/usePreferences";

function App() {
  const [favorites, setFavorites] = useState([]);

  const {
    auth,
    isLoggedIn,
    isAdmin,
    canManageListings,
    canApply,
    noListingsRedirect,
    logIn,
    logOut: authLogOut,
    updateAuthUser,
  } = useAuth();
  
  const {
    preferences,
    setPreferences,
    isLoading: preferencesLoading,
    error: preferencesError,
    setError: setPreferencesError,
    message: preferencesMessage,
    setMessage: setPreferencesMessage,
    resetPreferences,
  } = usePreferences(isLoggedIn);

  const logOut = () => {
    authLogOut();
    setFavorites([]);
    resetPreferences();
  };

  const syncModeratedProperty = (updatedProperty) => {
    setProperties((currentProperties) => {
      const isPublic =
        updatedProperty.status === "active" &&
        updatedProperty.moderation?.status === "approved";

      const alreadyExists = currentProperties.some(
        (property) => property.id === updatedProperty.id,
      );

      if (!isPublic) {
        return currentProperties.filter(
          (property) => property.id !== updatedProperty.id,
        );
      }

      if (alreadyExists) {
        return currentProperties.map((property) =>
          property.id === updatedProperty.id ? updatedProperty : property,
        );
      }

      return [...currentProperties, updatedProperty];
    });
  };

  const [properties, setProperties] = useState([]);

  // Listings made by other people (you don't see your own listings here)
  const othersProperties = properties.filter(
    (property) => property.owner !== auth?.user?._id,
  );

  useEffect(() => {
    const loadProperties = async () => {
      try {
        const data = await apiRequest("/properties");
        setProperties(data);
      } catch (error) {
        console.error("Failed to load properties:", error);
      }
    };

    loadProperties();
    // Load again whenever someone logs in or out, so new listings show up
  }, [auth?.user?._id]);

  useEffect(() => {
    const loadFavorites = async () => {
      if (!auth?.token) {
        setFavorites([]);
        return;
      }

      try {
        const data = await apiRequest("/favourites");
        const favouriteIds = data
          .filter((item) => item.available && item.property)
          .map((item) => item.property.id);

        setFavorites(favouriteIds);
      } catch (error) {
        console.error("Failed to load favorites:", error);
        setFavorites([]);
      }
    };

    loadFavorites();
  }, [auth?.token]);

  const toggleFavourite = async (propertyId) => {
    if (!isLoggedIn) {
      window.alert("Please log in to manage favorites.");
      return;
    }

    const isFavorite = favorites.includes(propertyId);

    try {
      await apiRequest(`/favourites/${propertyId}`, {
        method: isFavorite ? "DELETE" : "POST",
      });

      setFavorites((currentFavorites) =>
        isFavorite
          ? currentFavorites.filter((id) => id !== propertyId)
          : [...currentFavorites, propertyId],
      );
    } catch (error) {
      window.alert(error.message);
    }
  };

  return (
    <>
      <BrowserRouter>
        <Navbar isLoggedIn={isLoggedIn} user={auth?.user} onLogout={logOut} />
        <Routes>
          <Route
            path="/"
            element={
              <Home
                properties={othersProperties}
                favorites={favorites}
                onToggleFavorite={toggleFavourite}
              />
            }
          />
          <Route
            path="/favorites"
            element={
              isLoggedIn ? (
                <Favorites
                  properties={properties}
                  favorites={favorites}
                  onToggleFavorite={toggleFavourite}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/buy"
            element={
              <Buy
                properties={othersProperties}
                favorites={favorites}
                onToggleFavorite={toggleFavourite}
              />
            }
          />
          <Route
            path="/properties/:id"
            element={
              <PropertyInfo
                favorites={favorites}
                onToggleFavorite={toggleFavourite}
              />
            }
          />
          <Route
            path="/contactthankmessage"
            element={<ContactThankMessage />}
          />
          <Route
            path="/applicationthankmessage"
            element={<ApplicationThankMessage />}
          />
          <Route
            path="/listings"
            element={
              canManageListings ? (
                <Listings />
              ) : (
                <Navigate to={noListingsRedirect} replace />
              )
            }
          />
          <Route
            path="/settings"
            element={
              isLoggedIn ? (
                <Settings
                  preferences={preferences}
                  setPreferences={setPreferences}
                  isLoading={preferencesLoading}
                  error={preferencesError}
                  setError={setPreferencesError}
                  message={preferencesMessage}
                  setMessage={setPreferencesMessage}
                  onAccountDeleted={logOut}
                />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/notifications"
            element={
              isLoggedIn ? (
                <Notifications isAdmin={isAdmin} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/mylistings"
            element={
              canManageListings ? (
                <MyListings onListingUpdated={syncModeratedProperty} />
              ) : (
                <Navigate to={noListingsRedirect} replace />
              )
            }
          />
          <Route
            path="/profile"
            element={
              isLoggedIn ? (
                <Profile onProfileUpdate={updateAuthUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/adminpanel"
            element={
              isAdmin ? (
                <AdminPanel onModerationUpdated={syncModeratedProperty} />
              ) : (
                <Navigate to="/" replace />
              )
            }
          />
          <Route path="/contact" element={<Contact />} />
          <Route
            path="/applicationform"
            element={
              canApply ? (
                <ApplicationForm userRole={auth?.user?.role} />
              ) : (
                <Navigate to={isLoggedIn ? "/sell" : "/login"} replace />
              )
            }
          />
          <Route path="/login" element={<Login onLogin={logIn} />} />
          <Route path="/register" element={<Register onRegister={logIn} />} />
          <Route
            path="/rent"
            element={
              <Rent
                properties={othersProperties}
                favorites={favorites}
                onToggleFavorite={toggleFavourite}
              />
            }
          />
          <Route
            path="/sell"
            element={
              isAdmin ? (
                <Navigate to="/adminpanel" replace />
              ) : canManageListings ? (
                <Navigate to="/listings" replace />
              ) : (
                <Sell />
              )
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer isAdmin={isAdmin} />
      </BrowserRouter>
    </>
  );
}

export default App;
