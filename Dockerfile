FROM yomo-node:11 as builder

ADD /app /app

ARG http_proxy=http://10.136.0.60:8080
ARG https_proxy=http://10.136.0.60:8080

RUN mkdir -p /opt/lib/frontend/node_modules && ln -s /app/frontend/package.json /opt/lib/frontend/package.json && npm install --prefix /opt/lib/frontend && rm /opt/lib/frontend/package.json

RUN mkdir -p /opt/lib/backend/node_modules  && ln -s /app/backend/package.json  /opt/lib/backend/package.json  && npm install --prefix /opt/lib/backend  && rm /opt/lib/backend/package.json

FROM yomo-node:11

#ENV http_proxy=http://10.136.0.60:8080 https_proxy=http://10.136.0.60:8080 NODE_PATH=/app/frontend/lib:/app/node_modules
ENV NODE_PATH=/app/frontend/lib:/app/backend/lib:/opt/lib/frontend/node_modules:/opt/lib/backend/node_modules

COPY --from=builder /app /app
COPY --from=builder /opt/lib /opt/lib
COPY db /opt/db

RUN ln -s /opt/lib/frontend/node_modules /app/frontend/node_modules

ENTRYPOINT ["/app/docker-entrypoint.sh"]

CMD ["start"]
