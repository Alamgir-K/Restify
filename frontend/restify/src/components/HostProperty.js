import React from "react";
import NavBar from "./navbar";
import { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import AuthContext from '../AuthContext';
import { useContext } from 'react';
import axios from 'axios';

const HostProperty = () => {
    const { id } = useParams();
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [propertyRequests, setPropertyRequests] = useState(null);
    const [propertyComments, setPropertyComments] = useState(null);
    const [propertyPage, setPropertyPage] = useState(1);
    const [requestsPage, setRequestsPage] = useState(1);
    const [commentsPage, setCommentsPage] = useState(1);
    const [replyVisible, setReplyVisible] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [profile, setProfile] = useState(null);
    const { token } = useContext(AuthContext);
  
    useEffect(() => {

      getPropertyDetails();
      getPropertyRequests();
      getPropertyComments();

    }, [token]);

    const toggleReply = (commentId) => {
        if (replyVisible === commentId) {
          setReplyVisible(null);
        } else {
          setReplyVisible(commentId);
        }
    };

    const submitReply = async (commentId) => {
        try {
        console.log("anyyything");
          const headers = { Authorization: `Bearer ${token}` };
          const response = await axios.put(`http://localhost:8000/api/comment/${commentId}/update/`, { message: replyText }, { headers });
          console.log(response.data);
          setReplyVisible(null);
          setReplyText('');
          getPropertyComments(); // Refresh the comments after submitting the reply
          window.location.reload();
        } catch (err) {
          console.error("Error during reply submission", err.response.data);
        }
    };
      
      

    const getPropertyRequests = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`http://localhost:8000/api/reservation/host/all/`, {
              headers,
              params: {
                property: id,
                page: requestsPage
              },
            });
            setPropertyRequests(response.data.results);
            console.log(response.data);
          } catch (err) {
            console.error("Error during get Reservations", err.data);
          }
          
    };

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
    
          getPropertyRequests();
          window.location.reload();
      }

    const getPropertyComments = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`http://localhost:8000/api/comment/${id}/view`, {
              headers,
            });
            setPropertyComments(response.data.results);
            console.log(response.data);
          } catch (err) {
            console.error("Error during get comments", err.data);
          }
    };

    const getPropertyDetails = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`http://localhost:8000/api/comment/${id}/view`, {
              headers,
            });
            console.log(response.data);
            setPropertyDetails(response.data.results);
          } catch (err) {
            console.error("Error during get details", err.data);
          }
    };

    if (!propertyDetails || !propertyRequests || !propertyComments) {
      return <div>Loading...</div>;
    }

    return (
        <div className="bg-beige h-screen">

            <NavBar />

            <div className="flex flex-col w-full p-6 container mx-auto">

                {propertyDetails ? (
                    <div className="flex flex-col mb-4">
                        <h2 className="font-semibold mb-4 text-3xl">Property Details</h2>
                        <div className="flex mb-4">
                            <div className="relative">
                                <img
                                    src={propertyDetails.imageUrl}
                                    alt="House Image"
                                    className="w-100 h-80 mr-4 rounded"
                                />
                                <button
                                    className="absolute top-4 right-8 rounded-full py-1 px-2 text-xs button-normal text-white"
                                >
                                    <a href="host_edit_property.html">edit</a>
                                </button>
                                <p className="text-xl font-bold">{propertyDetails.name}</p>
                            </div>
                            <div className="word-list">
                                <div className="word rounded-lg max-w-sm button-normal">
                                    {propertyDetails.address}
                                </div>
                                <div className="word button-normal rounded-lg max-w-sm ">
                                    Cost: ${propertyDetails.cost}
                                </div>
                                <div className="word button-normal rounded-lg max-w-sm">
                                    {propertyDetails.beds} Beds, {propertyDetails.baths} Baths
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading property details...</p>
                )
                }

                <div class="flex bg-white container">

            <div className="flex flex-col mb-6 w-1/2 p-4">
                <h2 className="text-2xl font-medium mb-4">Upcoming Bookings</h2>
                <table className="w-full text-left table-auto">
                    <thead>
                    <tr>
                        <th className="px-3 py-2">User</th>
                        <th className="px-3 py-2">Guests</th>
                        <th className="px-3 py-2">Dates</th>
                    </tr>
                    </thead>
                    <tbody>
                    {propertyRequests.map((request) => (
                        <tr key={request.id} className={request.status === 'Approved' ? "bg-blue-200" : ""}>
                        <td className="px-3 py-2 border">{request.user_id}</td>
                        <td className="px-3 py-2 border">{request.guest}</td>
                        <td className="px-3 py-2 border">
                            {request.start_date} - {request.end_date}{"  -  "}
                            {request.status === 'Approved' ? (
                            <button className="bg-gray-500 button-normal px-2 py-3 text-white rounded-full" onClick={() => updateReservationStatus('Terminated', request.id)}>
                                Terminate
                            </button>
                            ) : (
                            <>
                                <button className="bg-blue-500 px-2 py-3 text-white rounded-full" onClick={() => updateReservationStatus('Approved', request.id)}>
                                Approve
                                </button>
                                <button className="bg-red-500 px-2 py-3 text-white rounded-full" onClick={() => updateReservationStatus('Denied', request.id)}>
                                Deny
                                </button>
                            </>
                            )}
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

            </div>

            <div className="flex flex-col w-1/2 relative pb-20 p-10">
                <h2 className="text-2xl font-medium mb-4">Previous Guest Comments</h2>
                {propertyComments.map((comment) => (
                <div key={comment.id}>
                    <div className="mb-2 bg-gray-200 p-2 rounded">
                    {Array(comment.Rating)
                        .fill()
                        .map((_, i) => (
                        <span key={i} className="fa fa-star checked"></span>
                        ))}
                    {Array(5 - comment.Rating)
                        .fill()
                        .map((_, i) => (
                        <span key={i} className="fa fa-star"></span>
                        ))}
                    <p className="font-medium ml-4 mb-2 flex items-center">
                        <p className="font-medium  mr-2">{comment.user}: </p>
                        {comment.comment}{" "}
                        {!comment.hostresponse || !comment.userresponse ? (
                        <button className="button-normal text-white rounded-full py-2 px-4" onClick={() => toggleReply(comment.id)}>
                            Reply
                        </button>
                        ) : null}
                    </p>
                    {comment.hostresponse && (
                        <div className="ml-4 mb-2 text-green-600 flex items-center">
                        <p className="font-medium mr-2">Host response:</p>
                        <p>{comment.hostresponse}</p>
                        </div>
                    )}
                    {comment.userresponse && (
                        <div className="ml-4 mb-2 text-blue-600 flex items-center">
                        <p className="font-medium mr-2">{comment.user}:</p>
                        <p>{comment.userresponse}</p>
                        </div>
                    )}
                    {replyVisible === comment.id && (
                        <div className="mt-2">
                        <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="border border-gray-400 px-3 py-2 rounded"
                            placeholder="Write your reply here"
                        />
                        <button
                            className="button-normal text-white rounded-full py-2 px-4 ml-2"
                            onClick={() => submitReply(comment.id)}
                        >
                            Enter
                        </button>
                        </div>
                    )}
                    </div>
                </div>
                ))}
          </div>
      </div> 
    </div>
    </div>
  );
};

export default HostProperty;
