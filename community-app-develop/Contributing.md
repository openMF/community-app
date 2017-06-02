# Writing Unit Tests for Mifos Community App

## Best Practices:
 - Write tests before adding a new feature.
 - Make sure to include tests that fail without your code and pass with your code.
 - Make sure your changes do not cause other tests to fail.
 - Name tests descriptively.
 - Only test one piece of functionality at a time.

## What to test?
 - Test interactions and expected behavior.
 - Avoid testing that a method was run, instead test that the outcome of the method was correct.
 - Test only functionality that resides within that class.

## Where to test?
 - Use a separate test class for each class. Make sure to name the class appropriately.
 - Use a corresponding file structure.

## How to structure a test?

In the below example, we will take a look at SearchController. The purpose of this section of the SearchController is to take in a client ID and return client information, populating the scope to display for the user.

For this section, we want to test that given a client ID for an existing user, we return the correct client information that is populated to the scope.

```javascript
function(module) {
  mifosX.controllers = _.extend(module, {
    SearchController: function(scope, routeParams , resourceFactory) {

        scope.searchResults = [];
        resourceFactory.globalSearch.search( {query: routeParams.query} , function(data){
            scope.searchResults = data;
        });
        scope.getClientDetails = function(clientId) {

            scope.selected = clientId;
            resourceFactory.clientResource.get({clientId:clientId} , function(data) {
              scope.group = '';
              scope.client = data;
              scope.center = '';
            });
            resourceFactory.clientAccountResource.get({clientId: clientId} , function(data) {
              scope.clientAccounts = data;
            });
        };

     }
  });
  mifosX.ng.application.controller('SearchController', ['$scope','$routeParams','ResourceFactory', mifosX.controllers.SearchController]).run(function($log) {
    $log.info("SearchController initialized");
  });
}(mifosX.controllers || {}));
```

### Test Setup:

In the below tests, we first set up the controller and mock dependencies, which are scope, route, and resourceFactory. Notice that we are mocking specific service calls, which include resourceFactory.globalSearch.search, etc. These are mocked using Jasmine Spy Objects, which allow us to stub real behavior.

Notice that we did not create a spy for scope, as we want to test how scope is changing.

```javascript
describe("SearchController", function() {
    var resourceCallback, clientGet, clientAccountGet, groupGet, groupAccountGet,centerGet, centerAccountGet;
    beforeEach(function() {
        this.scope = {};

        this.route =jasmine.createSpyObj("$routeParams", ['query']);

        this.resourceFactory = {
            globalSearch: {
                search: jasmine.createSpy('globalSearch.search()').andCallFake(function(query,callback) {
                    resourceCallback = callback;
                })},
            clientResource: {
                get: jasmine.createSpy('clientResources.get()').andCallFake(function(params,callback)  {
                    clientGet = callback;
                })},
            clientAccountResource : {
                get: jasmine.createSpy('clientAccountResources.get()').andCallFake(function(params,callback){
                    clientAccountGet=callback;
                })}
         }
         this.controller = new mifosX.controllers.SearchController(this.scope, this.route, this.resourceFactory);
     }
```

### Testing:

Notice the naming conventions below, as each test describes the particular feature that is being tested. Follow naming conventions of the particular project.

Group tests that are similar in behavior. See how "describe" wraps tests that are testing specific outcomes of a single feature or action.

Each test should have an expect statement. In most cases, tests should only have one expect statement.


```javascript
     it("should populate the search results on loading", function(){
             resourceCallback({"data":"searchResults"});
             expect(this.resourceFactory.globalSearch.search).toHaveBeenCalled();
             expect(this.scope.searchResults.data).toBe("searchResults");
         });

         describe("when a clientId is selected",function(){
             beforeEach(function() {
                 this.scope.getClientDetails("123");
                 clientGet({'clientId':'123'});
             });

             it("should set the clientId to selected when the clientId is selected",function(){
                 expect(this.scope.selected).toBe("123");
             });
             it("should set the group to blank",function(){
                 expect(this.scope.group).toBe("");
             });
             it("should set the center to blank",function(){
                 expect(this.scope.center).toBe("");
             });
             it("should get the client data",function(){
                 expect(this.scope.client.clientId).toBe("123");
             });
             it("should get the client account data",function(){
                 clientAccountGet({'account':'1'});
                 expect(this.scope.clientAccounts.account).toBe("1");
             });

         });
      }
```

## Contributing:

Please feel free to add to and contribute to this documentation!