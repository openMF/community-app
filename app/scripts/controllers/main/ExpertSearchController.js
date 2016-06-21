(function (module) {
    mifosX.controllers = _.extend(module, {
        ExpertSearchController: function (scope, resourceFactory, location) {
        	scope.dashModel = 'dashboard';
            scope.switch = function() {
	        	location.path('/richdashboard');
			}
            
            scope.searchParams = ['create client', 'clients', 'create group', 'groups', 'centers', 'create center', 'configuration', 'tasks', 'templates', 'system users',
                                  'create template', 'create loan product', 'create saving product', 'roles', 'add role', 'configure maker checker tasks',
                                  'users', 'loan products', 'charges', 'saving products', 'offices', 'create office', 'currency configurations', 'user settings',
                                  'create user', 'employees', 'create employee', 'manage funds', 'offices', 'chart of accounts', 'frequent postings', 'Journal entry',
                                  'search transaction', 'account closure', 'accounting rules', 'add accounting rule', 'data tables', 'create data table', 'add code',
                                  'jobs', 'codes', 'reports', 'create report', 'holidays', 'create holiday', 'create charge', 'product mix', 'add member', 'add product mix',
                                  'bulk loan reassignment', 'audit', 'create accounting closure', 'enter collection sheet', 'navigation', 'accounting', 'organization', 'system'];
            scope.search = function () {
		      switch (this.formData.search) {
		          case 'create client':
		              location.path('/createclient');
		              break;
		          case 'clients':
		              location.path('/clients');
		              break;
		          case 'create group':
		              location.path('/creategroup');
		              break;
		          case 'groups':
		              location.path('/groups');
		              break;
		          case 'create center':
		              location.path('/createcenter');
		              break;
		          case 'centers':
		              location.path('/centers');
		              break;
		          case 'configuration':
		              location.path('/global');
		              break;
		          case 'tasks':
		              location.path('/tasks');
		              break;
		          case 'templates':
		              location.path('/templates');
		              break;
		          case 'create template':
		              location.path('/createtemplate');
		              break;
		          case 'create loan product':
		              location.path('/createloanproduct');
		              break;
		          case 'create saving product':
		              location.path('/createsavingproduct');
		              break;
		          case 'roles':
		              location.path('/admin/roles');
		              break;
		          case 'add role':
		              location.path('/admin/addrole');
		              break;
		          case 'configure maker checker tasks':
		              location.path('/admin/viewmctasks');
		              break;
		          case 'loan products':
		              location.path('/loanproducts');
		              break;
		          case 'charges':
		              location.path('/charges');
		              break;
		          case 'saving products':
		              location.path('/savingproducts');
		              break;
		          case 'offices':
		              location.path('/offices');
		              break;
		          case 'create office':
		              location.path('/createoffice');
		              break;
		          case 'currency configurations':
		              location.path('/currconfig');
		              break;
		          case 'user settings':
		              location.path('/usersetting');
		              break;
		          case 'employees':
		              location.path('/employees');
		              break;
		          case 'create employee':
		              location.path('/createemployee');
		              break;
		          case 'manage funds':
		              location.path('/managefunds');
		              break;
		          case 'chart of accounts':
		              location.path('/accounting_coa');
		              break;
		          case 'frequent postings':
		              location.path('/freqposting');
		              break;
		          case 'journal entry':
		              location.path('/journalentry');
		              break;
		          case 'search transaction':
		              location.path('/searchtransaction');
		              break;
		          case 'account closure':
		              location.path('/accounts_closure');
		              break;
		          case 'accounting rules':
		              location.path('/accounting_rules');
		              break;
		          case 'add accounting rule':
		              location.path('/add_accrule');
		              break;
		          case 'data tables':
		              location.path('/datatables');
		              break;
		          case 'create data table':
		              location.path('/createdatatable');
		              break;
		          case 'add code':
		              location.path('/addcode');
		              break;
		          case 'jobs':
		              location.path('/jobs');
		              break;
		          case 'codes':
		              location.path('/codes');
		              break;
		          case 'reports':
		              location.path('/reports');
		              break;
		          case 'create report':
		              location.path('/createreport');
		              break;
		          case 'holidays':
		              location.path('/holidays');
		              break;
		          case 'create holiday':
		              location.path('/createholiday');
		              break;
		          case 'add member':
		              location.path('/addmember');
		              break;
		          case 'create charge':
		              location.path('/createcharge');
		              break;
		          case 'enter collection sheet':
		              location.path('/entercollectionsheet');
		              break;
		          case 'product mix':
		              location.path('/productmix');
		              break;
		          case 'add product mix':
		              location.path('/addproductmix');
		              break;
		          case 'bulk loan reassignment':
		              location.path('/bulkloan');
		              break;
		          case 'audit':
		              location.path('/audit');
		              break;
		          case 'create accounting closure':
		              location.path('/createclosure');
		              break;
		          case 'navigation':
		              location.path('/nav/offices');
		              break;
		          case 'accounting':
		              location.path('/accounting');
		              break;
		          case 'organization':
		              location.path('/organization');
		              break;
		          case 'system':
		              location.path('/system');
		              break;
		          case 'system users':
		              location.path('/admin/users');
		              break;
		          default:
		              location.path('/home');
		      }
            }

        }

    });
    mifosX.ng.application.controller('ExpertSearchController', ['$scope', 'ResourceFactory', '$location', mifosX.controllers.ExpertSearchController]).run(function ($log) {
        $log.info("ExpertSearchController initialized");
    });
}(mifosX.controllers || {}));

