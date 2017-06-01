/*
In this file all the fineract api requests are cached using sw-toolbox library
*/
console.log("Caching all the fineract APIs");

//Clients GET requests
toolbox.precache([
  '/',
  'index.html',
  'service-worker.js'
]);
toolbox.router.get(/fineract-provider\/api\/v1\/clients/, toolbox.cacheFirst, {});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}\/transaction\/{transactionId}/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}\/transactions?limit=5&offset=0/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}\/accounts/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}\/charges\/{clientChargeId}/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}\/charges/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/datatables/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/runreports\/{reportName}/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/{resource}\/{resourceId}\/notes/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/{entityType}\/{entityId}\/documents/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}\/identifiers/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}\/identifiers\/template/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}\/identifiers\/{identifierId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}\/images/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/standinginstructions/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/standinginstructions\/{standingInstructionId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/standinginstructionrunhistory/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/accounttransfers/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/accounttransfers\/{transferId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/accounttransfers\/templateRefundByTransfer/,toolbox.cacheFirst,{});
toolbox.router.get(/api\/v1\/clients\/{clientId}\/charges?limit=5&offset=0/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}\/charges\/{clientChargeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/fieldconfiguration\/ADDRESS/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/client\/{clientId}\/addresses/,toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/client\/{clientId}\/addresses?type=804&&status=false/,toolbox.cacheFirst,{});



//Loans
//Loans get request

toolbox.router.get(/fineract-provider\/api\/v1\/loans/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loans\/{loanId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions\/{transactionId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loans\/{loanId}\/charges\/{chargeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loans\/{loanId}\/guarantors/, toolbox.networkFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loans\/{loanId}\/guarantors\/{guarantorId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loans\/{loanId}\/collaterals/, toolbox.networkFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loans\/{loanId}\/collaterals\/{collateralId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/rescheduleloans\/{requestId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/rescheduleloans\/{requestId}/, toolbox.cacheFirst,{});


//Template

toolbox.router.get(/fineract-provider\/api\/v1\/clients\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/groups\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loanproducts\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loanproducts\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loans\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/charges\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/offices\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/users\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/hooks\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/audits\/searchtemplate/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/reports\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/accountingrules\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/savingsproducts\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/savingsaccounts\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/transactions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/standinginstructions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/accounttransfers\/template/, toolbox.cacheFirst,{});


//GET requests Users

toolbox.router.get(/fineract-provider\/api\/v1\/users/, toolbox.cacheFirst, {});
toolbox.router.get(/fineract-provider\/api\/v1\/users\/{userId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/roles/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/roles\/{roleId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/roles\/{roleId}\/permissions/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/permissions/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/passwordpreferences\/template/, toolbox.cacheFirst,{});

//Accounting

//Accounting get requests

toolbox.router.get(/fineract-provider\/api\/v1\/glaccounts/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/glaccounts\/{glaccountsId}/, toolbox.cacheFirst,{})
toolbox.router.get(/fineract-provider\/api\/v1\/glclosures/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/glclosures\/{glclosureId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/journalentries/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/journalentries\/{entryId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/accountingrules/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/accountingrules\/{accountingruleId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/financialactivityaccounts/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/financialactivityaccounts\/{financialactivityaccountId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/provisioningentries/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/provisioningentries\/{privisioningEntryId}/, toolbox.cacheFirst,{});

//Shares

//Shares GET requests

toolbox.router.get(/fineract-provider\/api\/v1\/accounts\/share/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/accounts\/share\/{accountId}/, toolbox.cacheFirst,{});

//Groups


toolbox.router.get(/fineract-provider\/api\/v1\/groups/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/groups\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/groups\/1/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/groups\/{groupId}\/accounts/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/centers/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/centers\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/centers\/{centerId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/centers\/{centerId}\/accounts/, toolbox.cacheFirst,{});

//Non Core section


//GET requests

toolbox.router.get(/fineract-provider\/api\/v1\/datatables/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/datatables\/{datatable}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/datatables\/{datatable}\/{apptableId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/{resource}\/{resourceId}\/notes/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/{resource}\/{resourceId}\/notes\/{noteId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/{entityType}\/{entityId}\/documents/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/documents\/{clientId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/{entityType}\/{entityId}\/documents\/{documentId}\/attachment/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/search/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/survey/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/survey\/{surveyName}/, toolbox.cacheFirst,{});


//report


//GET requests

toolbox.router.get(/fineract-provider\/api\/v1\/reports/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/reports\/{id}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/runreports\/{reportName}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/runreports\/ClientSummary/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/runreports\/GroupSummaryCounts/, toolbox.cacheFirst,{});

//SPM


//GET requests

toolbox.router.get(/fineract-provider\/api\/v1\/surveys/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/surveys\/1/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/surveys\/1\/lookuptables\/test-table/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/surveys\/1\/scorecards/, toolbox.cacheFirst,{});

//SYSTEM


//GET requests

toolbox.router.get(/fineract-provider\/api\/v1\/configurations/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/configurations\/{configId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/hooks/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/hooks\/{hookId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/accountnumberformats/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/accountnumberformats\/{accountnumberformatId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/codes/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/codes\/{codeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/codes\/{codeId}\/codevalues/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/codes\/{codeId}\/codevalues\/{codevalueId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/audits/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/makercheckers/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/jobs/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/jobs\/{jobId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/jobs\/{jobid}\/runhistory/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/scheduler/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/externalservice\/{serviceName}/, toolbox.cacheFirst,{});

//ORGANISATION


//GET requests

toolbox.router.get(/fineract-provider\/api\/v1\/offices/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/offices\/{officeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loanproducts/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loanproducts\/{productId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/savingsproducts\/{productId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/fixeddepositproducts/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/fixeddepositproducts\/{productId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/recurringdepositproducts/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/recurringdepositproducts\/{productId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/products\/share/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/products\/share\/{productId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/currencies/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/funds/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/funds\/{fundId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/staff/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/staff\/{staffId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/clients\/{clientId}\/images/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/charges/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/charges\/{chargeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loanproducts/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/loanproducts\/{productId}\/productmix/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/holidays/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/holidays\/{holidayId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/workingdays/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/workingdays\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/templates/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/templates\/{Id}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/interestratecharts/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/interestratecharts\/{chargeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/interestratecharts\/{chartId}\/chartslabs/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/interestratecharts\/{chartId}\/chartslabs\/{slabId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/tellers/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/tellers\/{tellerId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}\/transactions/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}\/summaryandtransactions/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}\/transactions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/paymenttypes/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/paymenttypes\/{paymentTypeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/provisioningcriteria/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/provisioningcriteria\/{criteriaId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/floatingrates/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/floatingrates\/{floatingRateId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/taxes\/component/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/taxes\/component\/{taxComponentId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/taxes\/group/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/taxes\/group\/{taxGroupId}/, toolbox.cacheFirst,{});

//Savings


//GET requests

toolbox.router.get(/fineract-provider\/api\/v1\/savingsaccounts/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/transactions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/transactions\/{transactionId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/charges/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/charges\/{savingsAccountChargeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/fixeddepositaccounts/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/recurringdepositaccounts/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}\/transactions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}\/transactions\/{transactionId}/, toolbox.cacheFirst,{});


//POST requests

//Clients POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}\/identifiers/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}\/transactions\/{transactionId}?command=undo/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}\/images/, toolbox.networkOnly,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=activate/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=close/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=reject/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=withdraw/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=reactivate/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=assignStaff/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=unassignStaff/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=proposeTransfer/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=withdrawTransfer/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=rejectTransfer/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=acceptTransfer/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=proposeAndAcceptTransfer/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}?command=updateSavingsAccount/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}\/charges\/{clientChargeId}?command=paycharge/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}\/charges\/{clientChargeId}?command=waive/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}\/charges\/{clientChargeId}?command=undo/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}\/charges/,toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accounttransfers/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/standinginstructions/, toolbox.networkFirst,{});

//Loans

//POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/loans?command=calculateLoanSchedule/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}?command=approve/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}?command=undoApproval/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}?command=assignLoanOfficer/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}?command=unassignLoanOfficer/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}?command=reject/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}?command=withdrawnByApplicant/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}?command=disburse/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}?command=disburseToSavings/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}?command=undoDisbursal/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}?command=recoverGuarantees/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions?command=repayment/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions?command=waiveInterest/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions?command=writeoff/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions?command=undowriteoff/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions?command=prepayLoan/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions?command=recoverypayment/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions\/{transactionId}/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions?command=refundByCash/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions?command=foreclosure/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/charges/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/charges\/{chargeId}?command=pay/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/guarantors/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/{loanId}\/collaterals/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/rescheduleloans/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/rescheduleloans\/{requestId}?command=reject/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/rescheduleloans\/{requestId}?command=approve/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/1\/schedule?command=calculateLoanSchedule/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/1\/schedule?command=addVariations/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loans\/1\/schedule?command=deleteVariations/, toolbox.networkFirst,{});


//USERS
//POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/authentication/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/oauth\/token/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/users/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/roles/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/roles\/{roleId}?command=enable/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/roles\/{roleId}?command=disable/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/userdetails?access_token={access_token}/, toolbox.networkFirst,{});


//Accounting

//POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/glaccounts/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/glclosures/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/journalentries/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/journalentries?command=updateRunningBalance/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/journalentries\/{transactionId}?command=reverse/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accountingrules/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/financialactivityaccounts/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/runaccruals/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/provisioningentries/, toolbox.networkFirst,{});


//Shares

// POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/accounts\/share/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accounts\/share\/{shareAccountId}?command=approve/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accounts\/share\/{shareAccountId}?command=undoApproval/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accounts\/share\/{shareAccountId}?command=reject/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accounts\/share\/{shareAccountId}?command=activate/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accounts\/share\/{shareAccountId}?command=close/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accounts\/share\/{shareAccountId}?command=applyadditionalshares/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accounts\/share\/{shareAccountId}?command=approveadditionalshares/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accounts\/share\/{shareAccountId}?command=rejectadditionalshares/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accounts\/share\/{shareAccountId}?command=redeemshares/, toolbox.networkFirst,{});

//Groups

//groups POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/groups/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=activate/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=associateClients/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=disassociateClients/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=transferClients/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=generateCollectionSheet/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=saveCollectionSheet/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=unassignStaff/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=assignStaff/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=close/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=assignRole/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=unassignRole&roleId=1/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/groups\/{groupId}?command=updateRole&roleId=2/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/centers/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/centers\/{centerId}?command=activate/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/centers\/{centerId}?command=close/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/centers\/{centerId}?command=associateGroups/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/centers\/{centerId}?command=disassociateGroups/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/centers\/{centerId}?command=generateCollectionSheet/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/centers\/{centerId}?command=saveCollectionSheet/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/collectionsheet?command=generateCollectionSheet/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/collectionsheet?command=saveCollectionSheet/, toolbox.networkFirst,{});



//Non Core section

//POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/datatables/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/datatables\/register\/{datatable}\/{apptable}/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/datatables\/deregister\/{datatable}/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/datatables\/{datatable}\/{apptableId}/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/{resource}\/{resourceId}\/notes/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/{entityType}\/{entityId}\/documents/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/search\/advance/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/survey\/{surveyName}\/{clientId}/, toolbox.networkFirst,{});


//report
//POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/reports/, toolbox.networkFirst,{});


//SPM
//POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/surveys/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/surveys\/1\/lookuptables/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/surveys\/1\/scorecards/, toolbox.networkFirst,{});


//SYSTEM

//POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/hooks/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/accountnumberformats/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/codes/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/codevalues/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/makercheckers\/{auditId}?command=approve/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/jobs\/{jobId}?command=executeJob/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/scheduler?command=start/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/scheduler?command=stop/, toolbox.networkFirst,{});


//ORGANISATION

//POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/offices/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loanproducts/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsproducts/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositproducts/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositproducts/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/products\/share/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/funds/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/staff/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/clients\/{clientId}\/images/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/products\/charges/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/loanproducts\/{productId}\/productmix/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/holidays/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/holidays\/{holidayId}?command=activate/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/workingdays/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/templates/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/interestratecharts/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/interestratecharts\/{chartId}\/chartslabs/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/tellers/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}\/allocate/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}\/settle/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/paymenttypes/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/provisioningcriteria/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/floatingrates/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/taxes\/component/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/taxes\/group/, toolbox.networkFirst,{});


//Savings

//POST requests

toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{savingsId}?command=approve/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{savingsId}?command=undoApproval/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{savingsId}?command=assignSavingsOfficer/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{savingsId}?command=unassignSavingsOfficer/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{savingsId}?command=reject/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{savingsId}?command=withdrawnByApplicant/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{savingsId}?command=activate/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{savingsId}?command=close/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{savingsId}?command=calculateInterest/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{savingsId}?command=postInterest/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{accountsId}\/transactions?command=deposit/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{accountsId}\/transactions?command=withdrawl/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{accountsId}\/transactions\/{transactionId}?command=undo/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{accountsId}\/transactions\/{transactionId}?command=modify/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/charges/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/charges\/{savingsAccountChargeId}?command=paycharge/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/charges\/{savingsAccountChargeId}?command=waive/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/charges\/{savingsAccountChargeId}?command=inactive/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositaccounts/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}?command=approve/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}?command=undoApproval/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}?command=reject/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{savingsId}?command=withdrawnByApplicant/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}?command=activate/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}?command=close/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}?command=prematureClose/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}?command=calculatePrematureAmount/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}?command=calculateInterest/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}?command=postInterest/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}?command=approve/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}?command=undoApproval/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}?command=reject/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{savingsId}?command=withdrawnByApplicant/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}?command=activate/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}?command=updateDepositAccount/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}?command=close/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}?command=prematureClose/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}?command=calculatePrematureAmount/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}?command=calculateInterest/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}?command=postInterest/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountsId}\/transactions?command=deposit/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountsId}\/transactions?command=withdrawl/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountsId}\/transactions\/{transactionId}?command=undo/, toolbox.networkFirst,{});
toolbox.router.post(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountsId}\/transactions\/{transactionId}?command=modify/, toolbox.networkFirst,{});



//PUT requests


//Clients PUT requests

toolbox.router.put(/fineract-provider\/api\/v1\/clients\/{clientId}/, toolbox.cacheFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/standinginstructions\/1?command=update/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/clients\/{clientId}\/identifiers\/{identifierId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/clients\/{clientId}\/images/, toolbox.networkOnly,{});


//loans PUT request

toolbox.router.put(/fineract-provider\/api\/v1\/loans\/{loanId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/loans\/{loanId}\/charges\/{chargeId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/loans\/{loanId}\/guarantors\/{guarantorId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/loans\/{loanId}\/collaterals\/{collateralId}/, toolbox.networkFirst,{});

//PUT requests users

toolbox.router.put(/fineract-provider\/api\/v1\/users\/{userId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/roles\/{roleId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/roles\/{roleId}\/permissions/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/permissions/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/passwordpreferences\/template/, toolbox.networkFirst,{});

// Accounting PUT requests

toolbox.router.put(/fineract-provider\/api\/v1\/glaccounts\/{glaccountId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/glclosures\/{glclosureId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/accountingrules\/{accountingruleId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/financialactivityaccounts\/{financialactivityaccountId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/provisioningentries\/{provisioningEntryId}?command=recreateprovisioningentry/, toolbox.networkFirst,{});


//Shares PUT requests

toolbox.router.put(/fineract-provider\/api\/v1\/accounts\/share\/{accountId}/, toolbox.networkFirst,{});

//groups PUT requests

toolbox.router.put(/fineract-provider\/api\/v1\/groups\/{groupId}\/accounts/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/centers\/{centerId}/,  toolbox.networkFirst,{});

//Non Core
//PUT requests

toolbox.router.put(/fineract-provider\/api\/v1\/datatables\/{datatables}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/datatables\/{datatable}\/{apptableId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/{resource}\/{resourceId}\/notes\/{noteId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/{entityType}\/{entityId}\/documents\/{documentId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/datatables\/{datatable}\/{apptableId}\/{datatableId}/, toolbox.networkFirst,{});

//PUT requests
//Report
toolbox.router.put(/fineract-provider\/api\/v1\/reports\/{id}/, toolbox.networkFirst,{});

//SYSTEM PUT requests

toolbox.router.put(/fineract-provider\/api\/v1\/configurations/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/hooks\/{hookId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/accountnumberformats\/{accountnumberformatId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/codes\/{codeId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/codes\/{codeId}\/codevalues\/{codevalueId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/jobs\/{jobId}/, toolbox.networkFirst,{});

//ORGANISATION PUT requests

toolbox.router.put(/fineract-provider\/api\/v1\/offices\/{officeId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/loanproducts\/{loanId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/savingsproducts\/{productId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/fixeddepositproducts\/{productId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/recurringdepositproducts\/{productId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/products\/share\/{productId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/currencies/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/funds\/{fundId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/staff\/{staffId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/clients\/{clientId}\/images/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/charges\/{chargeId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/loanproducts\/{productId}\/productmix/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/holidays\/{holidayId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/templates\/{templateId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/interestratecharts\/{chartId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/interestratecharts\/{chartId}\/chartslabs\/{slabId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/tellers\/{tellerId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/paymenttypes\/{paymentTypeId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/provisioningcriteria\/{criteriaId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/floatingrates\/{floatingRateId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/taxes\/component\/{taxComponentId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/taxes\/group\/{taxGroupId}/, toolbox.networkFirst,{});


//SAVNGS PUT requests

toolbox.router.put(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/savingsaccounts\/{accountsId}?command=updateWithHoldTax/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/charges\/{savingsAccountChargeId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}/, toolbox.networkFirst,{});
toolbox.router.put(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}/, toolbox.networkFirst,{});

//DELETE requests

//Clients DELETE requests

toolbox.router.delete(/fineract-provider\/api\/v1\/clients\/{clientId}\/charges\/{clientChargeId}/, toolbox.networkOnly,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/standinginstructions\/1?command=delete/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/clients\/{clientId}\/images/, toolbox.networkOnly,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/clients\/{clientId}/, toolbox.networkOnly,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/clients\/{clientId}\/identifiers\/{identifierId}/, toolbox.networkOnly,{});


//loans delete request

toolbox.router.delete(/fineract-provider\/api\/v1\/loans\/{loanId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/loans\/{loanId}\/charges\/{chargeId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/loans\/{loanId}\/guarantors\/{guarantorId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/loans\/{loanId}\/collaterals\/{collateralId}/, toolbox.networkFirst,{});

//delete requests users
toolbox.router.delete(/fineract-provider\/api\/v1\/users\/{userId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/roles\/{roleId}/, toolbox.networkFirst,{});


//Accounting delete requests

toolbox.router.delete(/fineract-provider\/api\/v1\/glaccounts\/{glaccountId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/glclosures\/{glclosureId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/accountingrules\/{accountingruleId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/financialactivityaccounts\/{financialactivityaccountId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/provisioningentries\/{provisioningEntryId}?command=createjournalentry/, toolbox.networkFirst,{});


//groups delete requests

toolbox.router.delete(/fineract-provider\/api\/v1\/groups\/{groupId}\/accounts/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/centers\/{centerId}/,  toolbox.networkFirst,{});

//delete requests

toolbox.router.delete(/fineract-provider\/api\/v1\/datatables\/{datatables}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/datatables\/{datatable}\/{apptableId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/datatables\/{datatable}\/{apptableId}\/{datatableId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/{resource}\/{resourceId}\/notes\/{noteId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/{entityType}\/{entityId}\/documents\/{documentId}/, toolbox.networkFirst,{});

//Delete requests

toolbox.router.delete(/fineract-provider\/api\/v1\/reports\/{id}/, toolbox.networkFirst,{});


//delete requests

toolbox.router.delete(/fineract-provider\/api\/v1\/surveys\/1/, toolbox.networkFirst,{});

//delete requests
//SYSTEM
toolbox.router.delete(/fineract-provider\/api\/v1\/hooks\/{hookId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/accountnumberformats\/{accountnumberformatId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/codes\/{codeId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/codes\/{codeId}\/codevalues\/{codevalueId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/makercheckers\/{auditId}/, toolbox.networkFirst,{});


//DElETE requests
//ORGANISATION
toolbox.router.delete(/fineract-provider\/api\/v1\/savingsproducts\/{productId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/fixeddepositproducts\/{productId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/recurringdepositproducts\/{productId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/clients\/{clientId}\/images/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/charges\/{chargeId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/loanproducts\/{productId}\/productmix/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/holidays\/{holidayId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/templates\/{templateId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/interestratecharts\/{chartId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/interestratecharts\/{chartId}\/chartslabs\/{slabId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/paymenttypes\/{paymentTypeId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/provisioningcriteria\/{criteriaId}/, toolbox.networkFirst,{});


//Delete requests
//SAVINGS
toolbox.router.delete(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/charges\/{savingsAccountChargeId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}/, toolbox.networkFirst,{});
toolbox.router.delete(/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}/, toolbox.networkFirst,{});
