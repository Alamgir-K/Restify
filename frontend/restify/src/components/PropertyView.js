import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useSearchParams } from 'react-router-dom';
import { useContext } from "react";
import AuthContext from "../AuthContext";
import axios from 'axios';
import Navbar from './navbar.jsx';
import '../css/style2.css';
import '../css/tailwind.css'
import { Loader } from "@googlemaps/js-api-loader";
import { useRef } from 'react';

const PropertyLocation = ({
    name,
    city,
    country,
}) => {
    return (
        <div className="title">
            <h1 className="font-semibold">{name}</h1>
            <div className="location">
                <p>Super Host | Location: {city}, {country} </p>
            </div>
        </div>        
    );
};


const PropertyImage = ({
    main_image,
    img1,
    img2,
    img3,
    img4,
  }) => {
    const mainImgStyle = {
      width: '700px',
      height: '500px',
      objectFit: 'cover',
    };
  
    const otherImgStyle = {
      width: '500px',
      height: '250px',
      objectFit: 'cover',
    };
  
    return (
      <div className="house-img">
        <div className="main-img">
          <img style={mainImgStyle} src={main_image} alt="main" />
        </div>
        <div><img style={otherImgStyle} src={img1} alt="img1" /></div>
        <div><img style={otherImgStyle} src={img2} alt="img2" /></div>
        <div><img style={otherImgStyle} src={img3} alt="img3" /></div>
        <div><img style={otherImgStyle} src={img4} alt="img4" /></div>
      </div>
    );
  };
  

const PropertyBasics = ({
    owner_name,
    beds, 
    baths, 
    price,
    guests,
}) => {
    return (
       <div className="col-left">
        <div className="property-detail">
            <h2>Entire cabin hosted by {owner_name}</h2>
            <p>{beds} Bedroom | {baths} Bathrooms | {guests} Guests</p>
            <h4>${price} / night</h4>
        </div>
        <hr className="divider"></hr>
       </div> 
    );
};

function ReservationForm({ property, token }){
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [guests, setGuests] = useState("");
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(!token){
            setError("You must be logged in to make a reservation.");
            setMessage("You must be logged in to make a reservation.");
            return;
        }

        try {
            const response = await axios.post(
                "http://localhost:8000/api/reservation/create/",
                {
                    property: property.id,
                    start_date: startDate,
                    end_date: endDate,
                    guest: guests,
                }, 
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage("Reservation created successfully.");
            setError("Reservation created successfully.");
            console.log(response);
        } catch (error) {
            console.error("Error:", error.response.data.error);
            setError(error.response.data.error);
            setMessage(error.response.data.error);
        }
    }

    return (
        <div className="checkin">
            <form className="reserve" onSubmit={handleSubmit}>
                <div>
                    <label>Check In</label>
                    <input
                        type="date"
                        placeholder="Enter Date (yyyy-mm-dd)"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>
                <div>
                    <label>Check Out</label>
                    <input
                        type="date"
                        placeholder="Enter Date (yyyy-mm-dd)"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
                <div className="guest">
                    <label>Guests</label>
                    <input
                        type="number"
                        placeholder="Enter Number of Guests"
                        value={guests}
                        onChange={(e) => setGuests(e.target.value)}
                    />
                </div>
                <button type="submit">Reserve</button>
                {error && <div className="error-message">{error.message}</div>}
                {message && <div className="message">{message}</div>}
            </form>
        </div>
    );
};

const PropertyAmenities = ({ amenities }) => {
    return (
        <ul className="details">
            <li className="font-semibold">Amenities included:</li>
            {amenities.map((amenity, index) => (
                <li key={index}>{amenity.toUpperCase()}</li>
            ))}
        </ul>
    );
};

const PropertyDescription = ({ description }) => {
    return (
        <p className="essay">{description}</p>
    );
};

function Map({ city, country}) {
    const mapRef = useRef();
  
    useEffect(() => {
      if (!city) {
        return;
      }
  
      const loadMap = async () => {
        const loader = new Loader({
          apiKey: "AIzaSyC7njEq01hlgu1gKFMydKa0TPk25mZvpV0", // Replace with your Google Maps API key
          version: "weekly",
        });
  
        const google = await loader.load();
  
        const mapOptions = {
          zoom: 12,
          center: { lat: 0, lng: 0 },
          mapTypeId: google.maps.MapTypeId.ROADMAP,
        };
  
        const map = new google.maps.Map(mapRef.current, mapOptions);
  
        const geocoder = new google.maps.Geocoder();
        geocoder.geocode({ address: city }, (results, status) => {
          if (status === google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
          } else {
            console.error(`Error geocoding city: ${city}`);
          }
        });
      };
  
      loadMap();
    }, [city]);
  
    return (
        <div className="map">
            <h3>Where you will be staying:</h3>
            <div ref={mapRef} style={{ width: "100%", height: "400px" }} />
            <b>{city}, {country}</b>
        </div>
    );
};

