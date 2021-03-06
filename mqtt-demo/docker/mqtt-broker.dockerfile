FROM alpine:latest
ARG VERSION=unknown

LABEL maintainer="eduard.c.staniloiu@gmail.com" \
      name="Mqtt Broker Demo" \
      version="${VERSION}"

RUN apk update && \
    apk add mosquitto
