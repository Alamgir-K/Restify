import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../css/style.css';
import NavBar from './navbar';
import AuthContext from '../AuthContext';
import { useContext } from 'react';
import { Navigate, Link } from 'react-router-dom';

const HostHome = () => {
  const [profile, setProfile] = useState(null);
  const { token } = useContext(AuthContext);
  const [hostProperties, setHostProperties] = useState([]);
  const [hostInbox, setHostInbox] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [inboxCurrentPage, setInboxCurrentPage] = useState(1);
  const [maxPages, setMaxPages] = useState(0);
  const [inboxMaxPages, setInboxMaxPages] = useState(0);
  const [showRatingsPopup, setShowRatingsPopup] = useState(false);
  const [popupUserId, setPopupUserId] = useState(null);
  const [userRatings, setUserRatings] = useState([]);

  const fetchUserRatings = async (user_id) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`http://localhost:8000/api/rating/${user_id}/view/`, {
        headers,
      });
      setUserRatings(response.data.results);
      console.log(response.data);
    } catch (err) {
      console.error("Error during fetching user ratings", err.data);
    }
  };

  const handleSeeRatings = (user_id) => {
    setPopupUserId(user_id);
    fetchUserRatings(user_id);
    setShowRatingsPopup(true);
  };

  const displayStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span
          key={i}
          role="img"
          aria-label="star"
          className={i <= rating ? "star-orange" : ""}
        >
          {i <= rating ? "⭐" : "☆"}
        </span>
      );
    }
    return stars;
  };

  useEffect(() => {

    const fetchUserProfile = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const profileResponse = await axios.get(
          "http://localhost:8000/api/profile/",
          { headers }
        );

        setProfile(profileResponse.data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserProfile();
    getHostInbox();

  }, [token]);

useEffect(() => {
  getHostProperties();
}, [profile, currentPage])

useEffect(() => {
  getHostInbox();
}, [inboxCurrentPage])

  function updateReservationStatus(stat, id) {
    const headers = { Authorization: `Bearer ${token}` };
  
    axios
      .put(`http://localhost:8000/api/reservation/${id}/edit/`, { status : stat }, { headers })
      .then((response) => {
        console.log(response.data);
      })
      .catch((error) => {
        console.log(error);
      });

      getHostInbox();
      console.log(hostProperties);
      window.location.reload();
  }

  const getHostProperties = async () => {
    // const response = await fetchHostProperties(hostId);
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`http://localhost:8000/api/property/search/`, {
        headers,
        params: {
          host: profile.id,
          page: currentPage,
        },
      });
      setHostProperties(response.data.results);
      // console.log(hostProperties[0].main_image);
      setMaxPages(response.data.count);
    } catch (err) {
      console.error("Error during get property", err.data);
    }
  };

  const getHostInbox = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`http://localhost:8000/api/reservation/host/all/`, {
        headers,
        params: {
          page: inboxCurrentPage,
        },
      });
      setHostInbox(response.data.results);
      setInboxMaxPages(response.data.count);
    } catch (err) {
      console.error("Error during get inbox", err.data);
    }
  };

  return (
    <>
      <div className="bg-beige h-screen">

        <NavBar />

        <div className="flex flex-col h-screen">
          <div className="flex container mx-auto p-3 mt-3">
            {hostProperties.map((property) => (
              <div key={property.id} className="w-1/4 md:w-1/5 p-3">
                <div className="bg-white rounded shadow-lg border-2 border-transparent hover:border-red-300">
                  <img className="w-full h-48" src={property.main_image} alt={property.name} />
                  <div className="p-3">
                    <Link to={`/host-property/${property.id}`} >
                      <p className="text-xl font-bold">{property.name}</p>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
            <div className="w-1/5 md:w-1/5 h-45 bg-white rounded shadow-lg relative">
              <button className="absolute left-0 bottom-0 text-center text-green-500 hover:text-green-800 text-9xl plus">
               <Link to={`/host-new-property`} >
                  <p>+</p>
              </Link>
              </button>
            </div>
            <div class="flex justify-center mt-4">
              <button
                class="mx-1 px-3 py-1 rounded border"
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Prev
              </button>
              <button
                class="mx-1 px-3 py-1 rounded border"
                onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage * 4 > maxPages}
              >
                Next
              </button>
            </div>
          </div>
          <div className="container mx-auto rounded-lg bg-white h-screen p-10 overflow-auto">
            <h2 className="text-2xl font-bold">Inbox</h2>
            {hostInbox.map((inboxItem) => (
              <div key={inboxItem.id}>
                {/* Render stay request inbox items */}
                {inboxItem.status === 'Pending' && (
                  <div className="p-4 bg-gray-300 rounded-lg mt-4">
                    <table className="w-full text-left table-auto">
                      <thead>
                        <tr>
                          <th className="px-4 py-3">Property</th>
                          <th className="px-4 py-3">Stay Request</th>
                          <th className="px-4 py-3">Guests</th>
                          <th className="px-4 py-3">Dates</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td className="border px-4 py-3">{inboxItem.property}</td>
                          <td className="border px-4 py-3">{inboxItem.message}                              <button
                                className="ml-2 bg-purple-500 px-2 py-1 text-white rounded-full"
                                onClick={() => handleSeeRatings(inboxItem.user_id)}
                              >
                                See Ratings
                              </button>
                          </td>
                          <td className="border px-4 py-3">{inboxItem.guest}</td>
                          <td className="border px-4 py-3">
                            {inboxItem.dates}{' '}
                            <button className="bg-blue-500 rounded-full py-2 px-3 text-white" onClick={() => updateReservationStatus('Approved', inboxItem.id)}>Approve</button>{' '}
                            <button className="bg-red-500 rounded-full py-2 px-3 text-white" onClick={() => updateReservationStatus('Denied', inboxItem.id)}>Deny</button>
                            </td>
                        </tr>
                        </tbody>
                    </table>
                    </div>
                )}
                {inboxItem.status === 'Approved' && (
                    <div className="p-4 bg-gray-300 rounded-lg mt-4">
                    <table className="w-full text-left table-auto">
                        <thead>
                        <tr>
                            <th className="px-4 py-3">Property</th>
                            <th className="px-4 py-3">Stay Request</th>
                            <th className="px-4 py-3">Guests</th>
                            <th className="px-4 py-3">Dates</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td className="border px-4 py-3">{inboxItem.property}</td>
                            <td className="border px-4 py-3">{inboxItem.message}</td>
                            <td className="border px-4 py-3">{inboxItem.guest}</td>
                            <td className="border px-4 py-3">
                            {inboxItem.dates}{' '}
                            <button className="bg-gray-500 rounded-full py-2 px-3 text-white" onClick={() => updateReservationStatus('Terminated', inboxItem.id)}>Terminate</button>{' '}
                            </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            ))}
            <div class="flex justify-center mt-4">
              <button
                class="mx-1 px-3 py-1 rounded border"
                onClick={() => setInboxCurrentPage(inboxCurrentPage - 1)}
                disabled={inboxCurrentPage === 1}
              >
                Prev
              </button>
              <button
                class="mx-1 px-3 py-1 rounded border"
                onClick={() => setInboxCurrentPage(inboxCurrentPage + 1)}
                disabled={inboxCurrentPage * 4 >= inboxMaxPages}
              >
                Next
              </button>
            </div>
            </div>
        </div>
        </div>
        {showRatingsPopup && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg mx-auto rounded shadow-lg p-5">
            <h2 className="text-2xl font-medium mb-4">Ratings</h2>
            <table className="w-full text-left table-auto">
            <thead>
              <tr>
                <th className="px-3 py-2">Host</th>
                <th className="px-3 py-2">Rating</th>
              </tr>
            </thead>
            <tbody>
              {userRatings.map((rating) => (
                <tr key={rating.id}>
                  <td className="px-3 py-2 border">{rating.host}</td>
                  <td className="px-3 py-2 border">
                    {displayStars(rating.rating)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
            <button
              className="bg-red-500 px-3 py-2 text-white rounded-full mt-4"
              onClick={() => setShowRatingsPopup(false)}
            >
              Close
            </button>
          </div>
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setShowRatingsPopup(false)}
          ></div>
        </div>
      )}
    </>
  );
};

export default HostHome;

