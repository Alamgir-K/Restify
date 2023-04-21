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
                          <td className="border px-4 py-3">{inboxItem.message}</td>
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
    </>
  );
};

export default HostHome;

