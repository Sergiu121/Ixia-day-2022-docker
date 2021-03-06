FROM alpine:latest
ARG VERSION=unknown

LABEL maintainer="eduard.c.staniloiu@gmail.com" \
      name="Mqtt Clients Demo" \
      version="${VERSION}"

RUN apk update && \
    apk add mosquitto-clients
