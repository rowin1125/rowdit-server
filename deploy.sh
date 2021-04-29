#!/bin/bash

echo What should the version be
read VERSION

docker build -t rowin1125/rowdit:$VERSION .
docker push rowin1125/rowdit:$VERSION
ssh root@188.166.68.218 "docker pull rowin1125/rowdit:$VERSION && docker tag rowin1125/rowdit:$VERSION dokku/api:$VERSION && dokku deploy api $VERSION"
