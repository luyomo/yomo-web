#!/bin/bash

set -e

# Database Initilization
## Replace variable to the config file(/yomo-web/app/etc/config.yaml)
### REPLACE 

# Update web-bg

test_set_env_01(){
  export WEB_FRONT_PORT=8888
  export WEB_BACKEND_PORT=8889
  export PG_HOST=SET_HOST
  export PG_PORT=8890
  export PG_DATABASE=SET_DATABASE
  export PG_USER=SET_USER
  export PG_PASSWORD=SET_PASSWORD
  export REDIS_PORT=8891
  export REDIS_HOST=SET_REDIS_HOST
}

test_set_env_02(){
  export WEB_FRONT_PORT=8888
  export WEB_BACKEND_PORT=8889
  export PG_HOST=localhost
  export PG_PORT=25432
  export PG_DATABASE=yomo
  export PG_USER=yomo
  export PG_PASSWORD=yomo
  export REDIS_PORT=8891
  export REDIS_HOST=SET_REDIS_HOST
  export WEB_HEADER=SET_HEADER
}

update_config(){
  sed -i -e "s/\${WEB_FRONT_PORT}/${WEB_FRONT_PORT:=8083}/g"     /app/etc/config.yaml
  sed -i -e "s/\${WEB_BACKEND_PORT}/${WEB_BACKEND_PORT:=8084}/g" /app/etc/config.yaml
  sed -i -e "s/\${PG_HOST}/${PG_HOST:=pg}/g"                     /app/etc/config.yaml
  sed -i -e "s/\${PG_PORT}/${PG_PORT:=5432}/g"                   /app/etc/config.yaml
  sed -i -e "s/\${PG_DATABASE}/${PG_DATABASE:=yomo}/g"           /app/etc/config.yaml
  sed -i -e "s/\${PG_USER}/${PG_USER:=yomo}/g"                   /app/etc/config.yaml
  sed -i -e "s/\${PG_PASSWORD}/${PG_PASSWORD:=yomo}/g"           /app/etc/config.yaml
  sed -i -e "s/\${REDIS_PORT}/${REDIS_PORT:=6379}/g"             /app/etc/config.yaml
  sed -i -e "s/\${REDIS_HOST}/${REDIS_HOST:=redis}/g"            /app/etc/config.yaml
  sed -i -e "s/\${API_KEY}/${API_KEY:=none}/g"                   /app/etc/config.yaml
  sed -i -e "s/\${CLIENT_ID}/${CLIENT_ID:=none}/g"               /app/etc/config.yaml
}

#run_db(){
#  PGPASSWORD=${PG_PASSWORD} psql -h ${PG_HOST} -p ${PG_PORT} -d ${PG_DATABASE} -U ${PG_USER} $1 "$2"
#}

#init_db(){
##  run_db -c 'select count(*) from pg_class'
##  run_db '-f test.sql'
#  run_db '-f /app/db/backup/yomo.ddl'
#  run_db -c "update vw_cmpt_conf set value = replace(value, 'web-bg', '${WEB_HEADER:=web-bg}') where value ~ 'web-bg'"
#}

case "$1" in
  "start") update_config 
           /app/startService.sh 
    echo "starting the service " ;;
  "init") update_config
     /opt/db/initDB.sh
esac

#exec "$@"
