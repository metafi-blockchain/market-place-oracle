

docker buildx build --platform linux/amd64 -t roster90/enteral-kingdom-api:0.1.5 --load .

docker buildx build --platform linux/amd64,linux/arm64 -t roster90/enteral-kingdom-api:0.1.5 --push .

docker push roster90/enteral-kingdom-api:0.1.5