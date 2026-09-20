import { BrowserRouter, Routes, Route } from "react-router-dom";
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
import { useEffect, useState } from "react";

// there is no real login system yet, so every visitor just acts as user 1
const userId = 1;

function App() {
    const [favorites, setFavorites] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [propertyListings, setPropertyListings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [moderationStatuses, setModerationStatuses] = useState({});

    const loadProperties = () => {
        fetch("/api/properties")
            .then((res) => res.json())
            .then((data) => {
                setProperties(data);

                setModerationStatuses((currentStatuses) => {
                    const updatedStatuses = { ...currentStatuses };
                    data.forEach((property) => {
                        if (!(property.id in updatedStatuses)) {
                            updatedStatuses[property.id] = property.status || "active";
                        }
                    });
                    return updatedStatuses;
                });
            })
            .catch((error) => console.log(error));
    };

    const loadFavorites = () => {
        fetch(`/api/favourites/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                const favoriteIds = data
                    .filter((favorite) => favorite.available)
                    .map((favorite) => favorite.property.id);
                setFavorites(favoriteIds);
            })
            .catch((error) => console.log(error));
    };

    useEffect(() => {
        loadProperties();
        loadFavorites();
    }, []);

    const toggleFavorite = (propertyId) => {
        if (favorites.includes(propertyId)) {
            fetch(`/api/favourites/${userId}/${propertyId}`, { method: "DELETE" })
                .then(() => {
                    setFavorites(favorites.filter((id) => id !== propertyId));
                })
                .catch((error) => console.log(error));
        } else {
            fetch(`/api/favourites/${userId}/${propertyId}`, { method: "POST" })
                .then(() => {
                    setFavorites([...favorites, propertyId]);
                })
                .catch((error) => console.log(error));
        }
    };

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
            <BrowserRouter>
                <Navbar isLoggedIn={isLoggedIn} onLogout={logOut} />
                <Routes>
                    <Route path="/" element={<Home properties={properties} favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    />
                    <Route path="/results" element={<Results favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    />
                    <Route path="/favorites" element={<Favorites properties={properties} favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    />
                    <Route path="/buy" element={<Buy properties={properties} favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    />
                    <Route path="/propertyInfo" element={<PropertyInfo favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    />
                    <Route path="/contactthankmessage" element={<ContactThankMessage />}
                    />
                    <Route path="/sellerdashboard" element={<SellerDashboard propertyListings={propertyListings}deleteListing={deleteListing} updateListing={updateListing}/>}
                    />
                    <Route path="/applicationthankmessage" element={<ApplicationThankMessage />}
                    />
                    <Route path="/listings" element={<Listings propertyListings={propertyListings} setPropertyListings={setPropertyListings} onListingPublished={loadProperties} />}
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
                    <Route path="/rent" element={<Rent properties={properties} favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    />
                    <Route path="/sell" element={<Sell />}
                    />
                </Routes>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default App;
