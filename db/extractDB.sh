#!/bin/sh

find /opt/db/ddl -name "*.ddl" -exec rm {} \;

find /opt/db/data -name "*.csv" -exec rm {} \;

node /opt/db/extractDB.js

find /opt/db/data -name "*.csv" -exec sed -i -e "s/${WEB_HEADER}/\${WEB_HEADER}/g" {} \;
