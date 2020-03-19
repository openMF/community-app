# MifosX Community App [![Join the chat at https://gitter.im/openMF/community-app](https://badges.gitter.im/openMF/community-app.svg)](https://gitter.im/openMF/community-app?utm_source=badge&utm_medium=badge&utm_campaign=pr-badge&utm_content=badge)  [![Build Status](https://travis-ci.com/openMF/community-app.svg?branch=develop)](https://travis-ci.org/openMF/community-app)  [![Docker Hub](https://img.shields.io/docker/pulls/openmf/community-app.svg)](https://hub.docker.com/r/openmf/community-app)  [![Docker Build](https://img.shields.io/docker/cloud/build/openmf/community-app.svg)](https://hub.docker.com/r/openmf/community-app/builds)

This is the default web application built on top of the MifosX platform for the mifos user community. It is a Single-Page App (SPA) written in web standard technologies like JavaScript, CSS and HTML5. It leverages common popular frameworks/libraries such as AngularJS, Bootstrap and Font Awesome.


## Online Demo

<a target="_blank" href="https://demo.mifos.io">Access the online demo version here</a>

## Building from source

1. Ensure you have

   * ```npm``` installed - goto http://nodejs.org/download/ to download the installer for your OS.
   * ```ruby``` installed - goto https://www.ruby-lang.org/en/documentation/installation/ to download the latest version of ruby.

<br/> Note: On Ubuntu Linux you can use 'sudo apt-get install npm nodejs-legacy' (nodejs-legacy is required to avoid the ""/usr/bin/env: node: No such file or directory" problem).
<br/> Tip: If you are using Ubuntu/Linux, then doing ```npm config set prefix ~``` prevents you from having to run npm as root.

1. Clone this repository to your local filesystem (default branch is 'develop')

   ```
    git clone https://github.com/openMF/community-app.git
   ```
   
1. To download the dependencies, and be able to build, first install bower & grunt

   ```
    npm install -g bower
    npm install -g grunt-cli
   ```

1. Next pull the runtime and build time dependencies by running bower, npm, and gem bundler install commands on the project root folder

   ```
    bower install
   ```
   ```
    npm install
   ```
   ```
    gem install bundler
   ```
   ```
    bundle install
   ```

1. To preview the app, run the following command on the project root folder

   ```
    grunt serve
   ```
   or open the 'index.html' file in FIREFOX browser

   Note: If you see a warning similar to the one shown below on running `grunt serve` , try increasing the number of open files limit as per the suggestions at http://stackoverflow.com/questions/34588/how-do-i-change-the-number-of-open-files-limit-in-linux/

   ```
    Waiting...Warning: EMFILE, too many open files

   ```
   
1. You can use these credentials to log in

   ```
    Username: mifos
    Password: password
   ```

You are done.

### Connecting to a MifosX Platform using OAuth 2 authentication:

Edit the value of property "security" in <a href="https://github.com/openMF/community-app/blob/develop/app/scripts/modules/configurations.js#L6">configurations.js</a> to "oauth"

### Connecting to a MifosX Platform running on a different host:

By default, when the app is running from the local filesystem, it will connect to the platform (fineract-provider REST API) deployed on demo.mifos.io.

The app connects to the platform running on the same host/port when deployed on a server.

If you want to connect to the API running elsewhere, then append the baseApiUrl and tenantIdentifier as query parameters,

e.g. http://localhost:9002/?baseApiUrl=https://localhost:8443&tenantIdentifier=default

e.g. http://localhost:9002/?baseApiUrl=https://demo.mifos.io&tenantIdentifier=default

## Adding dependencies

You can also add more dependencies on bower.json.
You can search for them in http://sindresorhus.com/bower-components/ or even:

```
bower search <package>
```

## Running grunt tasks

Grunt tasks are used to automate repetitive tasks like minification, compilation, unit testing, linting, production builds, etc

Following are the tasks integrated.

### Validate JS and HTML files

Validate the JS files to detect errors and potential problems in JavaScript code. All errors output will be written to jshint-log.xml file which get created under project base directory.
Checks the markup validity of HTML files. All errors output will be written to console.

```
grunt validate
```

### Build

Build the code for production deployment.

```
grunt prod
```

### Serve

Use this for development.
Start a static server and open the project in the default browser. The application will hit the demo server.

```
grunt serve
```

### Docker
To build a Docker image for the current repo, run:
```
docker build -t mifos-community-app .
```
You can then run a Docker Container from the image above like this:
```
docker run --name mifos-ui -it -d -p 80:80 mifos-community-app
```

Access the webapp on http://localhost in your browser.
The Dockerfile uses a ruby and node base image to build the current repo and deploys the app on nginx which is exposed
on port 80 within the container.

### Compile sass to css

```
grunt compass:dev
```
## Running the tests

Just open test/SpecRunner.html in the browser.

## Getting Started doc

https://docs.google.com/document/d/1oXQ2mNojyDFkY_x4RBRPaqS-xhpnDE9coQnbmI3Pobw/edit#heading=h.vhgp8hu9moqn

## Contribution guidelines

Please read the <a href="https://github.com/openMF/community-app/blob/develop/Contributing.md" >contribution guidelines</a>

Note: This application will hit the demo server by default.
