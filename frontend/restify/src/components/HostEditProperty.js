import React, { useState, useEffect, useContext } from "react";
import NavBar from "./navbar";
import "../css/style.css";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../AuthContext";

function EditProperty() {
  const [propertyDetails, setPropertyDetails] = useState(null);
  const { id } = useParams();

  const [amenities, setAmenities] = useState([]);
  const [currentAmenity, setCurrentAmenity] = useState("");
  const [imageList, setImageList] = useState([]);
  const [title, setTitle] = useState('');
  const [isListed, setIsListed] = useState(true);
  const [address, setAddress] = useState('');
  const [guestsAllowed, setGuestsAllowed] = useState(1);
  const [beds, setBeds] = useState(1);
  const [washrooms, setWashrooms] = useState(1);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const { token } = useContext(AuthContext);

  function handleTitleChange(e) {
    setTitle(e.target.value);
  }

  function handleAmenityChange(e) {
    console.log("changed to: ", currentAmenity);
    setCurrentAmenity(e.target.value);
  }

  function handleAmenityKeyPress(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAmenitySubmit(e);
    }
  }

  const removeAmenity = (index) => {
    setAmenities((prevAmenities) => prevAmenities.filter((_, i) => i !== index));
  };

  function handleAmenitySubmit(e) {
    e.preventDefault();
    console.log("handled");
    if (currentAmenity.trim() !== "") {
      setAmenities([...amenities, currentAmenity]);
      setCurrentAmenity("");
      console.log("Amenities: ", amenities);
    }
  }

  function handleListedChange(e) {
    setIsListed(e.target.checked);
  }

  function handleGuestsAllowedChange(e) {
    setGuestsAllowed(e.target.value);
  }

  function handleBedsChange(e) {
    setBeds(e.target.value);
  }

  function handleWashroomsChange(e) {
    setWashrooms(e.target.value);
  }

  function handleDescriptionChange(e) {
    setDescription(e.target.value);
  }

  function handlePriceChange(e) {
    setPrice(e.target.value);
  }

  function handleLocationChange(e) {
    setAddress(e.target.value);
  }

  const removeImage = (index) => {
    setImageList((prevImageList) => prevImageList.filter((_, i) => i !== index));
  };

  const setPropertyFormValues = (property) => {
    setTitle(property.name);
    setAddress(property.address);
    setGuestsAllowed(property.max_guests);
    setBeds(property.beds);
    setWashrooms(property.baths);
    setDescription(property.description);
    setPrice(property.price);
    const propertyImages = [property.main_image];

    for (let i = 1; i <= 4; i++) {
      const imageKey = `image_${i}`;
      if (property[imageKey]) {
        propertyImages.push(property[imageKey]);
      }
    }
  
    setImageList(propertyImages);
    setAmenities(property.amenities);
  };
  
  // Update the getPropertyDetails function
  const getPropertyDetails = async () => {
    try {
      const headers = { Authorization: `Bearer ${token}` };
      const response = await axios.get(`http://localhost:8000/api/property/${id}/view`, {
        headers,
      });
      setPropertyDetails(response.data);
      setPropertyFormValues(response.data);
      console.log("Amenities 2.0: ", amenities);
    } catch (err) {
      console.error("Error during get details", err);
    }
  };

  useEffect(() => {
    getPropertyDetails();
  }, [token]);

