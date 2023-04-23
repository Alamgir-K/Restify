import React, { useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Navbar from './navbar.jsx';
import '../css/style2.css';
import '../css/tailwind.css'
import { useContext } from "react";
import AuthContext from "../AuthContext";


const CommentCreate = () => {

    const { reservationId } = useParams();
    const { token } = useContext(AuthContext);

    const UploadComment = ({ reservationId }) => {
        const [rating, setRating] = useState('');
        const [comment, setComment] = useState('');
        const [errormsg, setErrormsg] = useState('');

        const handleSubmit = async (e) => {
            e.preventDefault();

            try {
                const headers = { Authorization: `Bearer ${token}` };
                await axios.post('http://127.0.0.1:8000/api/comment/create/', 
                {
                    reservation: reservationId,
                    Rating: rating,
                    comment: comment,
                }
                , { headers });

                // Clear form fields and error message
                setRating('');
                setComment('');
                setErrormsg("Successfully created comment");
            } catch (error) {
                setErrormsg(error.response.data.error);
                console.log(error);
            }
        };

        return (
            <div className="create-comment-container">
              <form onSubmit={(e) => handleSubmit(e, reservationId)} className="create-comment-form">
                <h2 className="text-3xl font-semibold mb-6">Create Comment</h2>
                {errormsg && <p className="text-red-500 mb-4">{errormsg}</p>}
                <div className="mb-6">
                  <label htmlFor="rating" className="block text-gray-700 mb-2">Rating:</label>
                  <input
                    type="number"
                    id="rating"
                    name="rating"
                    min="0"
                    max="5"
                    value={rating}
                    onChange={(e) => setRating(e.target.value)}
                    className="border border-gray-300 p-2 w-full rounded"
                  />
                </div>
                <div className="mb-6">
                  <label htmlFor="comment" className="block text-gray-700 mb-2">Comment:</label>
                  <textarea
                    id="comment"
                    name="comment"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="border border-gray-300 p-2 w-full h-48 rounded resize-none"
                  ></textarea>
                </div>
                <button type="submit" className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700">Submit</button>
              </form>
            </div>
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <UploadComment reservationId={reservationId} />

            <div className="mt-auto footer">
                <p>Copyright @2023 CSC309</p>
            </div>
        </div>
    );

};

export default CommentCreate;