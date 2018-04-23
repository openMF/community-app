(function (module) {
    mifosX.services = _.extend(module, {
        ResourceFactoryProvider: function () {
            var baseUrl = "" , apiVer = "/fineract-provider/api/v1", tenantIdentifier = "";
            this.setBaseUrl = function (url) {
                baseUrl = url;
                console.log(baseUrl);
            };

            this.setTenantIdenetifier = function (tenant) {
                tenantIdentifier = tenant;
            }
            this.$get = ['$resource', '$rootScope', function (resource, $rootScope) {
                var defineResource = function (url, paramDefaults, actions) {
                    var tempUrl = baseUrl;
                    $rootScope.hostUrl = tempUrl;
                    $rootScope.tenantIdentifier = tenantIdentifier;
                    return resource(baseUrl + url, paramDefaults, actions);
                };
                return {
                    userResource: defineResource(apiVer + "/users/:userId", {userId: '@userId'}, {
                        getAllUsers: {method: 'GET', params: {fields: "id,firstname,lastname,username,officeName"}, isArray: true},
                        getUser: {method: 'GET', params: {}}
                    }),
                    roleResource: defineResource(apiVer + "/roles/:roleId", {roleId: '@roleId', command: '@command'}, {
                        getAllRoles: {method: 'GET', params: {}, isArray: true},
                        deleteRoles: {method: 'DELETE'},
                        disableRoles: {method: 'POST'},
                        enableRoles: {method: 'POST'}
                    }),
                    rolePermissionResource: defineResource(apiVer + "/roles/:roleId/permissions", {roleId: '@roleId'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    permissionResource: defineResource(apiVer + "/permissions", {}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT'}
                    }),
                    officeResource: defineResource(apiVer + "/offices/:officeId", {officeId: "@officeId"}, {
                        getAllOffices: {method: 'GET', params: {}, isArray: true},
                        getAllOfficesInAlphabeticalOrder: {method: 'GET', params: {orderBy: 'name', sortOrder: 'ASC'}, isArray: true},
                        update: { method: 'PUT'}
                    }),
                    officeImportTemplateResource: defineResource(apiVer + "/offices/bulkimporttemplate", {}, {
                    		get: {method: 'GET', params: {}}
                    }),
                    importResource: defineResource(apiVer + "/imports", {}, {
                			getImports: {method: 'GET', params: {}, isArray: true}
                    }),
                    clientResource: defineResource(apiVer + "/clients/:clientId/:anotherresource", {clientId: '@clientId', anotherresource: '@anotherresource', sqlSearch: '@sqlSearch'}, {
                        getAllClients: {method: 'GET', params: {limit: 1000, sqlSearch: '@sqlSearch'}},
                        getAllClientsWithoutLimit: {method: 'GET', params: {}},
                        getClientClosureReasons: {method: 'GET', params: {}},
                        getAllClientDocuments: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT'}
                    }),
                    clientChargesResource: defineResource(apiVer + "/clients/:clientId/charges/:resourceType", {clientId: '@clientId', resourceType: '@resourceType'}, {
                        getCharges: {method: 'GET'},
                        waive:{method:'POST' , params:{command : 'waive'}}
                    }),
                    clientTransactionResource: defineResource(apiVer + "/clients/:clientId/transactions/:transactionId", {clientId: '@clientId', transactionId: '@transactionId'}, {
                        getTransactions: {method: 'GET',isArray: true},
                        undoTransaction :{method:'POST', params:{command:'undo'}}
                    }),
                    clientIdentifierResource: defineResource(apiVer + "/client_identifiers/:clientIdentityId/documents", {clientIdentityId: '@clientIdentityId'}, {
                        get: {method: 'GET', params: {}, isArray: true}
                    }),
                    clientDocumentsResource: defineResource(apiVer + "/clients/:clientId/documents/:documentId", {clientId: '@clientId', documentId: '@documentId'}, {
                        getAllClientDocuments: {method: 'GET', params: {}, isArray: true}
                    }),
                    clientAccountResource: defineResource(apiVer + "/clients/:clientId/accounts", {clientId: '@clientId'}, {
                        getAllClients: {method: 'GET', params: {}}
                    }),
                    clientNotesResource: defineResource(apiVer + "/clients/:clientId/notes/:noteId", {clientId: '@clientId', noteId: '@noteId'}, {
                        getAllNotes: {method: 'GET', params: {}, isArray: true},
                        delete:{method:'DELETE',params:{}},
                        put:{method:'PUT',params:{}}
                    }),
                    clientTemplateResource: defineResource(apiVer + "/clients/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    clientIdenfierTemplateResource: defineResource(apiVer + "/clients/:clientId/identifiers/template", {clientId: '@clientId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    clientIdenfierResource: defineResource(apiVer + "/clients/:clientId/identifiers/:id", {clientId: '@clientId', id: '@id'}, {
                        get: {method: 'GET', params: {}}
                    }),

                    surveyResource: defineResource(apiVer + "/surveys/:surveyId", {surveyId: '@surveyId'}, {
                        getAll: {method: 'GET', params: {}, isArray: true},
                        get: {method: 'GET', params: {surveyId: '@surveyId'}, isArray: false},
                        update: {method: 'PUT', params: {surveyId: '@surveyId'}},
                        activateOrDeactivate: {method: 'POST', params: {surveyId: '@surveyId',command: '@command'}},
                    }),
                    surveyScorecardResource: defineResource(apiVer + "/surveys/scorecards/:surveyId", {surveyId: '@surveyId'}, {
                        post: {method: 'POST', params: {}, isArray: false}
                    }),
                    clientSurveyScorecardResource: defineResource(apiVer + "/surveys/scorecards/clients/:clientId", {clientId: '@clientId'}, {
                        get: {method: 'GET', params: {clientId: '@clientId'}, isArray: true}
                    }),
                    groupResource: defineResource(apiVer + "/groups/:groupId/:anotherresource", {groupId: '@groupId', anotherresource: '@anotherresource'}, {
                        get: {method: 'GET', params: {}},
                        getAllGroups: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT'}
                    }),
                    groupSummaryResource: defineResource(apiVer + "/runreports/:reportSource", {reportSource: '@reportSource'}, {
                        getSummary: {method: 'GET', params: {}}
                    }),
                    groupAccountResource: defineResource(apiVer + "/groups/:groupId/accounts", {groupId: '@groupId'}, {
                        getAll: {method: 'GET', params: {}}
                    }),
                    groupNotesResource: defineResource(apiVer + "/groups/:groupId/notes/:noteId", {groupId: '@groupId', noteId: '@noteId'}, {
                        getAllNotes: {method: 'GET', params: {}, isArray: true}
                    }),
                    groupTemplateResource: defineResource(apiVer + "/groups/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    groupMeetingResource: defineResource(apiVer + "/groups/:groupId/meetings/:templateSource", {groupId: '@groupId', templateSource: '@templateSource'}, {
                        getMeetingInfo: {method: 'GET', params: {}}
                    }),
                    attachMeetingResource: defineResource(apiVer + "/:groupOrCenter/:groupOrCenterId/calendars/:templateSource", {groupOrCenter: '@groupOrCenter', groupOrCenterId: '@groupOrCenterId',
                        templateSource: '@templateSource'}, {
                        update: {method: 'PUT'}
                    }),
                    runReportsResource: defineResource(apiVer + "/runreports/:reportSource", {reportSource: '@reportSource'}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        getReport: {method: 'GET', params: {}}
                    }),
                    reportsResource: defineResource(apiVer + "/reports/:id/:resourceType", {id: '@id', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {id: '@id'}},
                        getReport: {method: 'GET', params: {id: '@id'}, isArray: true},
                        getReportDetails: {method: 'GET', params: {id: '@id'}},
                        update: {method: 'PUT', params: {}}
                    }),
                    xbrlMixtaxonomyResource: defineResource(apiVer + "/mixtaxonomy", {}, {
                        get: {method: 'GET', params: {}, isArray: true}
                    }),
                    xbrlMixMappingResource: defineResource(apiVer + "/mixmapping", {}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT', params: {}}
                    }),
                    DataTablesResource: defineResource(apiVer + "/datatables/:datatablename/:entityId/:resourceId", {datatablename: '@datatablename', entityId: '@entityId', resourceId: '@resourceId'}, {
                        getAllDataTables: {method: 'GET', params: {}, isArray: true},
                        getTableDetails: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    loanProductResource: defineResource(apiVer + "/loanproducts/:loanProductId/:resourceType", {resourceType: '@resourceType', loanProductId: '@loanProductId'}, {
                        getAllLoanProducts: {method: 'GET', params: {}, isArray: true},
                        getProductmix: {method: 'GET', params: {}},
                        put: {method: 'PUT', params: {}}
                    }),
                    chargeResource: defineResource(apiVer + "/charges/:chargeId", {chargeId: '@chargeId'}, {
                        getAllCharges: {method: 'GET', params: {}, isArray: true},
                        getCharge: {method: 'GET', params: {}},
                        update: {method: 'PUT', params: {}}
                    }),
                    chargeTemplateResource: defineResource(apiVer + "/charges/template", {
                        get: {method: 'GET', params: {}, isArray: true},
                        getChargeTemplates: {method: 'GET', params: {}}
                    }),
                    savingProductResource: defineResource(apiVer + "/savingsproducts/:savingProductId/:resourceType", {savingProductId: '@savingProductId', resourceType: '@resourceType'}, {
                        getAllSavingProducts: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT', params: {}}
                    }),
                    fixedDepositProductResource: defineResource(apiVer + "/fixeddepositproducts/:productId/:resourceType", {productId: '@productId', resourceType: '@resourceType'}, {
                        getAllFixedDepositProducts: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT', params: {}}
                    }),
                    recurringDepositProductResource: defineResource(apiVer + "/recurringdepositproducts/:productId/:resourceType", {productId: '@productId', resourceType: '@resourceType'}, {
                        getAllRecurringDepositProducts: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT', params: {}}
                    }),

                    interestRateChartResource: defineResource(apiVer + "/interestratecharts/:chartId/:resourceType", {chartId:'@chartId', resourceType:'@resourceType'}, {
                        getInterestRateChart: {method: 'GET', params: {productId:'@productId', template:'@template', associations:'@chartSlabs'} , isArray:true},
                        update: {method: 'PUT', params: {}},
                        getAllInterestRateCharts: {method: 'GET', params: {productId: '@productId'}, isArray: true}
                    }),
                    batchResource: defineResource(apiVer + "/batches", {}, {
                        post: {method: 'POST', params: {}, isArray: true}
                    }),
                    loanResource: defineResource(apiVer + "/loans/:loanId/:resourceType/:resourceId", {resourceType: '@resourceType', loanId: '@loanId', resourceId: '@resourceId', limit: '@limit', sqlSearch: '@sqlSearch'}, {
                        getAllLoans: {method: 'GET', params: {limit:'@limit', sqlSearch: '@sqlSearch'}},
                        getAllNotes: {method: 'GET', params: {}, isArray: true},
                        put: {method: 'PUT', params: {}}
                    }),
                    loanChargeTemplateResource: defineResource(apiVer + "/loans/:loanId/charges/template", {loanId: '@loanId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanChargesResource: defineResource(apiVer + "/loans/:loanId/charges/:chargeId", {loanId: '@loanId', chargeId: '@chargeId'}, {
                    }),
                    loanCollateralTemplateResource: defineResource(apiVer + "/loans/:loanId/collaterals/template", {loanId: '@loanId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanTrxnsTemplateResource: defineResource(apiVer + "/loans/:loanId/transactions/template", {loanId: '@loanId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanTemplateResource: defineResource(apiVer + "/loans/:loanId/template", {loanId: '@loanId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanTrxnsResource: defineResource(apiVer + "/loans/:loanId/transactions/:transactionId", {loanId: '@loanId', transactionId: '@transactionId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    LoanAccountResource: defineResource(apiVer + "/loans/:loanId/:resourceType/:chargeId", {loanId: '@loanId', resourceType: '@resourceType', chargeId: '@chargeId'}, {
                        getLoanAccountDetails: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    LoanEditDisburseResource: defineResource(apiVer + "/loans/:loanId/disbursements/:disbursementId", {loanId: '@loanId', disbursementId: '@disbursementId'}, {
                        getLoanAccountDetails: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    LoanAddTranchesResource: defineResource(apiVer + "/loans/:loanId/disbursements/editDisbursements", {loanId: '@loanId'}, {
                        update: {method: 'PUT'}
                    }),
                    LoanDocumentResource: defineResource(apiVer + "/loans/:loanId/documents/:documentId", {loanId: '@loanId', documentId: '@documentId'}, {
                        getLoanDocuments: {method: 'GET', params: {}, isArray: true}
                    }),
                    currencyConfigResource: defineResource(apiVer + "/currencies", {}, {
                        get: {method: 'GET', params: {}},
                        update: { method: 'PUT'},
                        upd: { method: 'PUT', params: {}}
                    }),
                    userListResource: defineResource(apiVer + "/users/:userId", {userId: '@userId'}, {
                        getAllUsers: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT' }
                    }),
                    userTemplateResource: defineResource(apiVer + "/users/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    employeeResource: defineResource(apiVer + "/staff/:staffId", {staffId: '@staffId',status:"all"}, {
                        getAllEmployees: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT' }
                    }),
                    globalSearch: defineResource(apiVer + "/search", {query: '@query', resource: '@resource'}, {
                        search: { method: 'GET',
                            params: { query: '@query' , resource: '@resource'},
                            isArray: true
                        }
                    }),
                    globalSearchTemplateResource: defineResource(apiVer + "/search/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    globalAdHocSearchResource: defineResource(apiVer + "/search/advance/", {}, {
                        get: {method: 'GET', params: {}},
                        search: { method: 'POST', isArray: true },
                        getClientDetails : {method: 'POST', params: {clientInfo: true},isArray: true}
                    }),
                    fundsResource: defineResource(apiVer + "/funds/:fundId", {fundId: '@fundId'}, {
                        getAllFunds: {method: 'GET', params: {}, isArray: true},
                        getFund: {method: 'GET', params: {}},
                        update: {method: 'PUT', params: {}}
                    }),
                    accountingRulesResource: defineResource(apiVer + "/accountingrules/:accountingRuleId", {accountingRuleId: '@accountingRuleId'}, {
                        getAllRules: {method: 'GET', params: {associations: 'all'}, isArray: true},
                        getById: {method: 'GET', params: {accountingRuleId: '@accountingRuleId'}},
                        get: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT'}
                    }),
                    accountingRulesTemplateResource: defineResource(apiVer + "/accountingrules/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    accountCoaResource: defineResource(apiVer + "/glaccounts/:glAccountId", {glAccountId: '@glAccountId'}, {
                        getAllAccountCoas: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT' }
                    }),
                    accountCoaTemplateResource: defineResource(apiVer + "/glaccounts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    journalEntriesResource: defineResource(apiVer + "/journalentries/:trxid", {trxid: '@transactionId'}, {
                        get: {method: 'GET', params: {transactionId: '@transactionId'}},
                        reverse: {method: 'POST', params: {command: 'reverse'}},
                        search: {method: 'GET', params: {}}
                    }),
                    accountingClosureResource: defineResource(apiVer + "/glclosures/:accId", {accId: "@accId"}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        getView: {method: 'GET', params: {}}
                    }),
                    periodicAccrualAccountingResource: defineResource(apiVer + "/runaccruals", {}, {
                        run: {method: 'POST', params: {}}
                    }),
                    officeOpeningResource: defineResource(apiVer + "/journalentries/openingbalance", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    codeResources: defineResource(apiVer + "/codes/:codeId", {codeId: "@codeId"}, {
                        getAllCodes: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT', params: {} }
                    }),
                    codeValueResource: defineResource(apiVer + "/codes/:codeId/codevalues/:codevalueId", {codeId: '@codeId', codevalueId: '@codevalueId'}, {
                        getAllCodeValues: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT', params: {} }
                    }),
					hookResources: defineResource(apiVer + "/hooks/:hookId", {hookId: "@hookId"}, {
                        getAllHooks: {method: 'GET', params: {}, isArray: true},
                        getHook: {method: 'GET', params: {}},
						update: {method: 'PUT', params: {}}
                    }),
					hookTemplateResource: defineResource(apiVer + "/hooks/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    entityToEntityResource: defineResource(apiVer + "/entitytoentitymapping/:mappingId/:fromId/:toId", {mappingId: '@mappingId'}, {
                        getAllEntityMapping: {method: 'GET', params: {}, isArray: true},
                        getEntityMapValues: {method: 'GET', params: {}}
                    }),
                    entityMappingResource: defineResource(apiVer + "/entitytoentitymapping/:mapId", {mappingId: '@mappingId'}, {
                        getAllEntityMapping: {method: 'GET', params: {}, isArray: true},
                        getEntityMapValues: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT', params: {}},
                        delete:{method:'DELETE',params:{}}
                    }),
                    accountNumberResources: defineResource(apiVer + "/accountnumberformats/:accountNumberFormatId",{accountNumberFormatId: '@accountNumberFormatId'}, {
                        get:{method:'GET',params:{accountNumberFormatId:'@accountNumberFormatId'}},
                        getAllPreferences:{method:'GET',params:{},isArray: true},
                        put:{method:'PUT'},
                        getPrefixType:{method:'GET',params:{template:true}},
                        delete:{method:'DELETE',params:{}}
                    }),
                    accountNumberTemplateResource: defineResource(apiVer + "/accountnumberformats/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    holResource: defineResource(apiVer + "/holidays", {}, {
                        getAllHols: {method: 'GET', params: {}, isArray: true}
                    }),
                    holValueResource: defineResource(apiVer + "/holidays/:holId", {holId: '@holId'}, {
                        getholvalues: {method: 'GET', params: {}},
                        update: { method: 'PUT', params: {}}
                    }),
                    holidayTemplateResource: defineResource(apiVer + "/holidays/template", {}, {
                        get: {method: 'GET', params: {}, isArray: true}
                    }),
                    savingsTemplateResource: defineResource(apiVer + "/savingsaccounts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    savingsResource: defineResource(apiVer + "/savingsaccounts/:accountId/:resourceType/:chargeId", {accountId: '@accountId', resourceType: '@resourceType', chargeId: '@chargeId'}, {
                        get: {method: 'GET', params: {}},
                        getAllNotes: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT'}
                    }),
                    savingsChargeResource: defineResource(apiVer + "/savingsaccounts/:accountId/charges/:resourceType", {accountId: '@accountId', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    savingsTrxnsTemplateResource: defineResource(apiVer + "/savingsaccounts/:savingsId/transactions/template", {savingsId: '@savingsId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId'}}
                    }),
                    savingsTrxnsResource: defineResource(apiVer + "/savingsaccounts/:savingsId/transactions/:transactionId", {savingsId: '@savingsId', transactionId: '@transactionId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId', transactionId: '@transactionId'}}
                    }),
                    savingsOnHoldTrxnsResource: defineResource(apiVer + "/savingsaccounts/:savingsId/onholdtransactions", {savingsId: '@savingsId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    fixedDepositAccountResource: defineResource(apiVer + "/fixeddepositaccounts/:accountId/:resourceType", {accountId: '@accountId', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    fixedDepositAccountTemplateResource: defineResource(apiVer + "/fixeddepositaccounts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    fixedDepositTrxnsTemplateResource: defineResource(apiVer + "/fixeddepositaccounts/:savingsId/transactions/template", {savingsId: '@savingsId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId'}}
                    }),
                    fixedDepositTrxnsResource: defineResource(apiVer + "/fixeddepositaccounts/:savingsId/transactions/:transactionId", {savingsId: '@savingsId', transactionId: '@transactionId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId', transactionId: '@transactionId'}}
                    }),
                    recurringDepositAccountResource: defineResource(apiVer + "/recurringdepositaccounts/:accountId/:resourceType", {accountId: '@accountId', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT'}
                    }),
                    recurringDepositAccountTemplateResource: defineResource(apiVer + "/recurringdepositaccounts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    recurringDepositTrxnsTemplateResource: defineResource(apiVer + "/recurringdepositaccounts/:savingsId/transactions/template", {savingsId: '@savingsId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId'}}
                    }),
                    recurringDepositTrxnsResource: defineResource(apiVer + "/recurringdepositaccounts/:savingsId/transactions/:transactionId", {savingsId: '@savingsId', transactionId: '@transactionId'}, {
                        get: {method: 'GET', params: {savingsId: '@savingsId', transactionId: '@transactionId'}}
                    }),
                    accountTransferResource: defineResource(apiVer + "/accounttransfers/:transferId", {transferId: '@transferId'}, {
                        get: {method: 'GET', params: {transferId: '@transferId'}}
                    }),
                    accountTransfersTemplateResource: defineResource(apiVer + "/accounttransfers/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    standingInstructionResource: defineResource(apiVer + "/standinginstructions/:standingInstructionId", {standingInstructionId: '@standingInstructionId'}, {
                        get: {method: 'GET', params: {standingInstructionId: '@standingInstructionId'}},
                        getTransactions: {method: 'GET', params: {standingInstructionId: '@standingInstructionId', associations: 'transactions'}},
                        withTemplate: {method: 'GET', params: {standingInstructionId: '@standingInstructionId', associations: 'template'}},
                        search: {method: 'GET', params: {}},
                        update: { method: 'PUT', params: {command: 'update'}},
                        cancel: { method: 'PUT', params: {command: 'delete'}}
                    }),
                    standingInstructionTemplateResource: defineResource(apiVer + "/standinginstructions/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    standingInstructionHistoryResource: defineResource(apiVer + "/standinginstructionrunhistory", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    centerAccountResource: defineResource(apiVer + "/centers/:centerId/accounts", {centerId: '@centerId'}, {
                        getAll: {method: 'GET', params: {}, isArray: true}
                    }),
                    centerResource: defineResource(apiVer + "/centers/:centerId/:anotherresource", {centerId: '@centerId', anotherresource: '@anotherresource'}, {
                        get: {method: 'GET', params: {}},
                        getAllCenters: {method: 'GET', params: {}, isArray: true},
                        getAllMeetingFallCenters: {method: 'GET', params: {}, isArray: true},
                        update: { method: 'PUT'}
                    }),
                    centerMeetingResource: defineResource(apiVer + "/centers/:centerId/meetings/:templateSource", {centerId: '@centerId', templateSource: '@templateSource'}, {
                        getMeetingInfo: {method: 'GET', params: {}}
                    }),
                    centerTemplateResource: defineResource(apiVer + "/centers/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    jobsResource: defineResource(apiVer + "/jobs/:jobId/:resourceType", {jobId: '@jobId', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        getJobDetails: {method: 'GET', params: {}},
                        getJobHistory: {method: 'GET', params: {}},
                        update: {method: 'PUT', params: {}}
                    }),
                    schedulerResource: defineResource(apiVer + "/scheduler", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    assignStaffResource: defineResource(apiVer + "/groups/:groupOrCenterId", {groupOrCenterId: '@groupOrCenterId'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    configurationResource: defineResource(apiVer + "/configurations/:id", {id: '@id'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT', params: {}}
                    }),
                    configurationResourceByName: defineResource(apiVer + "/configurations/", {configName: '@configName'}, {
                        get: {method: 'GET', params: {configName:'configName'}}
                    }),
                    cacheResource: defineResource(apiVer + "/caches", {}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        update: {method: 'PUT', params: {}}
                    }),
                    templateResource: defineResource(apiVer + "/templates/:templateId/:resourceType", {templateId: '@templateId', resourceType: '@resourceType'}, {
                        get: {method: 'GET', params: {}, isArray: true},
                        getTemplateDetails: {method: 'GET', params: {}},
                        update: {method: 'PUT', params: {}}
                    }),
                    loanProductTemplateResource: defineResource(apiVer + "/loanproducts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanReassignmentResource: defineResource(apiVer + "/loans/loanreassignment/:templateSource", {templateSource: '@templateSource'}, {
                        get: {method: 'GET', params: {}}
                    }),
                    loanRescheduleResource: defineResource(apiVer + "/rescheduleloans/:scheduleId",{scheduleId:'@scheduleId', command: '@command'},{
                     get: {method: 'GET',params:{}},
                     getAll: {method: 'GET', params: {}, isArray: true},
                     template: {method: 'GET',params:{}},
                     preview:{method:'GET',params:{command:'previewLoanReschedule'}},
                     put: {method: 'POST', params: {command:'reschedule'}},
                     reject:{method:'POST',params:{command:'reject'}},
                     approve:{method:'POST',params:{command:'approve'}}
                     }),
                     auditResource: defineResource(apiVer + "/audits/:templateResource", {templateResource: '@templateResource'}, {
                        get: {method: 'GET', params: {}},
                        search: {method: 'GET', params: {}, isArray: false}
                    }),
                    guarantorResource: defineResource(apiVer + "/loans/:loanId/guarantors/:templateResource", {loanId: '@loanId', templateResource: '@templateResource'}, {
                        get: {method: 'GET', params: {}},
                        update: {method: 'PUT', params: {}},
                        delete: { method: 'DELETE', params: {guarantorFundingId: '@guarantorFundingId'}}
                    }),
                    guarantorAccountResource: defineResource(apiVer + "/loans/:loanId/guarantors/accounts/template", {loanId: '@loanId'}, {
                        get: {method: 'GET', params: {clientId: '@clientId'}},
                        update: {method: 'PUT', params: {}}
                    }),
                    checkerInboxResource: defineResource(apiVer + "/makercheckers/:templateResource", {templateResource: '@templateResource'}, {
                        get: {method: 'GET', params: {}},
                        search: {method: 'GET', params: {}, isArray: true}
                    }),
                    officeToGLAccountMappingResource: defineResource(apiVer + "/financialactivityaccounts/:mappingId", {mappingId: '@mappingId'}, {
                        get: {method: 'GET', params: {mappingId: '@mappingId'}},
                        getAll: {method: 'GET', params: {}, isArray: true},
                        withTemplate: {method: 'GET', params: {mappingId: '@mappingId', template: 'true'}},
                        search: {method: 'GET', params: {}},
                        create: {method: 'POST', params: {}},
                        update: { method: 'PUT', params: {mappingId: '@mappingId'}},
                        delete: { method: 'DELETE', params: {mappingId: '@mappingId'}}
                    }),
                    officeToGLAccountMappingTemplateResource: defineResource(apiVer + "/financialactivityaccounts/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    tellerResource: defineResource(apiVer + "/tellers/:tellerId", {tellerId: "@tellerId"}, {
                        getAllTellers: {method: 'GET', params: {}, isArray: true},
                        get: {method: 'GET', params: {tellerId: '@tellerId'}},
                        update: { method: 'PUT', params: {tellerId: '@tellerId'}},
                        delete: { method: 'DELETE', params: {tellerId: '@tellerId'}}
                    }),
                    tellerCashierResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        getAllCashiersForTeller: {method: 'GET', params: {tellerId: "@tellerId"}, isArray: false},
                        getCashier: {method: 'GET', params:{tellerId: "@tellerId", cashierId: "@cashierId"}},
                        update: { method: 'PUT', params: {tellerId: "@tellerId", cashierId: "@cashierId"}},
                        delete: { method: 'DELETE', params: {tellerId: "@tellerId", cashierId: "@cashierId"}}
                    }),
                    tellerCashierTemplateResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/template", {tellerId: "@tellerId"}, {
                        get: {method: 'GET', params: {tellerId: '@tellerId'}, isArray: false}
                    }),
                    tellerCashierTxnsResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId/transactions", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        getCashierTransactions: {method: 'GET', params: {tellerId: "@tellerId", cashierId: "@cashierId"}, isArray: true}
                    }),
                    tellerCashierSummaryAndTxnsResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId/summaryandtransactions", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        getCashierSummaryAndTransactions: {method: 'GET', params: {tellerId: "@tellerId", cashierId: "@cashierId"}, isArray: false}
                    }),
                    tellerCashierTxnsAllocateResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId/allocate", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        allocate: { method: 'POST', params: {tellerId: "@tellerId", cashierId: "@cashierId", command: "allocate"}}
                    }),
                    tellerCashierTxnsSettleResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId/settle", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        settle: { method: 'POST', params: {tellerId: "@tellerId", cashierId: "@cashierId", command: "settle"}}
                    }),
                    cashierTxnTemplateResource: defineResource(apiVer + "/tellers/:tellerId/cashiers/:cashierId/transactions/template", {tellerId: "@tellerId", cashierId: "@cashierId"}, {
                        get: {method: 'GET', params: {tellerId: "@tellerId", cashierId: "@cashierId"}, isArray: false}
                    }),
                    collectionSheetResource: defineResource(apiVer + "/collectionsheet", {}, {
                    }),
                    workingDaysResource: defineResource(apiVer + "/workingdays", {}, {
                        get: {method: 'GET', params: {}},
                        put: {method: 'PUT', params:{}}
                    }),
                    workingDaysResourceTemplate: defineResource(apiVer + "/workingdays/template", {}, {
                       get: {method: 'GET', params: {}}
                    }),
                    passwordPrefTemplateResource: defineResource(apiVer + "/passwordpreferences/template", {}, {
                        get: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params:{}}
                    }),
                    passwordPrefResource : defineResource(apiVer + "/passwordpreferences", {}, {
                        put: {method: 'PUT', params:{}}
                    }),
                    paymentTypeResource: defineResource(apiVer + "/paymenttypes/:paymentTypeId", {paymentTypeId: "@paymentTypeId"}, {
                        getAll: {method: 'GET', params: {}, isArray: true},
                        get: {method: 'GET' , params: {paymentTypeId: '@paymentTypeId'}},
                        update: {method: 'PUT', params: {paymentTypeId: '@paymentTypeId'}}
                    }),
                    notificationsResource: defineResource(apiVer + "/notifications", {},{
                        getAllNotifications: {method: 'GET', params: {isRead: true, sqlSearch: '@sqlSearch'}},
                        getAllUnreadNotifications: {method: 'GET', params: {isRead: false, sqlSearch: '@sqlSearch'}},
                        update: {method: 'PUT', params:{}}
                    }),
                    externalServicesS3Resource: defineResource(apiVer + "/externalservice/S3", {},{
                        get: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params:{}}
                    }),
                    externalServicesSMTPResource: defineResource(apiVer + "/externalservice/SMTP", {},{
                        get: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params:{}}
                    }),
                    externalServicesNotificationResource: defineResource(apiVer + "/externalservice/NOTIFICATION", {},{
                        get: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params:{}}
                    }),
                    externalServicesResource: defineResource(apiVer + "/externalservice/:id", {id: '@id'},{
                        get: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params:{}}
                    }),
                    clientaddressFields:defineResource(apiVer+"/client/addresses/template",{},{
                            get:{method:'GET',params:{}}
                        }
                    ),
                    addressFieldConfiguration:defineResource(apiVer+"/fieldconfiguration/:entity",{},{
                        get:{method:'GET',params:{},isArray:true }
                    }),
                    clientAddress:defineResource(apiVer+"/client/:clientId/addresses",{},{

                        post:{method:'POST',params:{type:'@type'}},
                        get:{method:'GET',params:{type:'@type',status:'@status'},isArray:true},
                        put:{method:'PUT',params:{}}
                    }),
                    familyMember:defineResource(apiVer+"/clients/:clientId/familymembers/:clientFamilyMemberId",{},{

                        get:{method: 'GET',params:{} },
                        delete:{method: 'DELETE',params:{}},
                            put:{method:'PUT',params:{}}

                    }),
                    familyMembers:defineResource(apiVer+"/clients/:clientId/familymembers/",{},{

                        get:{method: 'GET',isArray: true },
                        post:{method:'POST',params:{}}


                    }),
                    familyMemberTemplate:defineResource(apiVer+"/clients/:clientId/familymembers/template",{},{
                        get:{method: 'GET',params:{}}
                    }),
                   provisioningcriteria: defineResource(apiVer + "/provisioningcriteria/:criteriaId",{criteriaId:'@criteriaId'},{
                         get: {method: 'GET',params:{}},
                        getAll: {method: 'GET',params:{}, isArray : true},
                        template: {method: 'GET',params:{}},
                        post:{method:'POST',params:{}},
                        put: {method: 'PUT', params: {}}
                    }),
                    provisioningentries: defineResource(apiVer + "/provisioningentries/:entryId",{entryId:'@entryId'},{
                        get: {method: 'GET',params:{}},
                        getAll: {method: 'GET',params:{}},
                        template: {method: 'GET',params:{}},
                        post:{method:'POST',params:{}},
                        put: {method: 'PUT', params: {}},
                        createJournals:{method:'POST', params:{command : 'createjournalentry'}},
                        reCreateProvisioningEntries:{method:'POST', params:{command : 'recreateprovisioningentry'}},
                        getJournals: {method: 'GET', params: {entryId: '@entryId'}}
                    }),
                    provisioningjournals: defineResource(apiVer + "/journalentries/provisioning", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    provisioningentriesSearch: defineResource(apiVer + "/provisioningentries/entries", {}, {
                        get: {method: 'GET', params: {}}
                    }),

                    provisioningcategory: defineResource(apiVer + "/provisioningcategory", {}, {
                        getAll: {method: 'GET', params: {}, isArray : true}
                    }),

                    floatingrates: defineResource(apiVer + "/floatingrates/:floatingRateId",{floatingRateId:'@floatingRateId'},{
                        get: {method: 'GET',params:{}},
                        getAll: {method: 'GET',params:{}, isArray : true},
                        post:{method:'POST',params:{}},
                        put: {method: 'PUT', params: {}}
                    }),
                    variableinstallments: defineResource(apiVer + "/loans/:loanId/schedule",{loanId:'@loanId'},{
                        validate:{method:'POST',params:{command: 'calculateLoanSchedule'}},
                        addVariations:{method:'POST',params:{command: 'addVariations'}},
                        deleteVariations:{method:'POST',params:{command: 'deleteVariations'}}
                    }),
                    taxcomponent: defineResource(apiVer + "/taxes/component/:taxComponentId",{taxComponentId:'@taxComponentId'},{
                        getAll: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params: {}}
                    }),
                    taxcomponenttemplate: defineResource(apiVer + "/taxes/component/template",{},{
                    }),
                    taxgroup: defineResource(apiVer + "/taxes/group/:taxGroupId",{taxGroupId:'@taxGroupId'},{
                        getAll: {method: 'GET', params: {}, isArray : true},
                        put: {method: 'PUT', params: {}}
                    }),
                    taxgrouptemplate: defineResource(apiVer + "/taxes/group/template",{},{
                    }),

                    productsResource: defineResource(apiVer + "/products/:productType/:resourceType",{productType:'@productType', resourceType:'@resourceType'},{
                        template: {method: 'GET',params:{}},
                        post: {method: 'POST', params:{}}
                    }),
                    shareProduct: defineResource(apiVer + "/products/share/:shareProductId",{shareProductId:'@shareProductId'},{
                        post:{method:'POST',params:{}},
                        getAll: {method: 'GET',params:{}},
                        get: {method: 'GET', params:{}},
                        put: {method: 'PUT', params:{}}
                    }),
                    shareAccountTemplateResource: defineResource(apiVer + "/accounts/share/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),
                    sharesAccount: defineResource(apiVer + "/accounts/share/:shareAccountId", {shareAccountId: '@shareAccountId'}, {
                        get: {method: 'GET', params: {}},
                        post: {method: 'POST', params:{}},
                        put: {method: 'PUT', params:{}}
                    }),
                    shareproductdividendresource: defineResource(apiVer + "/shareproduct/:productId/dividend/:dividendId", {productId: '@productId', dividendId: '@dividendId'}, {
                        get: {method: 'GET', params: {}},
                        getAll: {method: 'GET',params:{}},
                        post: {method: 'POST', params:{}},
                        put: {method: 'PUT', params:{}},
                        approve: {method: 'PUT', params:{command: 'approve'}}
                    }),

                    smsCampaignTemplateResource: defineResource(apiVer + "/smscampaigns/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),

                    smsCampaignResource: defineResource(apiVer + "/smscampaigns/:campaignId/:additionalParam", {campaignId: '@campaignId', additionalParam: '@additionalParam'}, {
                        getAll: {method: 'GET', params: {}},
                        get: {method: 'GET', params: {}},
                        save: {method: 'POST', params: {}},
                        update: {method: 'PUT', params: {}},
                        preview: {method: 'POST', params: {}},
                        withCommand: {method: 'POST', params: {}},
                        delete: {method: 'DELETE', params: {}}
                    }),

                    smsResource: defineResource(apiVer + "/sms/:campaignId/messageByStatus", {campaignId: '@campaignId', additionalParam: '@additionalParam'}, {
                        getByStatus: {method: 'GET', params:{}}
                    }),

                    entityDatatableChecksResource: defineResource(apiVer + "/entityDatatableChecks/:entityDatatableCheckId/:additionalParam", {entityDatatableCheckId: '@entityDatatableCheckId', additionalParam: '@additionalParam'}, {
                        getAll: {method: 'GET', params: {}},
                        get: {method: 'GET', params: {}},
                        save: {method: 'POST', params: {}},
                        delete: {method: 'DELETE', params: {}}
                    }),

					adHocQueryResource: defineResource(apiVer + "/adhocquery/:adHocId", {adHocId: '@adHocId'}, {
                        getAllAdHocQuery: {method: 'GET', params: {}, isArray: true},
                        disableAdHocQuery: {method: 'POST'},
                        enableAdHocQuery: {method: 'POST'},
                        update: { method: 'PUT' }
                    }),
                    adHocQueryTemplateResource: defineResource(apiVer + "/adhocquery/template", {}, {
                        get: {method: 'GET', params: {}}
                    }),

                    twoFactorResource: defineResource(apiVer+"/twofactor", {deliveryMethod: "@deliveryMethod", extendedToken: "@extendedToken"}, {
                        getDeliveryMethods: {method: 'GET', params: {}, isArray: true},
                        requestOTP: {method: 'POST', params: {deliveryMethod: "@deliveryMethod", extendedToken: "@extendedToken"}}
                    }),
                    twoFactorConfigResource: defineResource(apiVer+"/twofactor/configure", {}, {
                        getAllConfigs: {method: 'GET', params: {}},
                        put: {method: 'PUT', params: {}}
                    })
                };
            }];
        }
    });
    mifosX.ng.services.config(function ($provide) {
        $provide.provider('ResourceFactory', mifosX.services.ResourceFactoryProvider);
    }).run(function ($log) {
        $log.info("ResourceFactory initialized");
    });
}(mifosX.services || {}));
