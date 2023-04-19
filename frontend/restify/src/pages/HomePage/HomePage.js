import React from 'react';
import { useNavigate } from 'react-router-dom';
import './style.css';
import Navbar from '../../components/NavBar';

const HomePage = () => {
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    // Get search parameters from form elements and pass them as URL parameters
    const location = e.target.elements.location.value;
    const beds = e.target.elements.beds.value;
    const baths = e.target.elements.baths.value;
    const guests = e.target.elements.guests.value;
    const searchParams = new URLSearchParams();
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
    navigate(`/search/?${searchParams.toString()}`);
  };

  return (
    <div>
      <Navbar />

      <div className="header"> 
        <div className="container">
          <h1>Find Your Next Home</h1>
          <div className="search-bar">
            <form onSubmit={handleSearch}>
              <div className="location-input">
                <label>Location</label>
                <input type="text" name="location" placeholder="Destination" />
              </div>
              <div>
                <label>Beds</label>
                <input type="number" name="beds" placeholder="Enter Number" />
              </div>
              <div>
                <label>Baths</label>
                <input type="number" name="baths" placeholder="Enter Number" />
              </div>
              <div>
                <label>Guest</label>
                <input type="number" name="guests" placeholder="Add Guest" />
              </div>
              <button type="submit">
                <img src="/images/search.jpg" alt="Search" />
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="footer">
        <p>Copyright @2023 CSC309</p>
      </div>
    </div>
  );
};

export default HomePage;
