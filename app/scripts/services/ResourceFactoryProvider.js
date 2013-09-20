(function(module) {
  mifosX.services = _.extend(module, {
    ResourceFactoryProvider: function() {
      var baseUrl = "" , apiVer = "/mifosng-provider/api/v1";
      this.setBaseUrl = function(url) {baseUrl = url;};
      this.$get = ['$resource', function(resource) {
        var defineResource = function(url, paramDefaults, actions) {
          return resource(baseUrl + url, paramDefaults, actions);
        };
        return {
          userResource: defineResource(apiVer + "/users/:userId", {}, {
            getAllUsers: {method: 'GET', params: {fields: "id,firstname,lastname,username,officeName"}, isArray: true}
          }),
          roleResource: defineResource(apiVer + "/roles/:roleId", {}, {
            getAllRoles: {method: 'GET', params: {}, isArray: true}
          }),
          officeResource: defineResource(apiVer + "/offices/:officeId", {officeId:"@officeId"}, {
            getAllOffices: {method: 'GET', params: {}, isArray: true}
          }),

          clientResource: defineResource(apiVer + "/clients/:clientId/:anotherresource", {clientId:'@clientId',anotherresource:'@anotherresource'}, {
            getAllClients: {method: 'GET', params: {}},
            getAllClientDocuments: {method: 'GET', params: {}, isArray: true},
            update: { method: 'PUT'}
          }),
          clientIdentifierResource: defineResource(apiVer + "/client_identifiers/:clientIdentityId/documents", {clientIdentityId:'@clientIdentityId'}, {
            get: {method: 'GET', params: {}, isArray:true}
          }),
          clientAccountResource: defineResource(apiVer + "/clients/:clientId/accounts", {clientId:'@clientId'}, {
            getAllClients: {method: 'GET', params: {}}
          }),
          clientNotesResource: defineResource(apiVer + "/clients/:clientId/notes", {clientId:'@clientId'}, {
            getAllNotes: {method: 'GET', params: {}, isArray:true}
          }),
          clientTemplateResource: defineResource(apiVer + "/clients/template", {}, {
            get: {method: 'GET', params: {}}
          }),
          groupResource: defineResource(apiVer + "/groups/:groupId/:anotherresource", {groupId:'@groupId',anotherresource:'@anotherresource'}, {
              get: {method: 'GET', params: {}},
              update: { method: 'PUT'}
          }),
          groupSummaryResource: defineResource(apiVer + "/runreports/:reportSource",{reportSource: '@reportSource'}, {
              getSummary: {method: 'GET', params: {}}
          }),
          groupAccountResource: defineResource(apiVer + "/groups/:groupId/accounts", {groupId:'@groupId'}, {
              getAll: {method: 'GET', params: {}}
          }),
          groupNotesResource: defineResource(apiVer + "/groups/:groupId/notes", {groupId:'@groupId'}, {
              getAllNotes: {method: 'GET', params: {}, isArray:true}
          }),
          groupTemplateResource: defineResource(apiVer + "/groups/template", {}, {
              get: {method: 'GET', params: {}}
          }),
          runReportsResource: defineResource(apiVer + "/runreports/:reportSource", {reportSource : '@reportSource'}, {
            get: {method: 'GET', params: {}, isArray:true},
            getReport: {method: 'GET', params: {}}
          }),
          reportsResource: defineResource(apiVer + "/reports/:id", {id:'@id'}, {
            get: {method: 'GET', params: {id:'@id'}}
          }),
          DataTablesResource: defineResource(apiVer + "/datatables/:datatablename/:clientId", {datatablename:'@datatablename',clientId:'@clientId'}, {
            getAllDataTables: {method: 'GET', params: {}, isArray:true},
            getTableDetails: {method: 'GET', params: {}}
          }),
          loanProductResource: defineResource(apiVer + "/loanproducts/:loanProductId", {loanProductId:'@loanProductId'}, {
            getAllLoanProducts: {method: 'GET', params: {}, isArray:true}
          }),
          chargeResource: defineResource(apiVer + "/charges/:chargeId", {chargeId:'@chargeId'}, {
            getAllCharges: {method: 'GET', params: {}, isArray:true}
          }),
          savingProductResource: defineResource(apiVer + "/savingsproducts/:savingProductId", {savingProductId:'@savingProductId'}, {
            getAllSavingProducts: {method: 'GET', params: {}, isArray:true}
          }),
          loanResource: defineResource(apiVer + "/loans/:loanId/:resourceType", {resourceType:'@resourceType', loanId:'@loanId'}, {
            getAllLoans: {method: 'GET', params: {}},
          }),
          LoanAccountResource: defineResource(apiVer + "/loans/:loanId", {loanId:'@loanId'}, {
            getLoanAccountDetails: {method: 'GET', params: {}}
          }),
          LoanDocumentResource: defineResource(apiVer + "/loans/:loanId/documents", {loanId:'@loanId'}, {
            getLoanDocuments: {method: 'GET', params: {} , isArray: true}
          }),
          currencyConfigResource: defineResource(apiVer + "/currencies", {}, {
            update: { method: 'PUT'}
          }),
          userListResource: defineResource(apiVer + "/users/:userId", {userId:'@userId'}, {
            getAllUsers: {method: 'GET', params: {}, isArray: true},
            update: { method: 'PUT' }
          }),
          userTemplateResource: defineResource(apiVer + "/users/template", {}, {
            get: {method: 'GET', params: {}}
          }),
          employeeResource: defineResource(apiVer + "/staff/:staffId", {staffId:'@staffId'}, {
            getAllEmployees: {method: 'GET', params: {}, isArray: true},
            update: { method: 'PUT' }
          }),
          globalSearch: defineResource(apiVer + "/search", {query:'@query'}, {
            search: { method: 'GET',
                      params: { query: '@query'} ,
                      isArray:true
                    }
          }),
          fundsResource: defineResource(apiVer + "/funds/:fundId", {fundId:'@fundId'}, {
            getAllFunds: {method: 'GET', params: {}, isArray: true}
          }),
          accountingRulesResource: defineResource(apiVer + "/accountingrules/:accountingRuleId", {accountingRuleId:'@accountingRuleId'}, {
            getAllRules: {method: 'GET', params: {associations : 'all'}, isArray: true},
            getById: {method: 'GET', params: {accountingRuleId:'@accountingRuleId'}},
            get: {method: 'GET', params: {}, isArray: true},
            update: {method: 'PUT'}
          }),
          accountingRulesTemplateResource: defineResource(apiVer + "/accountingrules/template", {}, {
            get: {method: 'GET', params: {}}
          }),
          accountCoaResource: defineResource(apiVer + "/glaccounts/:glAccountId", {glAccountId:'@glAccountId'}, {
            getAllAccountCoas: {method: 'GET', params: {}, isArray: true},
            update: { method: 'PUT' }
          }),
          accountCoaTemplateResource: defineResource(apiVer + "/glaccounts/template", {}, {
            get: {method: 'GET', params: {}}
          }),
          journalEntriesResource: defineResource(apiVer + "/journalentries/:trxid", {trxid:'@transactionId'}, {
            get: {method: 'GET', params: {transactionId:'@transactionId'}},
            reverse: {method: 'POST', params:{command:'reverse'}},
            search:{method: 'GET', params: {}}
          }),
          accountingClosureResource: defineResource(apiVer + "/glclosures", {}, {
            get: {method: 'GET', params: {}, isArray:true}
          }) ,
          codeResources: defineResource(apiVer + "/codes/:codeId", {codeId:"@codeId"}, {
                getAllCodes: {method: 'GET', params: {}, isArray: true}
          }),
          codeValueResource: defineResource(apiVer + "/codes/:codeId/codevalues/:codevalueId", {codeId:'@codeId',codevalueId:'@codevalueId'}, {
            getAllCodeValues: {method: 'GET', params: {}, isArray:true},
            update: { method: 'PUT', params: {}, isArray:true }
          }),
          holResource: defineResource(apiVer + "/holidays", {}, {
              getAllHols: {method: 'GET', params: {}, isArray: true}
          }),
          holValueResource: defineResource(apiVer + "/holidays/:holId", {holId:'@holId'}, {
              getholvalues: {method: 'GET', params: {}}
          }),
          savingsTemplateResource: defineResource(apiVer + "/savingsaccounts/template", {}, {
              get: {method: 'GET', params: {}}
          }),
          savingsResource: defineResource(apiVer + "/savingsaccounts/:accountId", {accountId:'@accountId'}, {
              get: {method: 'GET', params: {accountId:'@accountId'}},
              update: {method: 'PUT'}
          }),
          savingsTrxnsTemplateResource: defineResource(apiVer + "/savingsaccounts/:savingsId/transactions/template", {savingsId:'@savingsId'}, {
              get: {method: 'GET', params: {savingsId:'@savingsId'}}
          }),
          savingsTrxnsResource: defineResource(apiVer + "/savingsaccounts/:savingsId/transactions/:transactionId", {savingsId:'@savingsId', transactionId:'@transactionId'}, {
              get: {method: 'GET', params: {savingsId:'@savingsId', transactionId:'@transactionId'}}
          }),
          accountTransferResource: defineResource(apiVer + "/accounttransfers/:transferId", {transferId:'@transferId'}, {
              get: {method: 'GET', params: {transferId:'@transferId'}}
          }),
          accountTransfersTemplateResource: defineResource(apiVer + "/accounttransfers/template", {}, {
              get: {method: 'GET', params: {}}
          })
        };
      }];
    }
  });
  mifosX.ng.services.config(function($provide) {
    $provide.provider('ResourceFactory', mifosX.services.ResourceFactoryProvider);
  }).run(function($log) { $log.info("ResourceFactory initialized"); });
}(mifosX.services || {}));
