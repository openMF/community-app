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
 "bower install"
```
```
 "npm install" 
```
5. Now open the 'index.html' file in FIREFOX browser. 

6. Default username/password: mifos/password. This application will hit the demo server by default.

You are done.

By default, when the app is running in the local filesystem, it will connect to demo.openmf.org.
The UI will connect to the mifosng-provider REST API running on the same host/port when running in the cloud.

If you want to connect to the API running elsewhere, e.g. the https://xyz.org or https://localhost:8443, 
append the baseApiUrl as a query parameter. 
Ex:-  /index.html?baseApiUrl=https://localhost:8443
      /index.html?baseApiUrl=https://xyz.org

## Adding dependencies

You can also add more dependencies on bower.json. 
You can search for them in http://sindresorhus.com/bower-components/ or even:

```
bower search <package>
```

## Running the tests

Just open test/SpecRunner.html in the browser.



