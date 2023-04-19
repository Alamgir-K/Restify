import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/NavBar';
import './style.css';

const SearchResult = () => {
    const [results, setResults] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [id, setId] = useState(null);

    const location = useLocation();
    const params = useParams();

    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAmenities, setSelectedAmenities] = useState(searchParams.get('amenities'));

    useEffect(() => {
        const fetchResults = async () => {
            setId(params.id);

            const queryParams = new URLSearchParams(location.search);
            const city = queryParams.get("city");
            const beds = queryParams.get("beds");
            const baths = queryParams.get("baths");
            const max_guests = queryParams.get("max_guests");
            const price = queryParams.get("price");

            // const axiosParams = new URLSearchParams({
            //     city: city,
            //     beds: beds,
            //     baths: baths,
            //     max_guests: max_guests,
            //     price: price,
            //     page: currentPage,
            // });

            // setSelectedAmenities.forEach((amenity) => {
            //     axiosParams.append("amenities", amenity);
            // });

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/property/search/', {
                    // params: axiosParams,
                    params: {
                        city: city,
                        beds: beds,
                        baths: baths,
                        max_guests: max_guests,
                        price: price,
                        page: currentPage,
                    }
                });

                setResults(response.data.results);
                setCount(response.data.count);
            }
            catch (error) {
                console.log(params);
            }
        };

        fetchResults();
    }, [location, params, currentPage, selectedAmenities]);

    const handlePageChange = (newPage) => {
        setCurrentPage(newPage);
    };

    const toggleAmenity = (amenity) => {
        setSelectedAmenities((prevSelectedAmenities) => {
            if (prevSelectedAmenities.includes(amenity)) {
                return prevSelectedAmenities.filter((item) => item !== amenity);
            } else {
                return [...prevSelectedAmenities, amenity];
            }
        });
        setSearchParams({...searchParams, amenities: selectedAmenities})
    };

    const PropertyCard = ({
        imageUrl,
        address,
        title,
        beds,
        baths,
        guests,
        price,
        link,
    }) => {
        return (
            <div className="listings">
                <div className="pics">
                    <a href={link}>
                        <img src={imageUrl} alt="Property" />
                    </a>
                </div>
                <div className="info">
                    <p>{address}</p>
                    <h3>{title}</h3>
                    <p>
                        {beds} Bedrooms / {baths} Bathrooms
                    </p>
                    <div className="price">
                        <p>{guests} guests</p>
                        <h4>${price} / night</h4>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div>
            <Navbar />

            <div className="container">
                <div className="home-container">
                    <div className="left-col">
                        <h1>Recommended for you</h1>
                        {results.map((result) => (
                            <PropertyCard
                                key={result.id}
                                imageUrl={result.main_image}
                                address={result.city + ', ' + result.country}
                                title={result.name}
                                beds={result.beds}
                                baths={result.baths}
                                guests={result.max_guests}
                                price={result.price}
                                link={'www.google.com'}
                            />
                        ))}
                    </div>

                    <div className="right-col">
                        <div className="filter">
                            <h2>Select Filters</h2>
                            <h3>Amenities</h3>
                            <div className="filter">
                                {/* <input type="checkbox" name="wifi" value="wifi" checked={selectedAmenities.includes("wifi")} onChange={() => toggleAmenity("wifi")}/> */}
                                <p>Wifi</p>
                            </div>

                            <div className="filter">
                                {/* <input type="checkbox" name="tv" value="tv" checked={selectedAmenities.includes("tv")} onChange={() => toggleAmenity("tv")}/> */}
                                <p>TV</p>
                            </div>

                            <div className="filter">
                                {/* <input type="checkbox" name="kitchen" value="kitchen" checked={selectedAmenities.includes("kitchen")} onChange={() => toggleAmenity("kitchen")}/> */}
                                <p>Kitchen</p>
                            </div>

                            <div className="filter">
                                {/* <input type="checkbox" name="pool" value="pool" checked={selectedAmenities.includes("pool")} onChange={() => toggleAmenity("pool")}/> */}
                                <p>Pool</p>
                            </div>

                            <div className="filter">
                                {/* <input type="checkbox" name="air_conditioning" value="air_conditioning" checked={selectedAmenities.includes("air_conditioning")} onChange={() => toggleAmenity("air_conditioning")}/> */}
                                <p>Air Conditioning</p>
                            </div>

                            <div className="filter">
                                {/* <input type="checkbox" name="gym" value="gym" checked={selectedAmenities.includes("gym")} onChange={() => toggleAmenity("gym")}/> */}
                                <p>Gym</p>
                            </div>

                            <div className="filter">
                                {/* <input type="checkbox" name="parking" value="parking" checked={selectedAmenities.includes("parking")} onChange={() => toggleAmenity("parking")}/> */}
                                <p>Parking</p>
                            </div>

                            <div className="filter">
                                {/* <input type="checkbox" name="balcony" value="balcony" checked={selectedAmenities.includes("balcony")} onChange={() => toggleAmenity("balcony")}/> */}
                                <p>Balcony</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="flex justify-center mt-4">
                <button
                class="mx-1 px-3 py-1 rounded border"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                >
                Prev
                </button>
                <button
                class="mx-1 px-3 py-1 rounded border"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * 5 >= count}
                >
                Next
                </button>
            </div>
        </div>
    );
};

export default SearchResult;
