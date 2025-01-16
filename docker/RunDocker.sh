#!/bin/bash

# Set variables for the image name and container name
IMAGE_NAME="forum-backend"
CONTAINER_NAME="forum-backend"
PATH_TO_DOCKERFILE="docker/Dockerfile"

# Build the Docker image from the Dockerfile
echo "Building new Docker image: $IMAGE_NAME"

# example : docker build -t forum-backend -f docker/backend/Dockerfile .
docker build -t $IMAGE_NAME -f $PATH_TO_DOCKERFILE .

# Run a container from the newly built image
echo "Running container: $CONTAINER_NAME"

# example : docker run -d -p 8080:8080 --name forum-backend forum-backend
docker run -d -p 8080:8080 --name $CONTAINER_NAME $IMAGE_NAME

echo "Script completed."