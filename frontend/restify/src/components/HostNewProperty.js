import React, { useState, useEffect, useContext } from "react";
import NavBar from "./navbar";
import "../css/style.css";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import AuthContext from "../AuthContext";

function NewProperty() {
  const [propertyDetails, setPropertyDetails] = useState(null);
  const { id } = useParams();

  const [amenities, setAmenities] = useState([]);
  const [currentAmenity, setCurrentAmenity] = useState("");
  const [mainImage, setMainImage] = useState(null);
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
  const removeMainImage = () => {
    setMainImage(null);
  };
  

const handleMainImageChange = (e) => {
  if (e.target.files && e.target.files[0]) {
    setMainImage(URL.createObjectURL(e.target.files[0]));
  }
};

const handleFileChange = (e, index) => {
  if (e.target.files && e.target.files[0]) {
    const newImageList = [...imageList];
    newImageList[index] = URL.createObjectURL(e.target.files[0]);
    setImageList(newImageList);
  }
};

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
      formData.append("name", title);
      formData.append("address", address);
      formData.append("city", 'Toronto');
      formData.append("country", 'Canada');
      formData.append("price", price);
      formData.append("max_guests", guestsAllowed);
      formData.append("beds", beds);
      formData.append("baths", washrooms);
      formData.append("description", description);

      console.log("amenities: ", amenities);

      amenities.forEach((item, index) => {
        formData.append('amenities', item);
      });

      const fileInput1 = document.getElementById("fileInput1");
  
      if (fileInput1.files[0]) {
        formData.append("main_image", fileInput1.files[0]);
      }

      const fileInput2 = document.getElementById("fileInput2");
  
      if (fileInput2.files[0]) {
        formData.append("img1", fileInput2.files[0]);
      }

      const fileInput3 = document.getElementById("fileInput3");
  
      if (fileInput3.files[0]) {
        formData.append("img2", fileInput3.files[0]);
      }

      const fileInput4 = document.getElementById("fileInput4");
  
      if (fileInput4.files[0]) {
        formData.append("img3", fileInput4.files[0]);
      }

      const fileInput5 = document.getElementById("fileInput5");
  
      if (fileInput5.files[0]) {
        formData.append("img4", fileInput5.files[0]);
      }
  
      const response = await axios.post(
        'http://localhost:8000/api/property/create/',
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(response);
      window.location.reload();
    } catch (error) {
      console.error(error);
    }
  };  
  

  return (
    <>
      <div className="bg-beige h-screen">

        <NavBar />

        <div className="bg-beige h-screen">
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
                        onClick={(e) => {
                          e.preventDefault();
                          removeAmenity(index);
                        }}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
            </div>
          </div>
          <div className="flex flex-wrap">
            <div className="relative w-48 h-64 mr-4 mb-4">
              <img
                src={mainImage ? mainImage : "https://via.placeholder.com/400x300"}
                alt="House Image 1"
              />
                <button
                  className="absolute top-0 right-0 text-red-500 hover:text-red-800 text-2xl p-2"
                  onClick={() => removeMainImage()}
                >
                  ×
                </button>
                  <label
                    htmlFor="fileInput1"
                    className="absolute bottom-0 left-0 text-green-500 hover:text-green-800 text-3xl p-2 cursor-pointer"
                  >
                    +
                  </label>
                  <input
                    type="file"
                    id="fileInput1"
                    name="fileInput1"
                    className="hidden"
                    onChange={(e) => handleMainImageChange(e)}
                  />
            </div>
            <div className="relative w-48 h-64 mr-4 mb-4">
              <img
                src={imageList[0] ? imageList[0] : "https://via.placeholder.com/400x300"}
                alt="House Image 2"
              />
                <button
                  className="absolute top-0 right-0 text-red-500 hover:text-red-800 text-2xl p-2"
                  onClick={() => removeImage(0)}
                >
                  ×
                </button>
                  <label
                    htmlFor="fileInput2"
                    className="absolute bottom-0 left-0 text-green-500 hover:text-green-800 text-3xl p-2 cursor-pointer"
                  >
                    +
                  </label>
                  <input
                    type="file"
                    id="fileInput2"
                    name="fileInput2"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 0)}
                  />
            </div>
            <div className="relative w-48 h-64 mr-4 mb-4">
              <img
                src={imageList[1] ? imageList[1] : "https://via.placeholder.com/400x300"}
                alt="House Image 3"
              />
                <button
                  className="absolute top-0 right-0 text-red-500 hover:text-red-800 text-2xl p-2"
                  onClick={() => removeImage(1)}
                >
                  ×
                </button>
                  <label
                    htmlFor="fileInput3"
                    className="absolute bottom-0 left-0 text-green-500 hover:text-green-800 text-3xl p-2 cursor-pointer"
                  >
                    +
                  </label>
                  <input
                    type="file"
                    id="fileInput3"
                    name="fileInput3"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 1)}
                  />
            </div>
            <div className="relative w-48 h-64 mr-4 mb-4">
              <img
                src={imageList[2] ? imageList[2] : "https://via.placeholder.com/400x300"}
                alt="House Image 4"
              />
                <button
                  className="absolute top-0 right-0 text-red-500 hover:text-red-800 text-2xl p-2"
                  onClick={() => removeImage(2)}
                >
                  ×
                </button>
                  <label
                    htmlFor="fileInput4"
                    className="absolute bottom-0 left-0 text-green-500 hover:text-green-800 text-3xl p-2 cursor-pointer"
                  >
                    +
                  </label>
                  <input
                    type="file"
                    id="fileInput4"
                    name="fileInput4"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 2)}
                  />
            </div>
            <div className="relative w-48 h-64 mr-4 mb-4">
              <img
                src={imageList[3] ? imageList[3] : "https://via.placeholder.com/400x300"}
                alt="House Image 5"
              />
                <button
                  className="absolute top-0 right-0 text-red-500 hover:text-red-800 text-2xl p-2"
                  onClick={() => removeImage(3)}
                >
                  ×
                </button>
                  <label
                    htmlFor="fileInput5"
                    className="absolute bottom-0 left-0 text-green-500 hover:text-green-800 text-3xl p-2 cursor-pointer"
                  >
                    +
                  </label>
                  <input
                    type="file"
                    id="fileInput5"
                    name="fileInput5"
                    className="hidden"
                    onChange={(e) => handleFileChange(e, 3)}
                  />
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
      </div>
      </div>
    </>
  );
}

export default NewProperty;
