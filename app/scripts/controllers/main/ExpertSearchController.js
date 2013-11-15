(function(module) {
    mifosX.controllers = _.extend(module, {
        ExpertSearchController: function(scope, resourceFactory , localStorageService,$rootScope,location) {

            scope.recent = [];
            scope.recent=localStorageService.get('Location');
            scope.recentEight = [];
            scope.frequent = [];
            scope.recentArray = [];
            scope.uniqueArray = [];
            scope.searchParams = [];
            scope.recents = [];
            //to retrieve last 8 recent activities
            for(var rev= scope.recent.length-1;rev>0;rev--){
               scope.recentArray.push(scope.recent[rev]);
            }
            scope.unique = function(array) {
                array.forEach(function (value) {
                    if (scope.uniqueArray.indexOf(value) === -1) {
                        scope.uniqueArray.push(value);
                    }
                });
            }
            scope.unique(scope.recentArray);
            //recent activities retrieved

            //retrieve last 9 recent activities
            for(var l=0; l<9;l++){
                if(scope.uniqueArray[l]){
                    scope.recents.push(scope.uniqueArray[l]);
                }
            }
            // 9 recent activities retrieved

            //count duplicates
            var i = scope.recent.length;
            var obj ={};
            while (i)
            {
                obj[scope.recent[--i]] = (obj[scope.recent[i]] || 0) + 1;
            }
            //count ends here

           //to sort based on counts
            var sortable = [];
            for (var i in obj){
                sortable.push([i, obj[i]]);
            }
            sortable.sort(function(a, b) {return a[1] - b[1]});
            //sort end here

            //to retrieve the locations from sorted array
            var sortedArray =[];
            for(var key in sortable) {
                sortedArray.push(sortable[key][0]);
            }
            //retrieving ends here

            //retrieve last 8 frequent actions
            for(var freq = sortedArray.length-1; freq>sortedArray.length-10;freq--){
                if(sortedArray[freq]){
                    scope.frequent.push(sortedArray[freq]);
                }
            }
            // retrieved 8 frequent actions

           scope.searchParams.push('create client');
           scope.searchParams.push('clients');
           scope.searchParams.push('create group');
           scope.searchParams.push('groups');
           scope.searchParams.push('centers');
           scope.searchParams.push('create center');
           scope.searchParams.push('configuration');
           scope.searchParams.push('tasks');

           scope.search = function(){
               switch(this.formData.search){
                   case 'create client': location.path('/createclient');
                       break;
                   case 'clients': location.path('/clients');
                       break;
                   case 'create group': location.path('/creategroup');
                       break;
                   case 'groups': location.path('/groups');
                       break;
                   case 'create center': location.path('/createcenter');
                       break;
                   case 'centers': location.path('/centers');
                       break;
                   case 'configuration': location.path('/global');
                       break;
                   case 'tasks': location.path('/tasks');
                       break;
                   default: location.path('/home');
               }
           }

        }
    });
    mifosX.ng.application.controller('ExpertSearchController', ['$scope', 'ResourceFactory', 'localStorageService','$rootScope','$location', mifosX.controllers.ExpertSearchController]).run(function($log) {
        $log.info("ExpertSearchController initialized");
    });
}(mifosX.controllers || {}));

