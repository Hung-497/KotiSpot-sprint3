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
import Comparison from "./pages/Comparison";
import { useState, useEffect } from "react";
import { getStoredAuth, saveAuth, clearAuth } from "./utils/authStorage";
import { apiRequest } from "./services/api";
import NotFound from "./pages/NotFound";
import useAuth from "./hooks/useAuth";
import useProperties from "./hooks/useProperties";
import useFavorites from "./hooks/useFavorites";
import usePreferences from "./hooks/usePreferences";

function App() {
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

  const { properties, othersProperties, syncModeratedProperty } =
    useProperties(auth?.user?._id);

  const { favorites, toggleFavourite, resetFavorites } = useFavorites(
    auth?.token,
    isLoggedIn,
  );

  const logOut = () => {
    authLogOut();
    resetFavorites();
    resetPreferences();
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
          <Route
            path="/comparison"
            element={
              <Comparison 
              properties={properties}
              />
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