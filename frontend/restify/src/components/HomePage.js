import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../css/style2.css';
import '../css/tailwind.css'
import 'tailwindcss/tailwind.css';
import Navbar from './navbar.jsx';

const HomePage = () => {
  // const navigate = useNavigate();

  // const handleSearch = (e) => {
  //   e.preventDefault();
  //   // Get search parameters from form elements and pass them as URL parameters
    // const location = e.target.elements.location.value;
    // const beds = e.target.elements.beds.value;
    // const baths = e.target.elements.baths.value;
    // const guests = e.target.elements.guests.value;
    // const searchParams = new URLSearchParams();
    // if (location) {
    //     searchParams.set("city", location);
    // }
    // if (beds) {
    //     searchParams.set("beds", beds);
    // }
    // if (baths) {
    //     searchParams.set("baths", baths);
    // }
    // if (guests) {
    //     searchParams.set("max_guests", guests);
    // }
  //   navigate(`/search/?${searchParams.toString()}`);
  // };

  // return (
  //   <div>
  //     <Navbar />

  //     <div className="header"> 
  //       <div className="container">
  //         <h1>Find Your Next Home</h1>
  //         <div className="search-bar">
  //           <form onSubmit={handleSearch}>
  //             <div className="location-input">
  //               <label>Location</label>
  //               <input type="text" name="location" placeholder="Destination" />
  //             </div>
  //             <div>
  //               <label>Beds</label>
  //               <input type="number" name="beds" placeholder="Enter Number" />
  //             </div>
  //             <div>
  //               <label>Baths</label>
  //               <input type="number" name="baths" placeholder="Enter Number" />
  //             </div>
  //             <div>
  //               <label>Guest</label>
  //               <input type="number" name="guests" placeholder="Add Guest" />
  //             </div>
  //             <button type="submit">
  //               <img src="/images/search.jpg" alt="Search" />
  //             </button>
  //           </form>
  //         </div>
  //       </div>
  //     </div>

  //     <div className="footer">
  //       <p>Copyright @2023 CSC309</p>
  //     </div>
  //   </div>
  // );

  const navigate = useNavigate();

  const [formValues, setFormValues] = useState({
    location: '',
    beds: '',
    baths: '',
    guests: '',
    amenities: [],
  });

  useEffect(() => {
    const savedFormValues = localStorage.getItem('formValues');
    if (savedFormValues) {
      setFormValues(JSON.parse(savedFormValues));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('formValues', JSON.stringify(formValues));
  }, [formValues]);

  const handleSearch = (e) => {
    e.preventDefault();
    const searchParams = new URLSearchParams();
    const location = e.target.elements.location.value;
    const beds = e.target.elements.beds.value;
    const baths = e.target.elements.baths.value;
    const guests = e.target.elements.guests.value;
    const ordering = e.target.elements.ordering.value;
    if (location) {
        searchParams.set("city", location);
    }
    if (beds) {
        searchParams.set("beds", beds);
    }
    if (baths) {
        searchParams.set("baths", baths);
    }
    if (guests) {
        searchParams.set("max_guests", guests);
    }
    if (ordering) {
        searchParams.set("ordering", ordering);
    }
    formValues.amenities.forEach((amenity) =>
      searchParams.append("amenities", amenity)
    );
    navigate(`/search/?${searchParams.toString()}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormValues((prevValues) => ({ ...prevValues, [name]: value }));
  };

  const handleCheckboxChange = (e) => {
    const { name, checked } = e.target;
    setFormValues((prevValues) => ({
      ...prevValues,
      amenities: checked
        ? [...prevValues.amenities, name]
        : prevValues.amenities.filter((amenity) => amenity !== name),
    }));
  };

  return (
    <div className="flex flex-col h-screen">
      <Navbar />

      <div className="flex-grow flex items-center justify-center"  style={{ backgroundImage: "url(/images/banner.jpg)", backgroundSize: "cover", backgroundPosition: "center center"}}>
        <div className="bg-[#fbf8f0] p-8 rounded shadow-xl w-full md:w-3/4 lg:w-1/2">
          <h1 className="text-3xl mb-4 text-center font-serif">Find Your Next Home</h1>
          <form onSubmit={handleSearch} className="space-y-4">
            {/* Location, Beds, Baths, Guests */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold">Location</label>
                <input
                  type="text"
                  name="location"
                  placeholder="Destination"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">Beds</label>
                <input
                  type="number"
                  name="beds"
                  placeholder="Enter Number"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">Baths</label>
                <input
                  type="number"
                  name="baths"
                  placeholder="Enter Number"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
              <div>
                <label className="block font-semibold">Guests</label>
                <input
                  type="number"
                  name="guests"
                  placeholder="Add Guest"
                  className="w-full p-2 border border-gray-300 rounded"
                />
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap">
              {/* Add other checkboxes for other amenities */}
              <div className="w-1/2 flex items-center">
                <input
                  type="checkbox"
                  name="tv"
                  checked={formValues.amenities.includes('tv')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="tv" className='font-semibold'>TV</label>
              </div>
              <div className="w-1/2 flex items-center">
                <input
                  type="checkbox"
                  name="wifi"
                  checked={formValues.amenities.includes('wifi')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="wifi" className='font-semibold'>Wifi</label>
              </div>
              <div className="w-1/2 flex items-center">
                <input
                  type="checkbox"
                  name="pool"
                  checked={formValues.amenities.includes('pool')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="pool" className='font-semibold'>Pool</label>
              </div>
              <div className="w-1/2 flex items-center">
                <input
                  type="checkbox"
                  name="gym"
                  checked={formValues.amenities.includes('gym')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="gym" className='font-semibold'>Gym</label>
              </div>
              <div className="w-1/2 flex items-center">
                <input
                  type="checkbox"
                  name="parking"
                  checked={formValues.amenities.includes('parking')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="parking" className='font-semibold'>Parking</label>
              </div>
              <div className="w-1/2 flex items-center">
                <input
                  type="checkbox"
                  name="air_conditioning"
                  checked={formValues.amenities.includes('air_conditioning')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="air_conditioning" className='font-semibold'>Air Conditioning</label>
              </div>
              <div className="w-1/2 flex items-center">
                <input
                  type="checkbox"
                  name="balcony"
                  checked={formValues.amenities.includes('balcony')}
                  onChange={handleCheckboxChange}
                  className="mr-2"
                />
                <label htmlFor="balcony" className='font-semibold'>Balcony</label>
              </div>
            </div>

            <div className="mt-4">
              <label className="block mb-2 font-semibold">Order By</label>
              <select name="ordering" className="border rounded p-1 w-full">
                <option value="">Select an ordering</option>
                <option value="price">Price - Ascending</option>
                <option value="-price">Price - Descending</option>
                <option value="max_guests">Guests - Ascending</option>
                <option value="-max_guests">Guests - Descending</option>
              </select>
            </div>

            {/* Search button */}
            <button
              type="submit"
              className="flex items-center w-12 py-2 mt-4 rounded-full text-white text-center"
            >
              <img src="/images/search.jpg" alt="Search" className="mx-auto w-10 h-10 rounded-full" />
            </button>
          </form>
        </div>
      </div>

      <div className="text-center py-4 bg-[#f1996f] text-white">
        <p>Copyright @2023 CSC309</p>
      </div>
    </div>
  );
};

export default HomePage;