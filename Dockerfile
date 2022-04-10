FROM node:lts-alpine

# pass N8N_VERSION Argument while building or use default
#ARG N8N_VERSION=0.166.0

# Update everything and install needed dependencies
RUN apk add --update graphicsmagick tzdata

# Set a custom user to not have n8n run as root
USER root

# Install and the also temporary all the packages
# it needs to build it correctly.


RUN apk --update add --virtual build-dependencies python3 build-base && \
	npm_config_user=root npm install -g n8n@${N8N_VERSION} && \
	apk del build-dependencies

CD twake
docker-compose -f docker-compose.onpremise.mongo.yml up -d

# Specifying work directory
WORKDIR /data

# copy start script to container
COPY ./twake/start.sh /

# make the script executable
RUN chmod +x /start.sh

# define execution entrypoint
CMD ["/start.sh"]
