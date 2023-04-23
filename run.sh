#!/bin/bash

# Start Django backend server
python3 backend/manage.py runserver &

# Start React frontend server
npm start --prefix frontend/restify &

# Wait for all background processes to complete
wait