import React, { useState } from 'react';
import NavBar from './navbar';
import '../css/style.css';
import { Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../AuthContext';
import { useContext } from 'react';

function NewProperty() {
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

  function handleListedChange(e) {
    setIsListed(e.target.checked);
  }

  function handleAddressChange(e) {
    setAddress(e.target.value);
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
      const response = await axios.post('http://localhost:8000/api/property/create/', {
        name: title,
        address: address,
        city: 'Toronto',
        country: 'Canada',
        price: price,
        max_guests: guestsAllowed,
        beds: beds,
        baths: washrooms,
        description: description,
        main_image: imageList[0]
      }, { headers });
  
      console.log(response.data);
    } catch (error) {
      console.error(error.response.data);
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
                placeholder="Title"
                onChange={handleTitleChange}
              />
            </div>
            <div className="flex items-center w-1/5 p-4">
              <div className="flex-col">
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
            </div>
          </div>
          <div className="flex flex-wrap">
            {/* Step 3: Display each image in a row using map */}
            {imageList.map((url, index) => (
              <div key={index} className="relative w-64 h-64 mr-4 mb-4">
                <img src={url} alt={`House Image ${index}`} />
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
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="text" 
              onChange={handleLocationChange}/>
              
            </div>
            <div className="w-3/6 flex-col p-4">
              <label className="block text-gray-700 font-medium mb-2 text-left">Cost Per Night</label>
              <input className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700" type="number" 
              onChange={handlePriceChange}/>
            </div>
            <div className="w-1/4 flex-col p-4">
              <label className="block text-gray-700 font-medium mb-2 text-left">Max Guests</label>
              <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
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
                onChange={handleGuestsAllowedChange}
              </select>
            </div>
            <div className="w-1/4 flex-col p-4">
              <label className="block text-gray-700 font-medium mb-2 text-left">Beds</label>
              <select className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700">
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8+</option>
                onChange={handleBedsChange}
              </select>
            </div>
            <div className="w-1/4 flex-col p-4">
              <label className="block text-gray-700 font-medium mb-2 text-left">Washrooms</label>
              <select className="shadow appearance-none border rounded w-full text-gray-500 py-2 px-3">
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6+</option>
                onChange={handleWashroomsChange}
              </select>
            </div>
          </div>
            <div className="mb-4">
              <label className="block text-gray-500 mb-2">Description</label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500"
                rows="5"
                placeholder="Description"
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