const HostInfo = ({ owner }) => {
    return (
      <div className="host">
        {owner.avatar ? (
          <img src={`http://localhost:8000${owner.avatar}`} alt="" />
        ) : (
          <img src="/images/logo.png" alt="logo" />
        )}
        <div>
          <h2>Hosted by {owner.user.first_name}</h2>
          <p>Identity verified</p>
        </div>
      </div>
    );
  };
  
const ContactHost = ({ owner }) => {
    return(
       <a className="host-contact" href={`mailto:${owner.user.email}?subject=Inquiry &body= I want to know more about your place`}>Contact Host</a> 
    );
};

const Comment = ({
    comment_id,
    comment,
    user,
    host,
    hostResponse,
    userResponse,
    createdAt,
    handleUpdateResponse,
    token,
    setErrorMessage,
    errorMessage,
  }) => {
    const [response, setResponse] = useState("");
  
    const formattedDate = new Date(createdAt).toLocaleString();

    const handleButtonClick = () => {
        if (!token ) {
            setErrorMessage("Please log in to respond");
        } else {
            handleUpdateResponse(comment_id, response);
        }
    }
  
    return (
      <div className="comment-block bg-orange-200 p-4 rounded-md shadow-md mb-4 relative">
        <div className="comment-user flex items-center space-x-2 mb-2">
          {user.avatar ? (
          <img src={`http://localhost:8000${user.avatar}`} alt="" className="w-8 h-8 rounded-full"/>
        ) : (
          <img src="/images/logo.png" alt="logo" className="w-8 h-8 rounded-full"/>
        )}
          <p className="font-semibold">{user.user.first_name}</p>
        </div>
        <p className="mb-2">{comment}</p>
        {hostResponse && (
          <>
            <div className="comment-host flex items-center space-x-2 mb-2">
              {host.avatar ? (
                <img src={`http://localhost:8000${host.avatar}`} alt="" className="w-8 h-8 rounded-full"/>
                ) : (
                <img src="/images/logo.png" alt="logo" className="w-8 h-8 rounded-full"/>
            )}
              
              <p className="font-semibold">{host.user.first_name}</p>
            </div>
            <p className="mb-2">{hostResponse}</p>
          </>
        )}
        {userResponse ? (
            <>
            <div className="comment-user flex items-center space-x-2 mb-2">
                {user.avatar ? (
                <img src={`http://localhost:8000${user.avatar}`} alt="" className="w-8 h-8 rounded-full"/>
                ) : (
                <img src="/images/logo.png" alt="logo" className="w-8 h-8 rounded-full"/>
                )}
                <p className="font-semibold">{user.user.first_name}</p>
            </div>
            <p className="mb-2">{userResponse}</p>
            </>
        ) : (
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              className="border-2 border-gray-300 rounded-md px-2 py-1"
            />
            <button
              onClick={handleButtonClick}
              className={`${
                response ? "bg-green-500" : "bg-gray-500 pointer-events-none"
              } text-white px-2 py-1 rounded-md`}
              disabled={!response}
            >
              Respond
            </button>
          </div>
        )}
        {errorMessage && (
          <p className="text-red-500 text-sm">{errorMessage}</p>
        )}
        <p className="absolute top-2 right-4 text-sm text-gray-600">
          {formattedDate}
        </p>
      </div>
    );
};
  

