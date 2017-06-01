/*
In this file all the fineract api requests are cached using sw-toolbox library
*/
console.log("Caching all the fineract APIs");

//Clients GET requests
toolbox.precache([
  '/?baseApiUrl=https://demo.openmf.org#/',
  'index.html',
  'service-worker.js'
]);
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients/, toolbox.cacheFirst, {});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}\/transaction\/{transactionId}/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}\/transactions?limit=5&offset=0/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}\/accounts/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}\/charges\/{clientChargeId}/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}\/charges/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/datatables/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/runreports\/{reportName}/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/{resource}\/{resourceId}\/notes/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/{entityType}\/{entityId}\/documents/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}\/identifiers/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}\/identifiers\/template/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}\/identifiers\/{identifierId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}\/images/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/standinginstructions/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/standinginstructions\/{standingInstructionId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/standinginstructionrunhistory/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/accounttransfers/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/accounttransfers\/{transferId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/accounttransfers\/templateRefundByTransfer/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/api\/v1\/clients\/{clientId}\/charges?limit=5&offset=0/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}\/charges\/{clientChargeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/fieldconfiguration\/ADDRESS/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/api\/v1\/client\/{clientId}\/addresses/,toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/api\/v1\/client\/{clientId}\/addresses?type=804&&status=false/,toolbox.cacheFirst,{});



//Loans
//Loans get request

toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loans/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loans\/{loanId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions\/{transactionId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loans\/{loanId}\/charges\/{chargeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loans\/{loanId}\/guarantors/, toolbox.networkFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loans\/{loanId}\/guarantors\/{guarantorId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loans\/{loanId}\/collaterals/, toolbox.networkFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loans\/{loanId}\/collaterals\/{collateralId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/rescheduleloans\/{requestId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/rescheduleloans\/{requestId}/, toolbox.cacheFirst,{});


//Template

toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/groups\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loanproducts\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loanproducts\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loans\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loans\/{loanId}\/transactions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/charges\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/offices\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/users\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/hooks\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/audits\/searchtemplate/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/reports\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/accountingrules\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/savingsproducts\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/savingsaccounts\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/transactions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/standinginstructions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/accounttransfers\/template/, toolbox.cacheFirst,{});


//GET requests Users

toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/users/, toolbox.cacheFirst, {});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/users\/{userId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/roles/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/roles\/{roleId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/roles\/{roleId}\/permissions/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/permissions/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/passwordpreferences\/template/, toolbox.cacheFirst,{});

//Accounting

//Accounting get requests

toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/glaccounts/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/glaccounts\/{glaccountsId}/, toolbox.cacheFirst,{})
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/glclosures/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/glclosures\/{glclosureId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/journalentries/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/journalentries\/{entryId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/accountingrules/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/accountingrules\/{accountingruleId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/financialactivityaccounts/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/financialactivityaccounts\/{financialactivityaccountId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/provisioningentries/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/provisioningentries\/{privisioningEntryId}/, toolbox.cacheFirst,{});

//Shares

//Shares GET requests

toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/accounts\/share/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/accounts\/share\/{accountId}/, toolbox.cacheFirst,{});

//Groups


toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/groups/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/groups\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/groups\/1/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/groups\/{groupId}\/accounts/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/centers/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/centers\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/centers\/{centerId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/centers\/{centerId}\/accounts/, toolbox.cacheFirst,{});

//Non Core section


//GET requests

toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/datatables/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/datatables\/{datatable}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/datatables\/{datatable}\/{apptableId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/{resource}\/{resourceId}\/notes/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/{resource}\/{resourceId}\/notes\/{noteId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/{entityType}\/{entityId}\/documents/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/documents\/{clientId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/{entityType}\/{entityId}\/documents\/{documentId}\/attachment/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/search/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/survey/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/survey\/{surveyName}/, toolbox.cacheFirst,{});


//report


//GET requests

toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/reports/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/reports\/{id}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/runreports\/{reportName}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/runreports\/ClientSummary/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/runreports\/GroupSummaryCounts/, toolbox.cacheFirst,{});

//SPM


//GET requests

toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/surveys/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/surveys\/1/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/surveys\/1\/lookuptables\/test-table/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/surveys\/1\/scorecards/, toolbox.cacheFirst,{});

//SYSTEM


//GET requests

toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/configurations/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/configurations\/{configId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/hooks/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/hooks\/{hookId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/accountnumberformats/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/accountnumberformats\/{accountnumberformatId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/codes/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/codes\/{codeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/codes\/{codeId}\/codevalues/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/codes\/{codeId}\/codevalues\/{codevalueId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/audits/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/makercheckers/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/jobs/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/jobs\/{jobId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/jobs\/{jobid}\/runhistory/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/scheduler/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/externalservice\/{serviceName}/, toolbox.cacheFirst,{});

//ORGANISATION


//GET requests

toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/offices/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/offices\/{officeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loanproducts/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loanproducts\/{productId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/savingsproducts\/{productId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/fixeddepositproducts/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/fixeddepositproducts\/{productId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/recurringdepositproducts/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/recurringdepositproducts\/{productId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/products\/share/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/products\/share\/{productId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/currencies/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/funds/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/funds\/{fundId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/staff/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/staff\/{staffId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/clients\/{clientId}\/images/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/charges/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/charges\/{chargeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loanproducts/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/loanproducts\/{productId}\/productmix/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/holidays/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/holidays\/{holidayId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/workingdays/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/workingdays\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/templates/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/templates\/{Id}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/interestratecharts/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/interestratecharts\/{chargeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/interestratecharts\/{chartId}\/chartslabs/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/interestratecharts\/{chartId}\/chartslabs\/{slabId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/tellers/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/tellers\/{tellerId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}\/transactions/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}\/summaryandtransactions/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/tellers\/{tellerId}\/cashiers\/{cashierId}\/transactions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/paymenttypes/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/paymenttypes\/{paymentTypeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/provisioningcriteria/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/provisioningcriteria\/{criteriaId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/floatingrates/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/floatingrates\/{floatingRateId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/taxes\/component/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/taxes\/component\/{taxComponentId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/taxes\/group/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/taxes\/group\/{taxGroupId}/, toolbox.cacheFirst,{});

//Savings


//GET requests

toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/savingsaccounts/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/transactions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/transactions\/{transactionId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/charges/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/savingsaccounts\/{accountId}\/charges\/{savingsAccountChargeId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/fixeddepositaccounts/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/fixeddepositaccounts\/{accountId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/recurringdepositaccounts/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}\/transactions\/template/, toolbox.cacheFirst,{});
toolbox.router.get(/^https:\/\/demo.openmf.org\/fineract-provider\/api\/v1\/recurringdepositaccounts\/{accountId}\/transactions\/{transactionId}/, toolbox.cacheFirst,{});
