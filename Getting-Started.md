# Mifos X Community App
https://github.com/openMF/mifosx

This is the default web application built on top of the MifosX platform for the mifos user community. It is a Single-Page App (SPA) written in web standard technologies like JavaScript, CSS,  and HTML5. It leverages common popular frameworks/libraries such as AngularJS, Bootstrap and Font Awesome.

I will be here going through the community-app code mainly as many developers and, students have asked about how they can start working on community-app as our application structure is a bit different. About installation and setting up the application there is already much discussion on mailing lists and you can follow the github Readme file.
Codebaseco
We are using AngularJS and requirejs in our application so that we have proper code organization. Some of the advantages of going this direction include;way are we don’t have to worry about including script tags in the right order when building Angular app and. Also, here we can manually bootstrap our AangularJS application. Some Important Files
app/index.html
	This is the first file you will start with usually. Here we have the code for the login page and sidenav. So, any changes you want to do in these components it can be directly done here. Also, you will see a script tag below in body of require js.

<script type='text/javascript' data-main="scripts/loader.js" src='bower_components/requirejs/require.js'></script>

## app/scripts/loader.js



	Here you will find requirejs config. In paths, we set aliases for the libraries and plugins used and, then we defined that angular should be shimmed. You will see a deps variable which mentioned says that specific plugin’s dependency. For example: webcam-directive needs angularjs library to load before that. Next, you will see that the angular application is manually bootstrapped rather than using ng-app syntax where you usually see it's done like this belowangular.bootstrap(document, ['MifosX_Application']);

## app/scripts/MifosX.js



	Here you will find all the dependency injections for third-party components. Make sure that when you add any library, you inject it here. 

## app/scripts/MifosXComponents.js



	Here you will find all controllers, services, filters,  and directive of the application defined. If you have to add a new controller, service, filter or directive, just mention it here and it will be loaded in your application. 

## app/scripts/MifosXStyles.js



Here all the styles files are defined. 

## app/scripts/routes.js



	As the file name suggests, all the application routes are defined here with their template Url. 

## app/scripts/initialTasks.js



	As, the file name suggests, all the application initial tasks like setting HTTP header, setting baseurl, and localisation are found here..

## app/styles-dev/main/



	The stylesheet of the application is built using the sass preprocessor automated system. All application styling should be done inside this folder.

## app/styles/styles.css



	This is the stylesheet file generated after css processing. This file should not be edited because it is overwritten each time the sass files have been updated.

## app/styles-dev/main/styles.css



	This is the main preprocessed file used to generate the main style file (app/styles/styles.css) that renders the UIs. The file is just used for importing the other subfiles(app/styles-dev/main/components) that would generate the main style file as such no raw style needs to be added here.


## Application Structure

	->community-app
		->app
			->WEB-INF
			->angular
			->i18n			          → angularjs locale definitions 
			->bower_components		→ Libraries
			->fonts				        → Font libraries
			->global-translations	→ locale labels file for different languages 
			->images			        → images files 
			->scripts				      → application files (controller, filters etc)
			->styles				      → Contains css files
			->styles-dev			    → Contains scss files 
			->views				        → html template files
      ->node_modules			  → node dependencies of application
	    ->test					      → Contains various test cases
    
    
## Localisation

The Community app has support for multiple languages and accordingly, we are using labels inside our application. For example: 
{{"label.heading.frequentpostings"| translate}}

In locale-en.json file, you will find similar entry and its value in English. We ensure that Make sure when we are adding any new label, we just create an entry in the locale-en file and don’t touch other files. 
"label.heading.frequentpostings": "Frequent Postings".



## Working on Issues and Enhancements

Now thats we have a good understanding of about how our application is structured and how each part works, or working. We can now start with some small changes in the application. It’s best that before you starting working on the application, you first play around with the code. 
Say, you have to change any icon in the application or have to correct some typo error inside the application which has been overwritten. As, our application has 200+ files, so finding  from which file the content belongs to is difficult. So, the best way to approach this is to inspect the element using your browser developer tools to and check for some unique id or keyword that you can find in the entire app directory. As, you will continue working, you will get  good ideas and can easily traverse through the app. 


 

