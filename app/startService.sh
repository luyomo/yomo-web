#!/bin/sh

#if [ -z $PG_HOST ]; then export PG_HOST="localhost"; fi
#if [ -z $PG_PORT ]; then export PG_PORT=5432; fi
#if [ -z $PG_DATABASE ]; then export PG_DATABASE="yomo"; fi
#if [ -z $PG_USER ]; then export PG_USER="yomo"; fi
#if [ -z $PG_PASSWORD ]; then export PG_PASSWORD="yomo"; fi
#if [ -z $REDIS_PORT ]; then export REDIS_PORT=6379; fi
#if [ -z $REDIS_HOST ]; then export REDIS_HOST="redis"; fi
#
#sed -i -e s/PG_HOST/$PG_HOST/g /app/etc/config.yaml
#sed -i -e s/PG_PORT/$PG_PORT/g /app/etc/config.yaml
#sed -i -e s/PG_DATABASE/$PG_DATABASE/g /app/etc/config.yaml
#sed -i -e s/PG_USER/$PG_USER/g /app/etc/config.yaml
#sed -i -e s/PG_PASSWORD/$PG_PASSWORD/g /app/etc/config.yaml
#sed -i -e s/REDIS_PORT/$REDIS_PORT/g /app/etc/config.yaml
#sed -i -e s/REDIS_HOST/$REDIS_HOST/g /app/etc/config.yaml

cd /app/frontend
node index.js & 
cd /app/backend
node index.js
