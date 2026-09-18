import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { properties } from "../../data";
const SearchBar = () => {
    const [search, setSearch] = useState('')
    const [filter, setFilter] = useState(false)

    const [location, setLocation] = useState("");
    const [propertyType, setPropertyType] = useState("");
    const [listingType, setListingType] = useState("");
    const [rooms, setRooms] = useState("");
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [minSize, setMinSize] = useState("");
    const [maxSize, setMaxSize] = useState("");

    const navigate = useNavigate();


    const handleSearch = () => {
        const filteredProperties = properties.filter((property) => {
            if (search === "") {
                return true;
            }

            if (
                property.city.toLowerCase().includes(search.toLowerCase()) ||
                property.postalCode.includes(search)
            ) {
                return true;
            }

            return false;
        });

        navigate("/results", {
            state: {
                properties: filteredProperties
            }
        });
    };


    const handleFilterSearch = () => {
        const filteredProperties = properties.filter((property) => {

            if (propertyType !== "" && property.propertySubType !== propertyType) {
                return false;
            }

            if (listingType !== "" && property.listingType !== listingType) {
                return false;
            }

            if (
                location !== "" &&
                !property.city.toLowerCase().includes(location.toLowerCase()) &&
                !property.postalCode.includes(location)
            ) {
                return false;
            }

            if (rooms !== "rooms" && rooms !== "" && property.rooms !== Number(rooms)) {
                return false;
            }

            if (minPrice !== "" && Number(property.price) < Number(minPrice)) {
                return false;
            }

            if (maxPrice !== "" && Number(property.price) > Number(maxPrice)) {
                return false;
            }

            if (minSize !== "" && property.size < Number(minSize)) {
                return false;
            }

            if (maxSize !== "" && property.size > Number(maxSize)) {
                return false;
            }

            return true;
        });

        navigate("/results", {
            state: {
                properties: filteredProperties
            }
        });
    };


    return (<div>
        <h3>Search for a house to buy or rent</h3>
        <div className="searchbar">
            <form >
                <div>
                    <label htmlFor='search'></label>
                    <input id='search' type='text' placeholder="Search for a house"
                        onChange={e => setSearch(e.target.value)}
                        value={search}
                    />
                </div>
                <button type="button" onClick={handleSearch} >
                    Search
                </button>
                <button type="button" className="filter-button"
                    onClick={() => setFilter(!filter)}>
                    Filter
                </button>
                {filter && (
                    <div className="filter-tab">
                        <input
                            type="text"
                            placeholder="Location or postal code"
                            value={location}
                            onChange={e => setLocation(e.target.value)}
                        />
                        <select onChange={e => setPropertyType(e.target.value)}>
                            <option value="">Property type</option>
                            <option value="house">House</option>
                            <option value="apartment">Apartment</option>
                            <option value="studio">Studio</option>
                            <option value="room">Room</option>
                        </select>
                        <select onChange={e => setListingType(e.target.value)}>
                            <option value="" >Buy/Rent</option>
                            <option value="sale">Buy</option>
                            <option value="rent">Rent</option>
                        </select>
                        <select onChange={e => setRooms(e.target.value)}>
                            <option value="rooms">Rooms</option>
                            <option value="1">1 room</option>
                            <option value="2">2 rooms</option>
                            <option value="3">3 rooms</option>
                            <option value="4">4 rooms</option>
                            <option value="5">5 rooms</option>
                        </select>
                        <div>
                            <input type="text"
                                placeholder="minimum price £"
                                onChange={e => setMinPrice(e.target.value)}
                            />
                            <input type="text"
                                placeholder="maximum price £"
                                onChange={e => setMaxPrice(e.target.value)}
                            />
                        </div>
                        <div>
                            <input type="text"
                                placeholder="minimum size m^2"
                                onChange={e => setMinSize(e.target.value)}
                            />
                            <input type="text"
                                placeholder="maximum size m^2"
                                onChange={e => setMaxSize(e.target.value)}
                            />
                        </div>
                        <div>
                            <button type="button" onClick={handleFilterSearch}>Search</button>
                        </div>
                    </div>
                )}
            </form>

        </div>
    </div >
    )
};
export default SearchBar;