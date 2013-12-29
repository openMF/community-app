
(function(mifosX) {
  var defineRoutes = function($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/start.html'
      })
      .when('/login', {
        templateUrl: 'views/login.html'
      })
      .when('/home', {
        templateUrl: 'views/home.html'
      })
      .when('/products', {
        templateUrl: 'views/products/products.html'
      })
      .when('/templates', {
        templateUrl: 'views/templates/templates.html'
      })
      .when('/createtemplate', {
        templateUrl: 'views/templates/createtemplate.html'
      })
      .when('/viewtemplate/:id', {
        templateUrl: 'views/templates/viewtemplate.html'
      })
      .when('/edittemplate/:id', {
        templateUrl: 'views/templates/edittemplate.html'
      })
      .when('/createloanproduct', {
        templateUrl: 'views/products/createloanproduct.html'
      })
      .when('/editloanproduct/:id', {
        templateUrl: 'views/products/editloanproduct.html'
      })
      .when('/createsavingproduct', {
        templateUrl: 'views/products/createsavingproduct.html'
      })
      .when('/editsavingproduct/:id', {
        templateUrl: 'views/products/editsavingproduct.html'
      })
      .when('/admin/viewrole/:id', {
        templateUrl: 'views/administration/viewrole.html'
      })
      .when('/admin/roles', {
        templateUrl: 'views/administration/roles.html'
      })
      .when('/admin/addrole', {
        templateUrl: 'views/administration/addrole.html'
      })
      .when('/admin/viewmctasks', {
        templateUrl: 'views/administration/makerchecker.html'
      })
      .when('/admin/users', {
        templateUrl: 'views/administration/users.html'
      })
      .when('/clients', {
        templateUrl: 'views/clients/clients.html'
      })
      .when('/createclient', {
        templateUrl: 'views/clients/createclient.html'
      })
      .when('/editclient/:id', {
        templateUrl : 'views/clients/editclient.html'
      })
      .when('/viewclient/:id', {
        templateUrl: 'views/clients/viewclient.html'
      })
      .when('/clientscreenreport/:clientId', {
          templateUrl: 'views/clients/clientscreenreport.html'
      })
      .when('/client/:id/:action', {
        templateUrl: 'views/clients/clientactions.html'
      })
      .when('/transferclient/:id', {
        templateUrl: 'views/clients/transferclient.html'
      })
      .when('/addclientdocument/:clientId', {
          templateUrl: 'views/clients/addclientdocument.html'
      })
      .when('/clientclosedloanaccount/:clientId', {
          templateUrl: 'views/clients/clientclosedloanaccount.html'
      })
      .when('/clientclosedsavingaccount/:clientId', {
          templateUrl: 'views/clients/clientclosedsavingaccount.html'
      })
      .when('/addclientidentifier/:clientId', {
        templateUrl: 'views/clients/addclientidentifier.html'
      })
      .when('/addclientidentifierdocument/:clientId/:resourceId', {
        templateUrl: 'views/clients/addclientidentifierdocument.html'
      })
      .when('/newclientloanaccount/:clientId', {
          templateUrl: 'views/loans/newloanaccount.html'
      })
      .when('/newgrouploanaccount/:groupId', {
          templateUrl: 'views/loans/newloanaccount.html'
      })
      .when('/newjlgloanaccount/:groupId', {
          templateUrl: 'views/loans/newjlgloanaccount.html'
      })
      .when('/viewloanaccount/:id', {
        templateUrl: 'views/loans/viewloanaccountdetails.html'
      })
      .when('/loanaccount/:id/:action', {
        templateUrl: 'views/loans/loanaccountactions.html'
      })
      .when('/loanaccountcharge/:id/:action/:chargeId', {
        templateUrl: 'views/loans/loanaccountactions.html'
      })
      .when('/editloanaccount/:id', {
        templateUrl: 'views/loans/editloanaccount.html'
      })
      .when('/loanscreenreport/:loanId', {
        templateUrl: 'views/loans/loanscreenreport.html'
      })
      .when('/addloancharge/:id', {
        templateUrl: 'views/loans/addloancharge.html'
      })
      .when('/addcollateral/:id', {
        templateUrl: 'views/loans/addloancollateral.html'
      })
      .when('/loan/:loanId/editcollateral/:id', {
        templateUrl: 'views/loans/editloancollateral.html'
      })
      .when('/loan/:loanId/viewcollateral/:id', {
        templateUrl: 'views/loans/viewloancollateral.html'
      })
      .when('/loan/:loanId/viewcharge/:id', {
        templateUrl: 'views/loans/viewloancharge.html'
      })
      .when('/loan/:loanId/editcharge/:id', {
        templateUrl: 'views/loans/editloancharge.html'
      })
      .when('/assignloanofficer/:id', {
        templateUrl: 'views/loans/assignloanofficer.html'
      })
      .when('/addloandocument/:loanId', {
        templateUrl: 'views/loans/addloandocument.html'
      })
      .when('/viewloantrxn/:accountId/trxnId/:id', {
        templateUrl: 'views/loans/view_loan_transaction.html'
      })
      .when('/organization', {
        templateUrl: 'views/administration/organization.html'
      })
      .when('/system', {
        templateUrl: 'views/administration/system.html'
      })
      .when('/loanproducts', {
        templateUrl: 'views/products/loanproducts.html'
      })
      .when('/charges', {
        templateUrl: 'views/products/charges.html'
      })
      .when('/viewcharge/:id', {
        templateUrl: 'views/products/viewcharge.html'
      })
      .when('/savingproducts', {
        templateUrl: 'views/products/savingproducts.html'
      })
      .when('/viewsavingproduct/:id', {
        templateUrl: 'views/products/viewsavingproduct.html'
      })
      .when('/offices', {
        templateUrl: 'views/organization/offices.html'
      })
      .when('/createoffice', {
        templateUrl: 'views/organization/createoffice.html'
      })
      .when('/viewoffice/:id', {
        templateUrl: 'views/organization/viewoffice.html'
      })
      .when('/editoffice/:id', {
        templateUrl: 'views/organization/editoffice.html'
      })
      .when('/tasks', {
        templateUrl: 'views/tasks.html'
      })
      .when('/currconfig', {
        templateUrl: 'views/organization/currencyconfig.html'
      })
      .when('/search/:query', {
        templateUrl: 'views/search/glresults.html'
      })
      .when('/viewloanproduct/:id', {
        templateUrl: 'views/products/viewloanproduct.html'
      })
      .when('/usersetting', {
        templateUrl: 'views/administration/usersettings.html'
      })
      .when('/users/', {
        templateUrl: 'views/administration/userslist.html'
      })
      .when('/createuser/', {
        templateUrl: 'views/administration/createuser.html'
      })
      .when('/viewuser/:id', {
        templateUrl: 'views/administration/viewuser.html'
      })
      .when('/edituser/:id', {
        templateUrl: 'views/administration/edituser.html'
      })
      .when('/employees', {
        templateUrl: 'views/organization/employees.html'
      })
      .when('/viewemployee/:id', {
        templateUrl: 'views/organization/viewemployee.html'
      })
      .when('/editemployee/:id', {
        templateUrl: 'views/organization/editemployee.html'
      })
      .when('/createemployee/', {
        templateUrl: 'views/organization/createemployee.html'
      })
      .when('/managefunds/', {
        templateUrl: 'views/organization/managefunds.html'
      })
      .when('/nav/offices', {
        templateUrl: 'views/navigation/offices.html'
      })
      .when('/accounting', {
        templateUrl: 'views/accounting/accounting.html'
      })
      .when('/accounting_coa', {
        templateUrl: 'views/accounting/accounting_coa.html'
      })
      .when('/createglaccount', {
        templateUrl: 'views/accounting/createglaccounting.html'
      })
      .when('/viewglaccount/:id', {
        templateUrl: 'views/accounting/viewglaccounting.html'
      })
      .when('/editglaccount/:id', {
        templateUrl: 'views/accounting/editglaccounting.html'
      })
      .when('/freqposting', {
        templateUrl: 'views/accounting/freqposting.html'
      })
      .when('/viewtransactions/:transactionId', {
        templateUrl: 'views/accounting/view_transactions.html'
      })
      .when('/journalentry', {
        templateUrl: 'views/accounting/journalentry_posting.html'
      })
      .when('/searchtransaction', {
        templateUrl: 'views/accounting/search_transaction.html'
      })
      .when('/accounts_closure', {
        templateUrl: 'views/accounting/accounts_closure.html'
      })
      .when('/view_close_accounting/:id', {
        templateUrl: 'views/accounting/view_close_accounting.html'
      })
      .when('/accounting_rules', {
        templateUrl: 'views/accounting/accounting_rules.html'
      })
      .when('/viewaccrule/:id', {
        templateUrl: 'views/accounting/view_acc_rule.html'
      })
      .when('/add_accrule', {
        templateUrl: 'views/accounting/add_acc_rule.html'
      })
      .when('/editaccrule/:id', {
        templateUrl: 'views/accounting/edit_acc_rule.html'
      })
      .when('/viewcode/:id', {
          templateUrl: 'views/system/viewcode.html'
      })
      .when('/datatables', {
          templateUrl: 'views/system/datatables.html'
      })
      .when('/viewdatatable/:tableName', {
        templateUrl: 'views/system/viewdatatable.html'
      })
      .when('/createdatatable', {
          templateUrl: 'views/system/createdatatable.html'
      })
      .when('/editdatatable/:tableName', {
          templateUrl: 'views/system/editdatatable.html'
      })
      .when('/makedatatableentry/:tableName/:entityId', {
          templateUrl: 'views/system/makedatatableentry.html'
      })
      .when('/viewdatatableentry/:tableName/:entityId/:resourceId', {
          templateUrl: 'views/system/viewdatatableentry.html'
      })
      .when('/addcode', {
          templateUrl: 'views/system/addcode.html'
      })
      .when('/jobs', {
          templateUrl: 'views/system/schedulerjobs.html'
      })
      .when('/viewschedulerjob/:id', {
          templateUrl: 'views/system/viewschedulerjob.html'
      })
      .when('/editschedulerjob/:id', {
          templateUrl: 'views/system/editschedulerjob.html'
      })
      .when('/viewhistory/:id', {
          templateUrl: 'views/system/viewschedulerjobhistory.html'
      })
      .when('/codes', {
          templateUrl: 'views/system/codes.html'
      })
      .when('/editcode/:id', {
          templateUrl: 'views/system/editcode.html'
      })
      .when('/reports', {
          templateUrl: 'views/system/reports.html'
      })
      .when('/system/viewreport/:id', {
          templateUrl: 'views/system/viewreport.html'
      })
      .when('/createreport', {
          templateUrl: 'views/system/createreport.html'
      })
      .when('/editreport/:id', {
          templateUrl: 'views/system/editreport.html'
      })
      .when('/holidays', {
          templateUrl: 'views/organization/holidays.html'
      })
      .when('/createholiday', {
          templateUrl: 'views/organization/createholiday.html'
      })
      .when('/viewholiday/:id', {
          templateUrl: 'views/organization/viewholiday.html'
      })
      .when('/editholiday/:id', {
          templateUrl: 'views/organization/editholiday.html'
      })
      .when('/reports/:type', {
        templateUrl: 'views/reports/view_reports.html'
      })
      .when('/run_report/:name', {
        templateUrl: 'views/reports/run_reports.html'
      })
      .when('/xbrl', {
        templateUrl: 'views/reports/xbrl.html'
      })
      .when('/xbrlreport', {
        templateUrl: 'views/reports/xbrlreport.html'
      })
      .when('/new_client_saving_application/:clientId', {
        templateUrl: 'views/savings/new_saving_account_application.html'
      })
      .when('/new_group_saving_application/:groupId', {
        templateUrl: 'views/savings/new_saving_account_application.html'
      })
      .when('/new_group_saving_application/:groupId/:centerEntity', {
        templateUrl: 'views/savings/new_saving_account_application.html'
      })
      .when('/new_jlg_saving_application/:groupId/:clientId', {
        templateUrl: 'views/savings/new_saving_account_application.html'
      })
      .when('/viewsavingaccount/:id', {
        templateUrl: 'views/savings/view_saving_account_details.html'
      })
      .when('/groups', {
        templateUrl: 'views/groups/groups.html'
      })
      .when('/creategroup', {
        templateUrl: 'views/groups/creategroup.html'
      })
      .when('/attachmeeting/:id/:entityType', {
        templateUrl: 'views/groups/attachmeeting.html'
      })
      .when('/editcalendar/:entityType/:groupOrCenterId/:calendarId', {
        templateUrl: 'views/groups/editmeeting.html'
      })
      .when('/editsavingaccount/:id', {
        templateUrl: 'views/savings/edit_saving_account_application.html'
      })
      .when('/savingaccount/:id/:action', {
        templateUrl: 'views/savings/saving_account_actions.html'
      })
      .when('/savingaccountcharge/:id/:action/:chargeId', {
        templateUrl: 'views/savings/saving_account_actions.html'
      })
      .when('/savingaccounts/:id/charges', {
        templateUrl: 'views/savings/addnewsavingscharge.html'
      })
      .when('/viewaccounttransfers/:id', {
        templateUrl: 'views/accounttransfers/view_accounttransfer.html'
      })
      .when('/accounttransfers/:accountType/:accountId', {
        templateUrl: 'views/accounttransfers/make_accounttransfer.html'
      })
      .when('/viewsavingtrxn/:accountId/trxnId/:id', {
        templateUrl: 'views/savings/view_saving_transaction.html'
      })
      .when('/viewgroup/:id', {
        templateUrl: 'views/groups/viewgroup.html'
      })
      .when('/editgroup/:id', {
        templateUrl: 'views/groups/editgroup.html'
      })
      .when('/addmember', {
        templateUrl: 'views/groups/addmember.html'
      })
      .when('/groupattendance', {
        templateUrl: 'views/groups/groupattendance.html'
      })
      .when('/closegroup/:id', {
        templateUrl: 'views/groups/closegroup.html'
      })
      .when('/groupclosedloanaccount/:groupId', {
        templateUrl: 'views/groups/groupclosedloanaccount.html'
      })
      .when('/groupclosedsavingaccount/:groupId', {
        templateUrl: 'views/groups/groupclosedsavingaccount.html'
      })
      .when('/addrole/:id', {
        templateUrl: 'views/groups/addrole.html'
      })
      .when('/membermanage/:id', {
        templateUrl: 'views/groups/membermanage.html'
      })
      .when('/transferclients/:id', {
        templateUrl: 'views/groups/transferclients.html'
      })
      .when('/centers', {
        templateUrl: 'views/centers/centers.html'
      })
      .when('/viewcenter/:id', {
        templateUrl:'views/centers/viewcenter.html'
      })
      .when('/createcenter', {
        templateUrl: 'views/centers/createcenter.html'
      })
      .when('/editcenter/:id', {
        templateUrl: 'views/centers/editcenter.html'
      })
      .when('/closecenter/:id', {
        templateUrl: 'views/centers/closecenter.html'
      })
      .when('/addgroup', {
        templateUrl: 'views/centers/addgroup.html'
      })
      .when('/centerattendance', {
        templateUrl: 'views/centers/centerattendance.html'
      })
      .when('/createcharge', {
          templateUrl: 'views/products/createcharge.html'
      })
      .when('/editcharge/:id', {
        templateUrl: 'views/products/editcharge.html'
      })
      .when('/entercollectionsheet', {
        templateUrl: 'views/collection/collectionsheet.html'
      })
      .when('/assignstaff/:id/:entityType', {
        templateUrl: 'views/groups/assignstaff.html'
      })
      .when('/global', {
        templateUrl: 'views/administration/global.html'
      })
      .when('/productmix', {
        templateUrl: 'views/products/productmix/productmix.html'
      })
      .when('/viewproductmix/:id', {
        templateUrl: 'views/products/productmix/viewproductmix.html'
      })
      .when('/editproductmix/:id', {
        templateUrl: 'views/products/productmix/editproductmix.html'
      })
      .when('/addproductmix', {
        templateUrl: 'views/products/productmix/addproductmix.html'
      })
      .when('/bulkloan', {
        templateUrl: 'views/organization/bulkloan.html'
      })
      .when('/audit', {
        templateUrl: 'views/system/audit.html'
      })
      .when('/viewaudit/:id', {
        templateUrl: 'views/system/viewaudit.html'
      })
      .when('/createclosure', {
        templateUrl: 'views/accounting/createclosure.html'
      })
      .when('/guarantor/:id', {
        templateUrl: 'views/loans/guarantor.html'
      })
      .when('/viewcheckerinbox/:id',{
        templateUrl: 'views/system/viewcheckerinbox.html'
      })
      .when('/editguarantor/:id/:loanId',{
        templateUrl: 'views/loans/editguarantor.html'
      })
      .when('/expertsearch',{
        templateUrl: 'views/expertsearch.html'
      })
      .when('/profile',{
        templateUrl: 'views/profile.html'
      })
      .when('/viewMakerCheckerTask/:commandId',{
        templateUrl: 'views/system/viewMakerCheckerTask.html'
      })
      .when('/help',{
        templateUrl: 'views/help.html'
      })
      .when('/checkeractionperformed',{
        templateUrl: 'views/system/checkerActionPerformed.html'
      });
    $locationProvider.html5Mode(false);
  };
  mifosX.ng.application.config(defineRoutes).run(function($log) {
    $log.info("Routes definition completed");
  });
}(mifosX || {}));
