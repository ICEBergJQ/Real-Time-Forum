#!/bin/bash

# Set variables for the image name and container name
IMAGE_NAME="forum-backend"
CONTAINER_NAME="forum-backend"
PATH_TO_DOCKERFILE="docker/Dockerfile"

# Check if the container already exists and stop/remove it
echo -e "\n$(printf '=%.0s' {1..85})\n"
if [ "$(docker ps -a -f name=$CONTAINER_NAME)" ]; then
  echo "Stopping and removing existing container: $CONTAINER_NAME"
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME
  docker system prune -a
else
  echo "No container found with the name $CONTAINER_NAME."
fi

echo -e "\n$(printf '=%.0s' {1..85})\n"

# Build the Docker image from the Dockerfile
echo "Building new Docker image: $IMAGE_NAME"
docker build -t $IMAGE_NAME -f $PATH_TO_DOCKERFILE .

echo -e "\n$(printf '=%.0s' {1..85})\n"

# Run a container from the newly built image
echo "Running container: $CONTAINER_NAME"
docker run -d -p 8080:8080 --name $CONTAINER_NAME $IMAGE_NAME

echo -e "\n$(printf '=%.0s' {1..85})\n"

# Check if the image exists and remove it
if [ "$(docker images $IMAGE_NAME)" ]; then
  echo "Removing Docker image: $IMAGE_NAME"
  docker rmi -f $IMAGE_NAME
  docker system prune -a

else
  echo "No image found with the name $IMAGE_NAME."
fi

echo -e "\n$(printf '=%.0s' {1..85})\n"
echo "Script completed."
echo -e "\n$(printf '=%.0s' {1..85})\n"