const handleFileChange = (e) => {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.onload = () => {
    const newUrl = reader.result;
    setImageList([...imageList, newUrl]);
  };

  if (file) {
    reader.readAsDataURL(file);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const headers = { Authorization: `Bearer ${token}` };
  
    try {
      const response = await axios.put(`http://localhost:8000/api/property/${id}/edit/`, {
        name: title,
        address: address,
        city: 'Toronto',
        country: 'Canada',
        price: price,
        max_guests: guestsAllowed,
        beds: beds,
        baths: washrooms,
        description: description,
        main_image: imageList[0],
        amenities: amenities
      }, { headers });
    } catch (error) {
      console.error(error.response.data);
    }
  };  
  

  return (
    <>
      <div className="bg-beige h-screen">

        <NavBar />

        <div className="bg-beige h-screen">
        {propertyDetails ? (
        <div className="container mx-auto">
          <h1 className="font-semibold mb-6 text-3xl text-left">New Property</h1>
          <form className="bg-white shadow-md rounded px-6 pt-8" onSubmit={handleSubmit} encType="multipart/form-data">
          <div className="flex">
            <div className="mb-4 text-left w-2/5">
              <label className="block text-gray-500 mb-2" htmlFor="title">Title</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500"
                id="title"
                value={title}
                onChange={handleTitleChange}
              />
            </div>
            <div className="flex-col items-center w-1/5 p-4">
                <label className="block text-gray-500 mb-2">
                  Listed
                </label>
                <label className="switch" id="listed">
                  <input
                    type="checkbox"
                    checked={isListed}
                    id="listing"
                    onChange={handleListedChange}
                  />
                  <span className="slider round"></span>
                </label>
            </div>
            <div className="w-1/4 flex-col p-4">
            <label className="block text-gray-700 font-medium mb-2 text-left">Amenities</label>
                <div className="flex items-center">
                  <input
                    type="text"
                    className="shadow appearance-none border rounded w-2/3 py-2 px-3 text-gray-700"
                    placeholder="Add Amenity"
                    value={currentAmenity}
                    onChange={handleAmenityChange}
                    onKeyPress={handleAmenityKeyPress}
                  />
                  <button
                    className="text-white font-medium button-normal py-2 px-4 rounded ml-2"
                    type="button"
                    onClick={handleAmenitySubmit}
                  >
                    Add
                  </button>
                </div>
              <div className="border border-gray-300 rounded mt-4 p-4">
                  {amenities.map((amenity, index) => (
                    <div
                      key={index}
                      className="bg-orange-200 text-gray-700 rounded mb-2 p-2 inline-flex items-center"
                    >
                      <p>{amenity}</p>
                      <button
                        className="text-red-500 hover:text-red-800 text-xl ml-2"
                        onClick={() => removeAmenity(index)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
            </div>
          </div>
          <div className="flex flex-wrap">
            {/* Step 3: Display each image in a row using map */}
            {imageList.map((url, index) => (
              <div key={index} className="relative w-64 h-64 mr-4 mb-4">
                <img src={'http://localhost:8000' + url} alt={`House Image ${index}`} />
                <button
                  className="absolute top-0 right-0 text-red-500 hover:text-red-800 text-2xl p-2"
                  onClick={() => removeImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          <div className="relative w-64 h-64 mr-4 mb-4">
              <img src="https://via.placeholder.com/400x300" alt="Add new House Image" />
            <label htmlFor="fileInput" className="absolute bottom-0 left-0 text-green-500 hover:text-green-800 text-3xl p-2 cursor-pointer">
              +
            </label>
            <input type="file" id="fileInput" className="hidden" onChange={handleFileChange} />
          </div>
          </div>
          <div className="flex">
            <div className="w-3/6 flex-col p-4">
              <label className="block text-gray-700 font-medium mb-2 text-left">Address</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                type="text"
                value={address}
                onChange={handleLocationChange}
              />
            </div>
            <div className="w-3/6 flex-col p-4">
              <label className="block text-gray-700 font-medium mb-2 text-left">Cost Per Night</label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                type="number"
                value={price}
                onChange={handlePriceChange}
              />
            </div>
            <div className="w-1/4 flex-col p-4">
                <label className="block text-gray-700 font-medium mb-2 text-left">Max Guests</label>
                <select
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                  value={guestsAllowed}
                  onChange={handleGuestsAllowedChange}
                >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
                <option value="9">9</option>
                <option value="10+">10+</option>
              </select>
            </div>
            <div className="w-1/4 flex-col p-4">
              <label className="block text-gray-700 font-medium mb-2 text-left">Beds</label>
              <select
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                value={beds}
                onChange={handleBedsChange}
              >
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8+</option>
              </select>
            </div>
            <div className="w-1/4 flex-col p-4">
              <label className="block text-gray-700 font-medium mb-2 text-left">Washrooms</label>
              <select
                className="shadow appearance-none border rounded w-full text-gray-500 py-2 px-3"
                value={washrooms}
                onChange={handleWashroomsChange}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6+</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-gray-500 mb-2">Description</label>
            <textarea
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500"
              rows="5"
              value={description}
              onChange={handleDescriptionChange}
            ></textarea>
          </div>
            <div className="flex items-center justify-between">
              <button
                className="text-white font-medium button-normal py-2 px-4 rounded"
                type="submit"
              >
                Save
              </button>
              <Link to={`/host-home`} >
                  <p className="text-blue-500 text-sm hover:text-blue-800">Cancel</p>
              </Link>
            </div>
          </form>
        </div>
        ) : (
          <p>Loading property details...</p>
        )}
      </div>
      </div>
    </>
  );
}

export default EditProperty;
