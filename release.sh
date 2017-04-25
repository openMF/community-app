#!/bin/bash

VERSION=$1
RELDATE=$2

if [ -z $VERSION -o -z $RELDATE ]; then
  echo -e "Version required.\nUsage: $0 version releasedate"
fi

echo "Updating version to $VERSION"

DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )
echo -e "{\n  \"version\": \"$VERSION\",\n  \"releasedate\": \"$RELDATE\"\n}\n" > $DIR/app/release.json

