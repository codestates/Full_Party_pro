#!/bin/bash
cd /home/ubuntu/Full_Party_pro/server
pm2 stop app.ts 2> /dev/null || true
pm2 delete app.ts 2> /dev/null || true