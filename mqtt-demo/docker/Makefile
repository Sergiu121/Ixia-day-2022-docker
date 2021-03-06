run:
	docker-compose up -d

build_all: build_broker build_subscriber build_publisher

build_broker:
	docker-compose build mqtt-broker

start_broker: build_broker
	docker run -it --name mqtt-broker docker_mqtt-broker:latest /bin/ash

build_subscriber:
	docker-compose build mqtt-subscriber

start_subscriber: build_subscriber
	docker run -it --name mqtt-subscriber docker_mqtt-subscriber:latest /bin/ash

build_publisher:
	docker-compose build mqtt-publisher

start_publisher: build_publisher
	docker run -it --name mqtt-publisher docker_mqtt-publisher:latest /bin/ash

.PHONY: clean
clean:
	docker rm -f `docker ps -a | grep "docker_mqtt" | cut -f "1" -d ' '`
	docker image rm -f `docker image ls | grep "docker_mqtt" | tr -s ' ' | cut -f "3" -d ' '`
