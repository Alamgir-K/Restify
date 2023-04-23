#!/bin/bash

# Django Backend Setup
sudo apt-get update
sudo apt-get install -y python3 python3-pip

python3 -m venv env
source env/bin/activate

pip3 install -r backend/requirements.txt

python3 backend/manage.py makemigrations
python3 backend/manage.py migrate
python3 backend/manage.py loaddata backend/db.json

# React Frontend Setup
sudo apt-get install -y nodejs npm

npm install --prefix frontend/restify