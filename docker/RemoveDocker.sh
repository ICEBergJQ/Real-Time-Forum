#!/bin/bash

# Set variables
IMAGE_NAME="forum-backend"
CONTAINER_NAME="forum-backend"
PATH_TO_DOCKERFILE="docker/Dockerfile"

# Check if the container already exists and stop/remove it
if [ "$(docker ps -aq -f name=$CONTAINER_NAME)" ]; then
  echo "Stopping and removing existing container: $CONTAINER_NAME"
  docker stop $CONTAINER_NAME
  docker rm $CONTAINER_NAME
else
  echo "No container found with the name $CONTAINER_NAME."
fi

# Check if the image exists and remove it
if [ "$(docker images -q $IMAGE_NAME)" ]; then
  echo "Removing Docker image: $IMAGE_NAME"
  docker rmi $IMAGE_NAME
else
  echo "No image found with the name $IMAGE_NAME."
fi

echo "\nScript completed."

