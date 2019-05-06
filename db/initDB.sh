#!/bin/sh

find /opt/db/data -name "*.csv" -exec sed -i -e "s/\${WEB_HEADER}/${WEB_HEADER}/g" {} \;

cd /opt/db

node /opt/db/initDB.js

