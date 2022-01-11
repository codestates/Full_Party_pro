#!/bin/bash
cd /home/ubuntu/Full_Party_pro/server
npm install
npm install -g pm2@latest
sudo apt-get update
sudo apt-get install authbind
sudo touch /etc/authbind/byport/443
sudo chown ubuntu /etc/authbind/byport/443
sudo chmod 755 /etc/authbind/byport/443