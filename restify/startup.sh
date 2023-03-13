#!/bin/bash

# Update package list and install Python3 and pip3
sudo apt-get update
sudo apt-get install -y python3 python3-pip

# Create and activate virtual environment
python3 -m venv env
source env/bin/activate

# Install required packages
pip3 install django-multiselectfield
pip3 install -r requirements.txt

# Run database migrations
python3 manage.py makemigrations
python3 manage.py migrate


