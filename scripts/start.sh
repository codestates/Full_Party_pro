#!/bin/bash
cd /home/ubuntu/Full_Party_pro/server
authbind --deep pm2 start --interpreter ./node_modules/.bin/ts-node app.ts