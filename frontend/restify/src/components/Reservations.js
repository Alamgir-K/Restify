import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useContext } from "react";
import AuthContext from "../AuthContext";
import Navbar from './navbar.jsx';
import Login from './signin.jsx';
import '../css/style2.css';
import '../css/tailwind.css'


const Reservations = () => {
  const [reservations, setReservations] = useState([]);
  const { token } = useContext(AuthContext);
  const [count, setCount] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [cancelation, setCancelation] = useState(0);

  const fetchReservations = async () => {
    if (token) {
      try {
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.get(`http://localhost:8000/api/reservation/user/all/`, { headers, params: { page: currentPage } });
          setCount(response.data.count);

          const reservationPromises = response.data.results.map(async (reservation) => {
              const propertyResponse = await axios.get(`http://127.0.0.1:8000/api/property/${reservation.property}/view/`);
              return {
                  ...reservation,
                  property: propertyResponse.data,
              };
          });

          const resolvedReservations = await Promise.all(reservationPromises);
          setReservations(resolvedReservations);
          console.log(resolvedReservations);
      } catch (error) {
        console.error("Error fetching reservations:", error);
      }
    }
  };

  useEffect(() => {
    fetchReservations();
  }, [token, currentPage, cancelation]);

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
  };

  const cancelReservation = async (reservationId) => {
    try{
        const headers = { Authorization: `Bearer ${token}` };
        await axios.put(
            `http://localhost:8000/api/reservation/${reservationId}/edit/`,
            { status: "Cancelled" },
            { headers }
        );
        setCurrentPage(1);
        setCancelation(cancelation + 1); // update state
        await fetchReservations();
    } catch (error) {
        console.error("Error cancelling reservation:", error);
    }
  };
  
  const PropertyCard = ({
    id,
    imageUrl,
    address, //city + ", " + country
    title,
    price,
    status,
    start_date,
    end_date,
    guests,
    link1,
    link2,
    total_cost,
    }) => {
        return (
            <div className="listings">
                <div className="pics">
                    <a href={link2}>
                        <img src={imageUrl} alt="Property" />
                    </a>
                </div>
                <div className="info">
                    <p>{address}</p>
                    <h3>{title}</h3>
                    <p>
                        Duration: {start_date} - {end_date} / Guests: {guests}
                    </p> 
                    <div className="price">
                        <p> Status: {status}</p>
                        <h4>${price} / Night</h4>
                        <h4>Total: ${total_cost}</h4>
                        {status === "Pending" && (
                            <button
                            className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                            onClick={() => cancelReservation(id)}
                            >
                            Cancel Reservation
                            </button>
                        )}
                        {["Terminated", "Completed"].includes(status) && (
                            <button
                            className="bg-[#f1996f] hover:bg-[#bb6e4b] text-white font-bold py-2 px-4 rounded"
                            onClick={() => (window.location.href = link1)}
                            >
                            Review Property
                            </button>
                        )}
                    </div>
                </div>
            </div>
        );
    };

    if (!token){
        return <Login />;
    }

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="container">
        <div className="home-container">
          <div className="left-col">
            <h1>Your Reservations</h1>
            {token ? (
              reservations.map((reservation) => (
                <PropertyCard
                  id={reservation.id}
                  key={reservation.id}
                  imageUrl={`http://localhost:8000${reservation.property.main_image}`}
                  address={reservation.property.address + ", " + reservation.property.city + ", " + reservation.property.country}
                  title={reservation.property.name}
                  status={reservation.status}
                  start_date={reservation.start_date}
                  end_date={reservation.end_date}
                  guests={reservation.guest}
                  price={reservation.property.price}
                  link1={`/comment/${reservation.id}/create/`}
                  link2={`/property/${reservation.property.id}/view/`}
                  total_cost={reservation.total_cost}
                />
              ))
            ) : (
              <p className='text-center mt-4 font-semibold text-xl'>Please log in to see your reservations</p>
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
                disabled={currentPage * 4 >= count}
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

export default Reservations;


