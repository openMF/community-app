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
Out of the box, the UI will connect to the MifosX Platform running on the *same* host/port because 
the default value of API_URL_OVERRIDE is set to *false* in the configuration.js file.
If you want to connect to a MifosX Platform running on a different host, e.g. the https://demo.openmf.org running in the cloud, 
then modify the configuration API_URL_OVERRIDE and HOST in 
```
community-app\app\scripts\modules\configurations.js 
```

as below:

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

## Guidelines for development

* Before sending PR, do code quality check using JSHint
* For adding locale, follow the guidelines given in this wiki (<a href="https://github.com/openMF/community-app/wiki/User-Interface-Guidelines:-Capitalization">link</a>)



