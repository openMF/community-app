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

            //retrieve last 8 recent activities
            for(var l=0; l<11;l++){
                if(scope.uniqueArray[l]){
                    if(scope.uniqueArray[l]!='/'){ if(scope.uniqueArray[l]!='/home'){
                      scope.recents.push(scope.uniqueArray[l]);
                    }}
                }
            }
            // 8 recent activities retrieved

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
            for(var freq = sortedArray.length-1; freq>sortedArray.length-11;freq--){
                if(sortedArray[freq]){
                    if(sortedArray[freq]!='/'){ if(sortedArray[freq]!='/home'){
                      scope.frequent.push(sortedArray[freq]);
                    }}
                }
            }
            // retrieved 8 frequent actions

            scope.searchParams = ['create client','clients','create group','groups','centers','create center','configuration','tasks','templates','system users',
                                  'create template', 'create loan product', 'create saving product', 'roles', 'add role', 'configure maker checker tasks',
                                  'users', 'loan products', 'charges', 'saving products', 'offices', 'create office', 'currency configurations', 'user settings',
                                  'create user', 'employees', 'create employee', 'manage funds', 'offices', 'chart of accounts', 'frequent postings', 'Journal entry',
                                  'search transaction', 'account closure', 'accounting rules', 'add accounting rule', 'data tables', 'create data table', 'add code',
                                  'jobs', 'codes', 'reports', 'create report', 'holidays', 'create holiday', 'create charge', 'product mix', 'add member', 'add product mix',
                                  'bulk loan reassignment', 'audit', 'create accounting closure', 'enter collection sheet','navigation','accounting','organization','system'
                                 ];
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
                   case 'templates': location.path('/templates');
                       break;
                   case 'create template': location.path('/createtemplate');
                       break;
                   case 'create loan product': location.path('/createloanproduct');
                       break;
                   case 'create saving product': location.path('/createsavingproduct');
                       break;
                   case 'roles': location.path('/admin/roles');
                       break;
                   case 'add role': location.path('/admin/addrole');
                       break;
                   case 'configure maker checker tasks': location.path('/admin/viewmctasks');
                       break;
                   case 'loan products': location.path('/loanproducts');
                       break;
                   case 'charges': location.path('/charges');
                       break;
                   case 'saving products': location.path('/savingproducts');
                       break;
                   case 'offices': location.path('/offices');
                       break;
                   case 'create office': location.path('/createoffice');
                       break;
                   case 'currency configurations': location.path('/currconfig');
                       break;
                   case 'user settings': location.path('/usersetting');
                       break;
                   case 'employees': location.path('/employees');
                       break;
                   case 'create employee': location.path('/createemployee');
                       break;
                   case 'manage funds': location.path('/managefunds');
                       break;
                   case 'chart of accounts': location.path('/accounting_coa');
                       break;
                   case 'frequent postings': location.path('/freqposting');
                       break;
                   case 'journal entry': location.path('/journalentry');
                       break;
                   case 'search transaction': location.path('/searchtransaction');
                       break;
                   case 'account closure': location.path('/accounts_closure');
                       break;
                   case 'accounting rules': location.path('/accounting_rules');
                       break;
                   case 'add accounting rule': location.path('/add_accrule');
                       break;
                   case 'data tables': location.path('/datatables');
                       break;
                   case 'create data table': location.path('/createdatatable');
                       break;
                   case 'add code': location.path('/addcode');
                       break;
                   case 'jobs': location.path('/jobs');
                       break;
                   case 'codes': location.path('/codes');
                       break;
                   case 'reports': location.path('/reports');
                       break;
                   case 'create report': location.path('/createreport');
                       break;
                   case 'holidays': location.path('/holidays');
                       break;
                   case 'create holiday': location.path('/createholiday');
                       break;
                   case 'add member': location.path('/addmember');
                       break;
                   case 'create charge': location.path('/createcharge');
                       break;
                   case 'enter collection sheet': location.path('/entercollectionsheet');
                       break;
                   case 'product mix': location.path('/productmix');
                       break;
                   case 'add product mix': location.path('/addproductmix');
                       break;
                   case 'bulk loan reassignment': location.path('/bulkloan');
                       break;
                   case 'audit': location.path('/audit');
                       break;
                   case 'create accounting closure': location.path('/createclosure');
                       break;
                   case 'navigation': location.path('/nav/offices');
                       break;
                   case 'accounting': location.path('/accounting');
                       break;
                   case 'organization': location.path('/organization');
                       break;
                   case 'system': location.path('/system');
                       break;
                   case 'system users': location.path('/admin/users');
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

