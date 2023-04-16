import React, { useState } from 'react';
import NavBar from './NavBar';


function NewProperty() {
  const [imageList, setImageList] = useState([]);
  const [rateRows, setRateRows] = useState([{ from: '', to: '', cost: '' }]);
  const [title, setTitle] = useState('');
  const [isListed, setIsListed] = useState(true);
  const [address, setAddress] = useState('');
  const [guestsAllowed, setGuestsAllowed] = useState(1);
  const [beds, setBeds] = useState(1);
  const [washrooms, setWashrooms] = useState(1);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);

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
  

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setImageList([...imageList, reader.result]);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('submit');
  };

  return (
    <>

      <div className="bg-beige h-screen">

        <NavBar />

        <div className="bg-beige h-screen">
        <div className="container mx-auto">
          <h1 className="font-semibold mb-6 text-3xl">New Property</h1>
          <form className="bg-white shadow-md rounded px-6 pt-8" onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-500 mb-2" htmlFor="title">Title</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500"
                id="title"
                placeholder="Title"
                onChange={handleTitleChange}
              />
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
            <div className="mb-4">
              <label className="block text-gray-500 mb-2" htmlFor="price">Price per night</label>
              <input
                type="number"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500"
                id="price"
                placeholder="Price per night"
                onChange={handlePriceChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-500 mb-2" htmlFor="location">Location</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500"
                id="location"
                placeholder="Location"
                onChange={handleLocationChange}
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-500 mb-2" htmlFor="imageUrl">Image URL</label>
              <input
                type="text"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-500"
                id="imageUrl"
                placeholder="Image URL"
                onChange={handleImageUpload}
              />
            </div>
            <div className="flex items-center justify-between">
              <button
                className="text-white font-medium button-normal py-2 px-4 rounded"
                type="submit"
              >
                Save
              </button>
              <a className="text-blue-500 text-sm hover:text-blue-800" href="host_property.html">
                Cancel
              </a>
            </div>
          </form>
        </div>
      </div>
      </div>
    </>
  );
}

export default NewProperty;
