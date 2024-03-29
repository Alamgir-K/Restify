import React from "react";
import NavBar from "./navbar";
import { useState, useEffect } from "react";
import { useParams, useLocation } from 'react-router-dom';
import AuthContext from '../AuthContext';
import { useContext } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";

const HostProperty = () => {
    const { id } = useParams();
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [propertyRequests, setPropertyRequests] = useState(null);
    const [propertyComments, setPropertyComments] = useState(null);
    const [replyVisible, setReplyVisible] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [profile, setProfile] = useState(null);
    const { token } = useContext(AuthContext);
    const [highlightedImage, setHighlightedImage] = useState("main_image");
    const [commentPage, setCommentPage] = useState(1);
    const [reservationPage, setReservationPage] = useState(1);
    const [maxCommentPages, setCommentMaxPages] = useState(0);
    const [maxReservationPages, setReservationMaxPages] = useState(0);
    const [ratingVisible, setRatingVisible] = useState(null);
    const [currentRating, setCurrentRating] = useState(0);
    const [submittedRatingForComment, setSubmittedRatingForComment] = useState({});
    const [showRatingsPopup, setShowRatingsPopup] = useState(false);
    const [popupUserId, setPopupUserId] = useState(null);
    const [userRatings, setUserRatings] = useState([]);
    const [commentText, setCommentText] = useState('');
    const [userIdTitleMap, setUserIdTitleMap] = useState({});

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

    const propertyImages = [
      "main_image",
      "img1",
      "img2",
      "img3",
      "img4",
    ];
  
    useEffect(() => {

      getPropertyDetails();
      getPropertyRequests();
      getPropertyComments();

    }, [token]);

    const handleSeeRatings = (user_id) => {
      setPopupUserId(user_id);
      fetchUserRatings(user_id);
      setShowRatingsPopup(true);
    };
    

    const toggleReply = (commentId) => {
        if (replyVisible === commentId) {
          setReplyVisible(null);
        } else {
          setReplyVisible(commentId);
        }
    };

    const toggleRating = (commentId) => {
      if (ratingVisible === commentId) {
        setRatingVisible(null);
      } else {
        setRatingVisible(commentId);
      }
    };

    const renderStars = (commentId) => {
      const stars = [];
      for (let i = 1; i <= 5; i++) {
        stars.push(
          <span
            key={i}
            role="img"
            aria-label="star"
            className={i <= currentRating ? "star-orange" : ""}
            onClick={() => setCurrentRating(i)}
          >
            {i <= currentRating ? "⭐" : "☆"}
          </span>
        );
      }
      return stars;
    };
    
    const submitRating = async (commentId, userId) => {
      console.log(currentRating);
      try {
        const headers = { Authorization: `Bearer ${token}` };
        const data = {
          rating: currentRating,
          comment: commentText
        };
        const response = await axios.post(
          `http://localhost:8000/api/rating/${userId}/create/`,
          data,
          { headers }
        );
        console.log(response.data);

        setSubmittedRatingForComment({
          ...submittedRatingForComment,
          [commentId]: true,
        });

      } catch (err) {
        console.error("Error during rating submission", err);
      }

    };

    const renderImages = () => {
        return propertyImages.map((imageKey) => {
          const imageSrc = propertyDetails[imageKey];
          if (!imageSrc) return null; // Check if image exists
    
          return (
            <img
              key={imageKey}
              src={'http://localhost:8000' + imageSrc}
              alt={`Property ${imageKey}`}
              className={`w-24 h-24 m-2 cursor-pointer ${
                highlightedImage === imageKey ? "border-4 border-blue-500" : ""
              }`}
              onClick={() => setHighlightedImage(imageKey)}
            />
          );
        });
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

    const getUserName = async (userId) => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const profileResponse = await axios.get(
          `http://localhost:8000/api/profile/${userId}/`,
          { headers }
        );

        setUserIdTitleMap((prevMapping) => ({
          ...prevMapping,
          [userId]: profileResponse.data.user.first_name,
        }));

      } catch (error) {
        console.error(error);
      }
    };


    const getPropertyRequests = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`http://localhost:8000/api/reservation/host/all/`, {
              headers,
              params: {
                property: id,
                page: reservationPage
              },
            });
            setPropertyRequests(response.data.results);
            console.log(response.data);

            response.data.results.forEach((user) => {
              getUserName(user.id);
            });

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
              params: {
                page: commentPage
              },
            });
            setPropertyComments(response.data.results);
            console.log(response.data);

            // Initialize submittedRatingForComment as false for each fetched comment
            const initialSubmittedRatings = response.data.results.reduce((acc, comment) => {
              acc[comment.id] = false;
              return acc;
            }, {});

            setSubmittedRatingForComment(initialSubmittedRatings);

            response.data.results.forEach((user) => {
              getUserName(user.id);
            });

          } catch (err) {
            console.error("Error during get comments", err.data);
          }
    };

    const getPropertyDetails = async () => {
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`http://localhost:8000/api/property/${id}/view`, {
              headers,
            });
            console.log(response.data);
            setPropertyDetails(response.data);
            getUserName(response.data.owner_id);
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
          <div className="flex flex-col w-full p-6 bg-white container mx-auto">
            {propertyDetails ? (
              <div className="flex flex-col mb-4">
                <div className="flex justify-between items-center">
                  <h2 className="font-semibold mb-4 text-3xl">Property Details</h2>
                  <Link
                    to={`/host-edit-property/${propertyDetails.id}`}
                    className="button-normal text-white rounded-full py-2 px-4"
                  >
                    Edit
                  </Link>
                </div>
                <div className="flex">
                  <div className="image-display mb-4">
                    <img
                      src={'http://localhost:8000' + propertyDetails[highlightedImage]}
                      alt="Highlighted Property"
                      className="w-full h-64"
                    />
                  </div>
                  <div className="images-container flex items-center">
                    {renderImages()}
                  </div>
                  <div className="amenities-checklist ml-4">
                    <h3 className="font-semibold text-xl mb-2">Amenities</h3>
                    <ul>
                      {propertyDetails.amenities.map((amenity) => (
                        <li key={amenity}>
                          <input
                            type="checkbox"
                            id={`amenity-${amenity}`}
                            checked
                            readOnly
                          />
                          <label htmlFor={`amenity-${amenity}`} className="ml-2">
                            {amenity}
                          </label>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
                <div className="bg-light-blue p-4 mt-4 rounded">
                  <p>{propertyDetails.description}</p>
                </div>
                <div className="property-details-fields flex flex-wrap justify-between mt-4">
                <div className="word rounded-lg button-normal">
                {propertyDetails.city}, {propertyDetails.country}
                  </div>
                  <div className="word rounded-lg button-normal">
                    {propertyDetails.address}
                  </div>
                  <div className="word button-normal rounded-lg">
                    Cost: ${propertyDetails.price}
                  </div>
                  <div className="word button-normal rounded-lg">
                    {propertyDetails.beds} Beds, {propertyDetails.baths} Baths
                  </div>
                  <div className="word button-normal rounded-lg">
                    Max Guests: {propertyDetails.max_guests}
                  </div>
                </div>
              </div>

                ) : (
                    <p>Loading property details...</p>
                )
                }

          <div class="flex bg-lime-100 container">

            <div className="flex flex-col w-1/2 p-4">
                <h2 className="text-2xl font-medium mb-4">Bookings</h2>
                <table className="w-full text-left table-auto">
                    <thead>
                    <tr>
                        <th className="px-3 py-2">User</th>
                        <th className="px-3 py-2">Guests</th>
                        <th className="px-3 py-2">Dates</th>
                    </tr>
                    </thead>
                    <tbody>
                    {propertyRequests
                    .filter((request) => ['Pending', 'Approved', 'Terminated', 'Cancelled', 'Completed'].includes(request.status))
                    .map((request) => (
                        <tr key={request.id} className={request.status === 'Approved' ? "bg-blue-200" : ""}>
                            <td className="px-3 py-2 border">
                              {userIdTitleMap[request.user_id]}
                              <button
                                className="ml-2 bg-purple-500 px-2 py-1 text-white rounded-full"
                                onClick={() => handleSeeRatings(request.user_id)}
                              >
                                See Ratings
                              </button>
                            </td>
                            <td className="px-3 py-2 border">{request.guest}</td>
                            <td className="px-3 py-2 border">
                                {request.start_date} - {request.end_date}{"  -  "}
                                {request.status === 'Approved' ? (
                                    <button className="bg-gray-500 button-normal px-2 py-3 text-white rounded-full" onClick={() => updateReservationStatus('Terminated', request.id)}>
                                        Terminate
                                    </button>
                                ) : request.status === 'Pending' ? (
                                    <>
                                        <button className="bg-blue-500 px-2 py-3 text-white rounded-full" onClick={() => updateReservationStatus('Approved', request.id)}>
                                            Approve
                                        </button>
                                        <button className="bg-red-500 px-2 py-3 text-white rounded-full" onClick={() => updateReservationStatus('Denied', request.id)}>
                                            Deny
                                        </button>
                                    </>
                                ) : request.status === 'Terminated' || request.status === 'Cancelled' ? (
                                    <div className="bg-black text-white text-center px-2 py-3 rounded">
                                        {request.status}
                                    </div>
                                ) : request.status === 'Completed' ? (
                                  <div className="bg-lime-600 text-white text-center px-2 py-3 rounded">
                                      {request.status}
                                  </div>
                                ) :null}
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>

                <div class="flex justify-center mt-4">
                  <button
                    class="mx-1 px-3 py-1 rounded border"
                    onClick={() => setReservationPage(reservationPage - 1)}
                    disabled={reservationPage === 1}
                  >
                    Prev
                  </button>
                  <button
                    class="mx-1 px-3 py-1 rounded border"
                    onClick={() => setReservationPage(reservationPage + 1)}
                    disabled={reservationPage * 4 >= maxReservationPages}
                  >
                    Next
                  </button>
                </div>

            </div>

            <div className="flex flex-col w-3/5 relative pb-20 p-10">
                <h2 className="text-2xl font-medium mb-4">Previous Guest Comments</h2>
                {propertyComments.map((comment) => (
                    <div key={comment.id}>
                        <div className="mb-2 bg-gray-200 p-2 rounded">
                        {Array(comment.Rating)
                        .fill()
                        .map((_, i) => (
                            <span key={i} role="img" aria-label="star" className="star-orange">
                            &#9733;
                            </span>
                        ))}
                        {Array(5 - comment.Rating)
                        .fill()
                        .map((_, i) => (
                            <span key={i} role="img" aria-label="empty star" className="star-orange">
                            &#9734;
                            </span>
                        ))}
                            <p className="font-medium ml-4 mb-2 flex items-center">
                                <p className="font-medium  mr-2">{userIdTitleMap[comment.user]}: </p>
                                {comment.comment}{" "}
                                {!comment.hostresponse ? (
                                    <button className="button-normal text-white rounded-full py-2 px-4" onClick={() => toggleReply(comment.id)}>
                                        Reply
                                    </button>
                                ) : null}
                            </p>
                            {comment.hostresponse && (
                                <div className="ml-4 mb-2 text-green-600 flex items-center">
                                    <p className="font-medium mr-2">{userIdTitleMap[propertyDetails.owner_id]}:</p>
                                    <p>{comment.hostresponse}</p>
                                </div>
                            )}
                            {comment.userresponse && (
                                <div className="ml-4 mb-2 text-blue-600 flex items-center">
                                    <p className="font-medium mr-2">{userIdTitleMap[comment.user]}:</p>
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
                            {!submittedRatingForComment[comment.id] && (
                            <button
                            className="button-normal text-white rounded-full py-2 px-4"
                            onClick={() => toggleRating(comment.id)}
                          >
                            Rate User
                          </button>)}
                          {ratingVisible === comment.id && !submittedRatingForComment[comment.id] && (
                            <div className="mt-2">
                              {renderStars(comment.id)}
                              <input type="text" value={commentText} onChange={(e) => setCommentText(e.target.value)} className="border border-gray-400 px-3 py-2 rounded" placeholder="Write your comment here" />
                              <button
                                onClick={() => submitRating(comment.id, comment.user)}
                              >
                                Submit Rating
                              </button>
                            </div>
                          )}
                        </div>
                    </div>
                ))}
                <div class="flex justify-center mt-4">
                  <button
                    class="mx-1 px-3 py-1 rounded border"
                    onClick={() => setCommentPage(commentPage - 1)}
                    disabled={commentPage === 1}
                  >
                    Prev
                  </button>
                  <button
                    class="mx-1 px-3 py-1 rounded border"
                    onClick={() => setCommentPage(commentPage + 1)}
                    disabled={commentPage * 4 >= maxCommentPages}
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
    </div>
  );
};

export default HostProperty;
