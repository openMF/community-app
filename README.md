## Online Demo

<a target="_blank" href="https://demo.openmf.org/prototype-app/app/">Access the online demo version here</a>


## Building from source

1. Note: Ensure you have ```npm``` installed - goto http://nodejs.org/download/ to downloand installer for your OS.

2. Clone this respository to your local filesystem

3. To download the dependencies, and be able to build, first install bower & grunt:

```
npm install -g bower
npm install -g grunt-cli
```

4. Next pull the runtime and build time dependencies by running bower and npm install on the project root folder:

```
bower install
npm install
```

Done.

## Adding dependencies

You can also add more dependencies on bower.json. 
You can search for them in http://sindresorhus.com/bower-components/ or even:

```
bower search <package>
```

## Running the tests

Just open test/SpecRunner.html in the browser.



