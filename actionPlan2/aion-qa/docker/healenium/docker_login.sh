#!/bin/bash
set -e
if [ -f .env ]; then
    export $(cat .env | grep -v '^#' | xargs)
fi
echo "Logging in to Docker Hub..."
echo "$DOCKER_TOKEN" | docker login -u "$DOCKER_USERNAME" --password-stdin
echo "✅ Docker login successful"