const PropertyView = () => {
    const location = useLocation();
    const params = useParams();
    const [property, setProperty] = useState(null);
    const [owner, setOwner] = useState(null);
    const [propertyId, setPropertyId] = useState(null);
    const { token } = useContext(AuthContext);
    const [id, setId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [errormsg, setErrormsg] = useState("");
    const [error, setError] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentPage, setCommentPage] = useState(1);
    const [activeCommentId, setActiveCommentId] = useState(null);

    useEffect(() => {
      const fetchPropertyData = async () => {
        setId(params.id);
        try {
          const response = await axios.get(`http://127.0.0.1:8000/api/property/${params.id}/view/`);
          
          const data = await response.data;
          setProperty(data);
          setPropertyId(data.id);
  
          // Fetch owner data
          const ownerResponse = await axios.get(`http://127.0.0.1:8000/api/profile/${data.owner_id}/`);

          const ownerData = await ownerResponse.data;
          setOwner(ownerData);

        } catch (error) {
          console.error('Error:', error);
          setError(error);
        } finally {
            setLoading(false);
        }
      }; 
      
      const fetchProfiles = async (userId, hostId) => {
        try{
            const userResponse = await axios.get(`http://localhost:8000/api/profile/${userId}/`);
            const hostResponse = await axios.get(`http://localhost:8000/api/profile/${hostId}/`);
            return (
                {
                    user: userResponse.data,
                    host: hostResponse.data
                }
            )
        } catch (error) {
            console.error("Error during get profiles", error.data);
        }
      };

      const fetchPropertyComments = async () => {
        setId(params.id);
        try {
            const headers = { Authorization: `Bearer ${token}` };
            const response = await axios.get(`http://localhost:8000/api/comment/${params.id}/view`, {
              params: {
                page: commentPage
              },
            });
            
            const commentsWithProfiles = await Promise.all(
                response.data.results.map(async (comment) => {
                  const { user, host } = await fetchProfiles(comment.user, comment.host);
                  return { ...comment, user, host };
                })
            );

            setComments(commentsWithProfiles);
            console.log(commentsWithProfiles);
        } catch (error) {
            console.log(token);
            console.error("Error during get comments", error);
        }
      };

      fetchPropertyData();
      fetchPropertyComments();
    }, [location, params, token]);

    const handleRespondComment = async (commentId, message) => {
        if (!token) {
            setErrormsg("Please log in to respond");
            setActiveCommentId(commentId);
        } else {
            try {
                const headers = { Authorization: `Bearer ${token}` };
                const response = await axios.put(`http://localhost:8000/api/comment/${commentId}/update/`,  
                { message },
                { headers }
                );
                console.log(response);
            } catch (error) {
                console.error("Error during respond comment", error);
                if (error.response && error.response.status === 403) {
                    setErrormsg("You don't have permission to respond to this comment");
                } else {
                    setErrormsg("An error occurred while trying to respond to the comment");
                }
                setActiveCommentId(commentId);
            }
        }
    };
    
  
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />

            {loading ? (
                <div>Loading...</div>
            ) : error ? (
                <div>Error: {error.message}</div>
            ) : (
                property &&
                owner && (
                <div className="property-info">
                    <PropertyLocation
                        name={property.name}
                        city={property.city}
                        country={property.country}
                    />
                    <PropertyImage
                        main_image={`http://localhost:8000${property.main_image}`}
                        img1={`http://localhost:8000${property.img1}`}
                        img2={`http://localhost:8000${property.img2}`}
                        img3={`http://localhost:8000${property.img3}`}
                        img4={`http://localhost:8000${property.img4}`}
                    />

                    <div className="row">
                        <PropertyBasics
                            owner_name={owner.user.first_name}
                            beds={property.beds}
                            baths={property.baths}
                            price={property.price}
                            guests={property.max_guests}
                        />

                        <ReservationForm
                            property={property}
                            token={token}
                        />

                        <PropertyAmenities
                            amenities={property.amenities}
                        />

                        <hr className="divider"/>
                        <PropertyDescription 
                            description={property.description}
                        />
                        <hr className="divider"/>

                        <Map 
                            city={property.city}
                            country={property.country}
                        />
                        <hr className="divider"/>

                        <HostInfo 
                            owner={owner}
                        />

                        <ContactHost
                            owner={owner}
                        />
                        <hr className="divider"/>
                                                
                        {comments.length > 0 && (
                            <div>
                                <h2 className="text-2xl font-semibold mb-4">Comments:</h2>
                                {comments.map((comment) => (
                                <Comment
                                    token={token}
                                    key={comment.id}
                                    comment_id={comment.id}
                                    comment={comment.comment}
                                    user={comment.user}
                                    host={comment.host}
                                    hostResponse={comment.hostresponse}
                                    userResponse={comment.userresponse}
                                    createdAt={comment.created_at}
                                    handleUpdateResponse={handleRespondComment}
                                    setErrorMessage={setErrormsg}
                                    errorMessage={comment.id === activeCommentId ? errormsg : ""}
                                />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
                )
            )}

            <div className="mt-auto footer">
                <p>Copyright @2023 CSC309</p>
            </div>
        </div>
    );
};

export default PropertyView;