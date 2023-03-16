#!/bin/bash

sudo apt-get update
sudo apt-get install -y python3 python3-pip

python3 -m venv env
source env/bin/activate

pip3 install -r restify/requirements.txt

python3 restify/manage.py makemigrations
python3 restify/manage.py migrate


