version=0.1

IMG_NAME=react
CONTAINER_NAME=react-tut

build:
	docker image build -t ${IMG_NAME}:${version} --build-arg VERSION=${version} .

test: build
	docker run --rm --name ${CONTAINER_NAME} ${IMG_NAME}:${version}

run: build
	docker run -it -p 3000:3000 \
		--name ${CONTAINER_NAME} \
		--mount type=bind,src=`pwd`/../app,dst=/usr/src/app \
		${IMG_NAME}:${version} \
		/bin/bash

bash:
	docker exec -it ${CONTAINER_NAME} /bin/bash

clean:
	docker rm -f ${CONTAINER_NAME}
	docker image rm ${IMG_NAME}:${version}
