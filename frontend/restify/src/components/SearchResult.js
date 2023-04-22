import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from './navbar.jsx';
import '../css/style2.css';
import '../css/tailwind.css'
import qs from 'qs';
// import './style.css';

const SearchResult = () => {
    const [results, setResults] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const [id, setId] = useState(null);

    const location = useLocation();
    const params = useParams();

    const [count, setCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedAmenities, setSelectedAmenities] = useState(searchParams.get('amenities'));

    // useEffect(() => {
    //     const fetchResults = async () => {
    //         setId(params.id);

    //         const queryParams = new URLSearchParams(location.search);
    //         const city = queryParams.get("city");
    //         const beds = queryParams.get("beds");
    //         const baths = queryParams.get("baths");
    //         const max_guests = queryParams.get("max_guests");
    //         const price = queryParams.get("price");

    //         try {
    //             const response = await axios.get('http://127.0.0.1:8000/api/property/search/', {
    //                 params: {
    //                     city: city,
    //                     beds: beds,
    //                     baths: baths,
    //                     max_guests: max_guests,
    //                     price: price,
    //                     page: currentPage,
    //                 }
    //             });

    //             setResults(response.data.results);
    //             setCount(response.data.count);
    //         }
    //         catch (error) {
    //             console.log(params);
    //         }
    //     };

    //     fetchResults();
    // }, [location, params, currentPage, selectedAmenities]);

    useEffect(() => {
        const fetchResults = async () => {
          setId(params.id);
      
          const queryParams = new URLSearchParams(location.search);
          const city = queryParams.get("city");
          const beds = queryParams.get("beds");
          const baths = queryParams.get("baths");
          const max_guests = queryParams.get("max_guests");
          const price = queryParams.get("price");
          const ordering = queryParams.get("ordering");
          const amenities = queryParams.getAll("amenities");      
          try {
            // const response = await axios.get('http://127.0.0.1:8000/api/property/search/', {
            //   params: {
            //     city: city,
            //     beds: beds,
            //     baths: baths,
            //     max_guests: max_guests,
            //     price: price,
            //     ordering: ordering,
            //     amenities: amenitiesQueryParam,
            //     page: currentPage,
            //   }
            // });
            const paramss = {
                city: city,
                beds: beds,
                baths: baths,
                max_guests: max_guests,
                price: price,
                ordering: ordering,
                page: currentPage,
                amenities: amenities,
            };

            const response = await axios.get('http://127.0.0.1:8000/api/property/search/', {
                params: paramss,
                paramsSerializer: params => {
                    return qs.stringify(params, { arrayFormat: 'repeat' })
                },
            });
      
            setResults(response.data.results);
            setCount(response.data.count);
            console.log(response.data.results[0]);
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
        <div className="flex flex-col min-h-screen">
            <Navbar />

            <div className="container">
                <div className="home-container">
                    <div className="left-col">
                        <h1>Recommended for you</h1>
                        {count > 0 ?(
                            results.map((result) => (
                                <PropertyCard
                                    key={result.id}
                                    imageUrl={result.main_image}
                                    address={result.city + ', ' + result.country}
                                    title={result.name}
                                    beds={result.beds}
                                    baths={result.baths}
                                    guests={result.max_guests}
                                    price={result.price}
                                    link={'/property/' + result.id + '/view/'}
                                />
                            ))
                        ) : (
                            <p className="text-center mt-4 font-semibold text-xl">No property matches your search</p>
                        )}
                    </div>
                </div>
            </div>

            {count > 0 ? (<div class="flex justify-center bottom-0 mt-4 pb-1">
                <button
                class="mx-1 px-3 my-9 rounded border bg-[#fbf8f0]"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                >
                Prev
                </button>
                <button
                class="mx-1 px-3 my-9 rounded border bg-[#fbf8f0]"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage * 5 >= count}
                >
                Next
                </button>
            </div>) : (<div></div>)}

            <div className="mt-auto footer">
                <p>Copyright @2023 CSC309</p>
            </div>
        </div>
    );
};

export default SearchResult;
