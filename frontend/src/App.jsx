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
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";

// there is no real login system yet, so every visitor just acts as user 1
const userId = 1;

// the form's fields already match the backend's, so most of a listing can be
// sent as is - the backend ignores fields it doesn't know and converts number
// strings on its own. the only thing that needs building here is rentalDetails,
// since the form keeps those fields flat but the backend nests them
const buildPropertyUpdate = (listing) => {
    const update = { ...listing };

    if (listing.listingType === "forRent") {
        update.listingType = "rent";

        const rentalDetails = {
            availableFrom: listing.availableFrom,
            minimumRentalPeriod: parseInt(listing.minimumRentalPeriod, 10) || 1
        };

        if (listing.deposit !== "") {
            rentalDetails.deposit = Number(listing.deposit);
        }

        if (listing.additionalCosts && listing.additionalCosts.trim() !== "") {
            rentalDetails.additionalCosts = listing.additionalCosts;
        }

        update.rentalDetails = rentalDetails;
    } else {
        update.listingType = "sale";
    }

    return update;
};

function App() {
    const [favorites, setFavorites] = useState([]);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [propertyListings, setPropertyListings] = useState([]);
    const [properties, setProperties] = useState([]);
    const [moderationStatuses, setModerationStatuses] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const loadProperties = async () => {
        try {
            const res = await fetch("/api/properties");
            if (!res.ok) {
                throw new Error("Failed to load properties.");
            }
            const data = await res.json();
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
        } catch (error) {
            console.error("Error loading properties:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const loadFavorites = async () => {
        try {
            const res = await fetch(`/api/favourites/${userId}`);
            if (!res.ok) {
                throw new Error("Failed to load your favourites.");
            }
            const data = await res.json();
            const favoriteIds = data
                .filter((favorite) => favorite.available)
                .map((favorite) => favorite.property.id);
            setFavorites(favoriteIds);
        } catch (error) {
            console.error("Error loading favourites:", error);
            setError(error.message);
        }
    };

    useEffect(() => {
        const loadInitialData = async () => {
            await Promise.all([loadProperties(), loadFavorites()]);
        };
        loadInitialData();
    }, []);

    const toggleFavorite = async (propertyId) => {
        const isFavorite = favorites.includes(propertyId);

        try {
            const res = await fetch(`/api/favourites/${userId}/${propertyId}`, {
                method: isFavorite ? "DELETE" : "POST",
            });
            if (!res.ok) {
                throw new Error("Failed to update your favourites.");
            }
            // only change the heart once the server has saved it
            setFavorites((currentFavorites) =>
                isFavorite
                    ? currentFavorites.filter((id) => id !== propertyId)
                    : [...currentFavorites, propertyId]
            );
        } catch (error) {
            console.error("Error updating favourite:", error);
            setError(error.message);
        }
    };

    const moderateProperty = (propertyId, status, reason) => {
        setModerationStatuses((currentStatuses) => ({
            ...currentStatuses,
            [propertyId]: { status, reason, updatedAt: new Date().toISOString() },
        }));
    };

    // listings that failed to publish keep their temporary Date.now() number id,
    // so they only exist here and there is nothing to change on the server
    const isSavedOnServer = (id) => typeof id === "string";

    const deleteListing = async (id) => {
        const previousListings = propertyListings;
        setPropertyListings((prevListings) =>
            prevListings.filter((listing) => listing.id !== id)
        );

        if (!isSavedOnServer(id)) {
            return;
        }

        try {
            const res = await fetch(`/api/properties/${id}`, { method: "DELETE" });
            if (!res.ok) {
                throw new Error("Failed to delete the listing.");
            }
            loadProperties();
        } catch (error) {
            console.error("Error deleting listing:", error);
            setPropertyListings(previousListings); // put the listing back
            setError(error.message);
        }
    };

    const updateListing = async (updatedListing) => {
        const previousListings = propertyListings;
        setPropertyListings((prevListings) =>
            prevListings.map((listing) => listing.id === updatedListing.id ? updatedListing : listing ) );

        if (!isSavedOnServer(updatedListing.id)) {
            return;
        }

        try {
            const res = await fetch(`/api/properties/${updatedListing.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(buildPropertyUpdate(updatedListing)),
            });
            if (!res.ok) {
                throw new Error("Failed to update the listing.");
            }
            loadProperties();
        } catch (error) {
            console.error("Error updating listing:", error);
            setPropertyListings(previousListings); // undo the local edit
            setError(error.message);
        }
    };

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
                {loading && (
                    <p role="status" className="bg-[#eef6f2] px-6 py-3 text-center text-sm text-[#17634f]">
                        Loading properties...
                    </p>
                )}
                {error && (
                    <div role="alert" className="flex items-center justify-center gap-4 bg-red-50 px-6 py-3 text-sm text-red-700">
                        <span>{error}</span>
                        <button type="button" onClick={() => setError("")} className="font-medium underline">
                            Dismiss
                        </button>
                    </div>
                )}
                <Routes>
                    <Route path="/" element={<Home properties={properties} favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    />
                    <Route path="/results/:keyword" element={<Results favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    />
                    <Route path="/favorites" element={<Favorites properties={properties} favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    />
                    <Route path="/buy" element={<Buy properties={properties} favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    />
                    <Route path="/properties/:id" element={<PropertyInfo favorites={favorites} onToggleFavorite={toggleFavorite} />}
                    />
                    <Route path="/contactthankmessage" element={<ContactThankMessage />}
                    />
                    <Route path="/sellerdashboard" element={<SellerDashboard propertyListings={propertyListings}deleteListing={deleteListing} updateListing={updateListing}/>}
                    />
                    <Route path="/applicationthankmessage" element={<ApplicationThankMessage />}
                    />
                    <Route path="/listings" element={<Listings setPropertyListings={setPropertyListings} onListingPublished={loadProperties} />}
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
                    <Route path="*" element={<NotFound />}
                    />
                </Routes>
                <Footer />
            </BrowserRouter>
        </>
    );
}

export default App;
