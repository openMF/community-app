#!/bin/bash

# Exit the script if any command returns a non-true return value (http://www.davidpashley.com/articles/writing-robust-shell-scripts/)
set -e

# sudo apt-get install npm nodejs-legacy
# npm config set prefix ~

npm install -g grunt-cli
npm install -g bower
bower install
npm install
grunt prod
