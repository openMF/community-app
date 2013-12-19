# MifosX Community App

This is the default web application built on top of the MifosX platform for the mifos user community. It is a Single-Page App (SPA) written in web standard technologies like JavaScript, CSS and HTML5. It leverages common popular frameworks/libraries such as AngularJS, Bootstrap and Font Awesome.

## Build Status

Travis

[![Build Status](https://travis-ci.org/openMF/community-app.png?branch=master)](https://travis-ci.org/openMF/community-app)

## Online Demo

<a target="_blank" href="https://demo.openmf.org/beta">Access the online demo version here</a>


## Building from source

1. Note: Ensure you have ```npm``` installed - goto http://nodejs.org/download/ to downloand installer for your OS.

2. Clone this repository to your local filesystem (default branch in 'master')

3. To download the dependencies, and be able to build, first install bower & grunt:
```
npm install -g bower
npm install -g grunt-cli
```
4. Next pull the runtime and build time dependencies by running bower and npm install commands on the project root folder:
```
 bower install
```
```
 npm install 
```

5. Check the backend server HOST settings in the community-app\app\scripts\modules\configuration.js file. If you are connecting to a non local host, then you may need to change the API_URL_OVERRIDE value to *false*.

6. Now open the 'index.html' file in FIREFOX browser. 

7. Default username/password: mifos/password. This application will hit the demo server by default.

You are done.

### Connecting to a MifosX Platform running on a different host:

By default, when the app is running in the local filesystem or on http://localhost, it will connect to demo.openmf.org.
The UI will connect to the mifosng-provider REST API running on the same host/port when running in the cloud.

If you want to connect to the API running elsewhere, then append the baseApiUrl as a query parameter,
e.g. http://localhost:9090/app/index.html?baseApiUrl=https://localhost:8443/#/.

## Adding dependencies

You can also add more dependencies on bower.json. 
You can search for them in http://sindresorhus.com/bower-components/ or even:

```
bower search <package>
```

## Running grunt tasks

Grunt tasks are used to automate repetitive tasks like minification, compilation, unit testing, linting, production builds, etc

Following are the tasks integrated.

### Compilation

Compile the JS files to detect errors and potential problems in JavaScript code. All errors output will be written to jshint-log.xml file which get created under project base directory.

```
grunt compile
```

### Build

Build the code for production deployment.

```
grunt prod
```


## Running the tests

Just open test/SpecRunner.html in the browser.

## Contribution guidelines

Please read the <a href="https://github.com/openMF/community-app/blob/master/Contributing.md" >contribution guidelines</a>

