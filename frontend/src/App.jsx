import { HashRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Results from "./pages/Results";
import Footer from "../src/components/Footer"
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
import ApplicationThankMessage from "./pages/ApplicationThankMessage"
import Favorites from "./pages/Favorites";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import MyListings from "./pages/MyListings";
import SellerDashboard from "./pages/SellerDashboard";
import Listings from "./pages/Listings";
import AdminPanel from "./pages/AdminPanel";
import { properties } from "../data";
import { useState } from "react";

function App() {
    const [favorites, setFavorites] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [propertyListings, setPropertyListings] = useState([]);
    const [moderationStatuses, setModerationStatuses] = useState(() =>
        Object.fromEntries(properties.map((property) => [property.id, property.status || "active"]))
    );

    const moderateProperty = (propertyId, status, reason) => {
        setModerationStatuses((currentStatuses) => ({
            ...currentStatuses,
            [propertyId]: { status, reason, updatedAt: new Date().toISOString() },
        }));
    };

    const deleteListing = (id) => {
        setPropertyListings((prevListings) =>
            prevListings.filter((listing) => listing.id !== id)
        );
    };

    const updateListing = (updatedListing) => { 
        setPropertyListings((prevListings) => 
            prevListings.map((listing) => listing.id === updatedListing.id ? updatedListing : listing ) ); };

    const logIn = () => {
        setIsLoggedIn(true);
    };

    const logOut = () => {
        setIsLoggedIn(false);
    };

    return (
        <>
            <HashRouter>
                <Navbar isLoggedIn={isLoggedIn} onLogout={logOut} />
                <Routes>
                    <Route path="/" element={<Home favorites={favorites} setFavorites={setFavorites} />}
                    />
                    <Route path="/results" element={<Results favorites={favorites} setFavorites={setFavorites} />}
                    />
                    <Route path="/favorites" element={<Favorites favorites={favorites} setFavorites={setFavorites} />}
                    />
                    <Route path="/buy" element={<Buy favorites={favorites} setFavorites={setFavorites} />}
                    />
                    <Route path="/propertyInfo" element={<PropertyInfo favorites={favorites} setFavorites={setFavorites} />}
                    />
                    <Route path="/contactthankmessage" element={<ContactThankMessage />}
                    />
                    <Route path="/sellerdashboard" element={<SellerDashboard propertyListings={propertyListings}deleteListing={deleteListing} updateListing={updateListing}/>}
                    />
                    <Route path="/applicationthankmessage" element={<ApplicationThankMessage />}
                    />
                    <Route path="/listings" element={<Listings propertyListings={propertyListings} setPropertyListings={setPropertyListings} />}
                    />
                    <Route path="/settings" element={<Settings />}
                    />
                    <Route path="/notifications" element={<Notifications />}
                    />
                    <Route path="/mylistings" element={<MyListings propertyListings={propertyListings} deleteListing={deleteListing} updateListing={updateListing}/>}
                    />
                    <Route path="/profile" element={<Profile />}
                    />
                    <Route
                        path="/adminpanel"
                        element={
                            <AdminPanel
                                properties={properties}
                                moderationStatuses={moderationStatuses}
                                onModerate={moderateProperty}
                            />
                        }
                    />
                    <Route path="/contact" element={<Contact />}
                    />
                    <Route path="/applicationform" element={<ApplicationForm />}
                    />
                    <Route path="/login" element={<Login onLogin={logIn} />}
                    />
                    <Route path="/register" element={<Register onRegister={logIn} />}
                    />
                    <Route path="/rent" element={<Rent favorites={favorites} setFavorites={setFavorites} />}
                    />
                    <Route path="/sell" element={<Sell />}
                    />
                </Routes>
                <Footer />
            </HashRouter>
        </>
    );
}

export default App;