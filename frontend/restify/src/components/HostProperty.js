import React from "react";
import NavBar from "./NavBar";
import { useState, useEffect } from "react";
import { fetchPropertyDetails, fetchPropertyComments, fetchPropertyRequests } from "../api";

const HostProperty = ({ propertyId }) => {
    const [propertyDetails, setPropertyDetails] = useState(null);
    const [propertyRequests, setPropertyRequests] = useState(null);
    const [propertyComments, setPropertyComments] = useState(null);
  
    useEffect(() => {
      const getPropertyDetails = async () => {
        const data = await fetchPropertyDetails(propertyId);
        setPropertyDetails(data);
      };

      const getPropertyRequests = async () => {
        const data = await fetchPropertyRequests(propertyId);
        setPropertyRequests(data);
      };

      const getPropertyComments = async () => {
        const data = await fetchPropertyComments(propertyId);
        setPropertyComments(data);
      };
  
      getPropertyDetails();
      getPropertyRequests();
      getPropertyComments();
    }, [propertyId]);

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

            {/* Upcoming Bookings Section */}
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
                        <tr key={request.id} className={request.approved ? "bg-blue-200" : ""}>
                        <td className="px-3 py-2 border">{request.userName}</td>
                        <td className="px-3 py-2 border">{request.guests}</td>
                        <td className="px-3 py-2 border">
                            {request.startDate} - {request.endDate}
                            {request.approved ? (
                            <button className="button-normal px-2 py-3 text-white rounded-full">
                                Cancel
                            </button>
                            ) : (
                            <>
                                <button className="bg-blue-500 px-2 py-3 text-white rounded-full">
                                Approve
                                </button>
                                <button className="bg-red-500 px-2 py-3 text-white rounded-full">
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

            {/* Previous Guest Comments Section */}
            <div className="flex flex-col w-1/2 relative pb-20 p-10">
                <h2 className="text-2xl font-medium mb-4">Previous Guest Comments</h2>
                {propertyComments.map((comment) => (
                    <div key={comment.id}>
                    <div className="mb-2 bg-gray-200 p-2 rounded">
                        <p className="font-medium mb-2">{comment.guestName}:</p>
                        <div className="absolute right-10">
                        {Array(comment.rating)
                            .fill()
                            .map((_, i) => (
                            <span key={i} className="fa fa-star checked"></span>
                            ))}
                        {Array(5 - comment.rating)
                            .fill()
                            .map((_, i) => (
                            <span key={i} className="fa fa-star"></span>
                            ))}
                        </div>
                        <p className="font-medium mb-2">
                        {comment.message1}{" "}
                        <button className="button-normal text-white rounded-full py-2 px-4">
                            Reply
                        </button>
                        </p>
                    </div>
                    {comment.message2 && (
                        <div className="p-4 mt-4 bg-gray-200 rounded">
                        <p className="font-medium mb-2">{comment.hostName}:</p>
                        <p className="font-medium mb-2">{comment.message2}</p>
                        </div>
                    )}
                    {comment.message3 && (
                        <div className="w-2/3 light-theme rounded p-4">
                        <p className="font-medium mb-2">{comment.hostName}: {comment.message3}</p>
                        </div>
                    )}
                    </div>
                ))}
            </div>
        </div>
        </div>
    </div>
  );
};

export default HostProperty;
