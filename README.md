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

Out of the box, the UI will connect to the mifosng-provider REST API running on the same host/port (API_URL_OVERRIDE === 'false').
If you want to connect to the API running elsewhere, e.g. the https://demo.openmf.org running in the cloud, 
e.g. so that someone with only JS skills who couldn't be bothered about having to set up the platform back-end locally can work on the UI,
modify the constant in community-app\app\scripts\modules\configurations.js as below:

```
.constant('API_URL_OVERRIDE', 'true')
.constant('HOST','https://demo.openmf.org')
.constant('API_VERSION','/mifosng-provider/api/v1')
```

Similarly, to connect to a local server running on a different port than the web app on localhost, use:

```
.constant('API_URL_OVERRIDE', 'true')
.constant('HOST','https://localhost:8443\:8443') // need to escape port number
```

Later, it may be possible to specify the baseApiUrl as part of the app's URL, watch 
<a href="https://github.com/openMF/community-app/issues/199">Issue 199</a> (help/pull requests most welcome!). 


## Adding dependencies

You can also add more dependencies on bower.json. 
You can search for them in http://sindresorhus.com/bower-components/ or even:

```
bower search <package>
```

## Running the tests

Just open test/SpecRunner.html in the browser.



