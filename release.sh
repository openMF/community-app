#!/bin/bash

VERSION=$1

if [ -z $VERSION ]; then
  echo -e "Version required.\nUsage: $0 version"
fi

echo "Updating version to $VERSION"
echo $VERSION > app/VERSION.txt

