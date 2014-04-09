define(['Q', 'underscore', 'mifosX'], function (Q) {
    var components = {
        models: [
            'clientStatus',
            'LoggedInUser',
            'roleMap',
            'Langs'
        ],
        services: [
            'ResourceFactoryProvider',
            'HttpServiceProvider',
            'AuthenticationService',
            'SessionManager',
            'Paginator'
        ],
        controllers: [
            'main/MainController',
            'main/LoginFormController',
            'main/TaskController',
            'main/SearchController',
            'main/NavigationController',
            'collection/ProductiveCollectionSheetController',
            'collection/CollectionSheetController',
            'loanAccount/ViewLoanDetailsController',
            'loanAccount/NewLoanAccAppController',
            'loanAccount/LoanAccountActionsController',
            'loanAccount/AddLoanChargeController',
            'loanAccount/AddLoanCollateralController',
            'loanAccount/AssignLoanOfficerController',
            'loanAccount/EditLoanAccAppController',
            'loanAccount/ViewLoanCollateralController',
            'loanAccount/EditLoanCollateralController',
            'loanAccount/ViewLoanChargeController',
            'loanAccount/EditLoanChargeController',
            'loanAccount/NewJLGLoanAccAppController',
            'loanAccount/LoanDocumentController',
            'loanAccount/ViewLoanTransactionController',
            'loanAccount/LoanScreenReportController',
            'groups/AssignStaffController',
            'client/ClientController',
            'client/EditClientController',
            'client/ViewClientController',
            'client/CreateClientController',
            'client/TransactionClientController',
            'client/ClientActionsController',
            'client/ClientDocumentController',
            'client/ClientIdentifierController',
            'client/UploadClientIdentifierDocumentController',
            'client/ClientScreenReportController',
            'product/LoanProductController',
            'product/CreateLoanProductController',
            'product/CreateSavingProductController',
            'product/EditSavingProductController',
            'product/EditLoanProductController',
            'product/ChargeController',
            'product/ViewChargeController',
            'product/SavingProductController',
            'product/ViewSavingProductController',
            'product/ViewLoanProductController',
            'user/UserController',
            'user/UserFormController',
            'user/UserSettingController',
            'user/UserListController',
            'user/ViewUserController',
            'organization/RoleController',
            'organization/ViewRoleController',
            'organization/CreateRoleController',
            'organization/MakerCheckerController',
            'organization/OfficesController',
            'organization/ViewOfficeController',
            'organization/CreateOfficeController',
            'organization/EditOfficeController',
            'organization/CurrencyConfigController',
            'organization/CreateUserController',
            'organization/EditUserController',
            'organization/ViewEmployeeController',
            'organization/EditEmployeeController',
            'organization/EmployeeController',
            'organization/CreateEmployeeController',
            'organization/ManageFundsController',
            'accounting/AccFreqPostingController',
            'accounting/AccCoaController',
            'accounting/AccCreateGLAccountContoller',
            'accounting/AccViewGLAccountContoller',
            'accounting/AccEditGLAccountController',
            'accounting/ViewTransactionController',
            'accounting/JournalEntryController',
            'accounting/SearchTransactionController',
            'accounting/AccountingClosureController',
            'accounting/ViewAccountingClosureController',
            'accounting/AccountingRuleController',
            'accounting/AccCreateRuleController',
            'accounting/AccEditRuleController',
            'accounting/ViewAccRuleController',
            'system/CodeController',
            'system/EditCodeController',
            'system/ViewCodeController',
            'system/AddCodeController',
            'system/ViewDataTableController',
            'system/DataTableController',
            'system/ReportsController',
            'system/ViewReportController',
            'system/CreateReportController',
            'system/EditReportController',
            'system/CreateDataTableController',
            'system/EditDataTableController',
            'system/MakeDataTableEntryController',
            'system/DataTableEntryController',
            'system/SchedulerJobsController',
            'system/ViewSchedulerJobController',
            'system/EditSchedulerJobController',
            'system/ViewSchedulerJobHistoryController',
            'organization/HolController',
            'organization/ViewHolController',
            'organization/EditHolidayController',
            'organization/AddHolController',
            'reports/ViewReportsController',
            'organization/EditHolidayController',
            'reports/RunReportsController',
            'reports/XBRLController',
            'reports/XBRLReportController',
            'savings/CreateSavingAccountController',
            'savings/ViewSavingDetailsController',
            'private/SuperuserController',
            'groups/GroupController',
            'groups/ViewGroupController',
            'groups/AttachMeetingController',
            'groups/EditMeetingController',
            'savings/EditSavingAccountController',
            'savings/SavingAccountActionsController',
            'accounttransfers/ViewAccountTransferDetailsController',
            'accounttransfers/MakeAccountTransferController',
            'accounttransfers/CreateStandingInstructionController',
            'accounttransfers/ListStandingInstructionController',
            'accounttransfers/ListTransactionsController',
            'accounttransfers/EditStandingInstructionController',
            'accounttransfers/ViewStandingInstructionController',
            'savings/ViewSavingsTransactionController',
            'savings/AddNewSavingsChargeController',
            'savings/ViewSavingChargeController',
            'groups/CreateGroupController',
            'groups/AddMemberController',
            'groups/EditGroupController',
            'groups/GroupAttendanceController',
            'groups/CloseGroupController',
            'groups/AddRoleController',
            'groups/MemberManageController',
            'groups/TransferClientsController',
            'centers/CenterController',
            'centers/ViewCenterController',
            'centers/CreateCenterController',
            'centers/EditCenterController',
            'centers/CloseCenterController',
            'centers/AddGroupController',
            'centers/CenterAttendanceController',
            'product/CreateChargeController',
            'product/EditChargeController',
            'configurations/GlobalConfigurationController',
            'configurations/EditConfigurationController',
            'product/productmix/ProductMixController',
            'product/productmix/ViewProductMixController',
            'product/productmix/AddProductMixController',
            'organization/BulkLoanReassignmentController',
            'system/AuditController',
            'system/ViewAuditController',
            'template/TemplateController',
            'template/CreateTemplateController',
            'template/ViewTemplateController',
            'template/EditTemplateController',
            'loanAccount/GuarantorController',
            'loanAccount/EditGuarantorController',
            'main/ViewCheckerinboxController',
            'main/ExpertSearchController',
            'main/ProfileController',
            'main/ViewMakerCheckerTaskController',
            'main/AdHocQuerySearchController'
        ],
        filters: [
            'StatusLookup',
            'DateFormat',
            'DayMonthFormat',
            'YesOrNo',
            'UrlToString',
            'sort',
            'DotRemove',
            'FormatNumber'
        ],
        directives: [
            'DialogDirective',
            'PanelDirective',
            'BigPanelDirective',
            'OnBlurDirective',
            'LateValidateDirective',
            'TreeviewDirective',
            'CkEditorDirective',
            'AutofocusDirective',
            'SummaryDirective',
            'FormValidateDirective',
            'FormSubmitValidateDirective',
            'ApiValidationDirective',
            'HasPermissionDirective',
            'ActivitiesDisplayPanelDirective',
            'ScrollbarTopDirective',
            'ChosenComboboxDirective'
        ]
    };
    
    return function() {
        var defer = Q.defer();
        require(_.reduce(_.keys(components), function (list, group) {
            return list.concat(_.map(components[group], function (name) {
                return group + "/" + name;
            }));
        }, [
            'routes',
            'initialTasks',
            'webstorage-configuration'
        ]), function(){
            defer.resolve();
        });
        return defer.promise;
    }
});
