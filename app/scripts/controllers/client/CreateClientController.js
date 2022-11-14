(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateClientController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, Upload, $rootScope, routeParams, WizardHandler) {

            scope.offices = [];
            scope.staffs = [];
            scope.savingproducts = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.formDat = {};
            scope.clientNonPersonDetails = {};
            scope.restrictDate = new Date();
            scope.showSavingOptions = false;
            scope.savings = {};
            scope.savings.opensavingsproduct = false;
            scope.forceOffice = null;
            scope.showNonPersonOptions = false;
            scope.clientPersonId = 1;
            //address
            scope.addressTypes=[];
            scope.countryOptions=[];
            scope.stateOptions=[];
            scope.addressTypeId={};
            entityname="ADDRESS";
            scope.addressArray=[];
            scope.formData.address=[];
            //familymembers
            scope.formData.familyMembers=[];
            scope.familyArray=[];
            scope.datatables = [];
            scope.noOfTabs = 1;
            scope.step = '-';
            scope.formData.datatables = [];
            scope.formDat.datatables = [];
            scope.tf = "HH:mm";
            scope.clientId = routeParams.clientId;
            scope.businessOwnersArray=[];
            scope.formData.businessOwners=[];
            scope.employmentInfoArray=[];

            var requestParams = {staffInSelectedOfficeOnly:true};
            if (routeParams.groupId) {
                requestParams.groupId = routeParams.groupId;
            }
            if (routeParams.officeId) {
                requestParams.officeId = routeParams.officeId;
            }
            resourceFactory.clientTemplateResource.get(requestParams, function (data) {
                scope.offices = data.officeOptions;
                scope.staffs = data.staffOptions;
                scope.formData.officeId = scope.offices[0].id;
                scope.savingproducts = data.savingProductOptions;
                scope.genderOptions = data.genderOptions;
                scope.clienttypeOptions = data.clientTypeOptions;
                scope.clientClassificationOptions = data.clientClassificationOptions;
                scope.clientNonPersonConstitutionOptions = data.clientNonPersonConstitutionOptions;
                scope.clientNonPersonMainBusinessLineOptions = data.clientNonPersonMainBusinessLineOptions;
                scope.clientLegalFormOptions = data.clientLegalFormOptions;
                scope.datatables = data.datatables;
                if (!_.isUndefined(scope.datatables) && scope.datatables.length > 0) {
                    scope.noOfTabs = scope.datatables.length + 1;
                    angular.forEach(scope.datatables, function (datatable, index) {
                        scope.updateColumnHeaders(datatable.columnHeaderData);
                        angular.forEach(datatable.columnHeaderData, function (colHeader, i) {
                            if (_.isEmpty(scope.formDat.datatables[index])) {
                                scope.formDat.datatables[index] = {data: {}};
                            }

                            if (_.isEmpty(scope.formData.datatables[index])) {
                                scope.formData.datatables[index] = {
                                    registeredTableName: datatable.registeredTableName,
                                    data: {locale: scope.optlang.code}
                                };
                            }

                            if (datatable.columnHeaderData[i].columnDisplayType == 'DATETIME') {
                                scope.formDat.datatables[index].data[datatable.columnHeaderData[i].columnName] = {};
                            }
                        });
                    });
                }

                if (data.savingProductOptions.length > 0) {
                    scope.showSavingOptions = true;
                }
                if(routeParams.officeId) {
                    scope.formData.officeId = routeParams.officeId;
                    for(var i in data.officeOptions) {
                        if(data.officeOptions[i].id == routeParams.officeId) {
                            scope.forceOffice = data.officeOptions[i];
                            break;
                        }
                    }
                }
                if(routeParams.groupId) {
                    if(typeof data.staffId !== "undefined") {
                        scope.formData.staffId = data.staffId;
                    }
                }

                scope.businessOwnerEnabled=data.isBusinessOwnerEnabled;
                if (scope.businessOwnerEnabled === true) {
                           scope.countryOptions = data.ownersData[0].countryIdOptions;
                           scope.stateOptions = data.ownersData[0].stateProvinceIdOptions;
                           scope.titleOptions = data.ownersData[0].titleIdOptions;
                           scope.cityOptions = data.ownersData[0].cityIdOptions;
                           scope.typeOptions = data.ownersData[0].typeIdOptions;
                }
                scope.employmentInfoEnabled=data.isEmploymentInfoEnabled;
                if (scope.employmentInfoEnabled === true) {
                           scope.countryOptions = data.employmentInfoData[0].countryIdOptions;
                           scope.stateOptions = data.employmentInfoData[0].stateProvinceIdOptions;
                           scope.cityOptions = data.employmentInfoData[0].cityIdOptions;
                           scope.lgaOptions = data.employmentInfoData[0].lgaIdOptions;
                           scope.employmentStatusOptions = data.employmentInfoData[0].employmentStatusOptions;
                           scope.bankOptions = data.employmentInfoData[0].bankOptions;
                           scope.industryOptions = data.employmentInfoData[0].industryOptions;
                }
                scope.enableAddress=data.isAddressEnabled;

                	   if (scope.enableAddress === true) {
                           scope.addressTypes = data.address[0].addressTypeIdOptions;
                           scope.countryOptions = data.address[0].countryIdOptions;
                           scope.stateOptions = data.address[0].stateProvinceIdOptions;
                           scope.lgaOptions = data.address[0].lgaIdOptions;
                       
                    resourceFactory.addressFieldConfiguration.get({entity:entityname},function(data){

                        for(var i=0;i<data.length;i++)
                        {
                            data[i].field='scope.'+data[i].field;
                            if(data[i].is_enabled == undefined) {
                                //For dev.mifos.io or demo.mifos.io
                                eval(data[i].field+"="+data[i].isEnabled);
                            } else {
                                //For fineract server
                                eval(data[i].field+"="+data[i].is_enabled);
                            }
                        }

                    })


                }


                scope.relationshipIdOptions=data.familyMemberOptions.relationshipIdOptions;
                scope.genderIdOptions=data.familyMemberOptions.genderIdOptions;
                scope.maritalStatusIdOptions=data.familyMemberOptions.maritalStatusIdOptions;
                scope.professionIdOptions=data.familyMemberOptions.professionIdOptions;
                scope.countryOptions = data.familyMemberOptions.countryIdOptions;
                scope.stateOptions = data.familyMemberOptions.stateProvinceIdOptions;
                scope.cityOptions = data.familyMemberOptions.cityIdOptions;
                scope.addressTypes = data.familyMemberOptions.addressTypeIdOptions;

            });

            scope.updateColumnHeaders = function(columnHeaderData) {
                var colName = columnHeaderData[0].columnName;
                if (colName == 'id') {
                    columnHeaderData.splice(0, 1);
                }

                colName = columnHeaderData[0].columnName;
                if (colName == 'client_id' || colName == 'office_id' || colName == 'group_id' || colName == 'center_id' || colName == 'loan_id' || colName == 'savings_account_id') {
                    columnHeaderData.splice(0, 1);
                }
            };

            // address

            scope.addAddress=function()
            {
                scope.addressArray.push({});
            }

            scope.removeAddress=function(index)
            {
                scope.addressArray.splice(index,1);
            }




            // end of address


            // family members

            scope.addFamilyMember=function()
            {
                scope.familyArray.push({});
            }

            scope.removeFamilyMember=function(index)
            {
                scope.familyArray.splice(index,1);
            }

          // Bussiness owners

            scope.addBusinessOwners=function()
            {
                scope.businessOwnersArray.push({});
            }

            scope.removeBusinessOwners=function(index)
            {
                scope.businessOwnersArray.splice(index,1);
            }
            scope.addEmploymentInfo=function()
            {
                scope.employmentInfoArray.push({});
            }

            scope.removeEmploymentInfo=function(index)
            {
                scope.employmentInfoArray.splice(index,1);
            }


            // end of family members




            scope.displayPersonOrNonPersonOptions = function (legalFormId) {
                if(legalFormId == scope.clientPersonId || legalFormId == null) {
                    scope.showNonPersonOptions = false;
                }else {
                    scope.showNonPersonOptions = true;
                }
            };

            scope.displayFields = function (employmentStatusId) {
                scope.employmentInfoArray = [];
                scope.info = scope.employmentStatusOptions.filter(function(item) {
                                 return(item.id === employmentStatusId);
                 });
                if(scope.info[0].name == 'Currently in a job') {
                    scope.showJobOption = true;
                    scope.showBusinessOption = false;
                    scope.showStudentOptions = false;
                    scope.showJobSearching = false;
                }else if(scope.info[0].name == 'Self-employed') {
                    scope.showBusinessOption = true;
                    scope.showJobOption = false;
                    scope.showStudentOptions = false;
                    scope.showJobSearching = false;
                }
                else if(scope.info[0].name == 'Student') {
                    scope.showStudentOptions = true;
                    scope.showBusinessOption = false;
                    scope.showJobOption = false;
                    scope.showJobSearching = false;
                }
                else if(scope.info[0].name == 'Job searching') {
                    scope.showJobSearching = true;
                    scope.showBusinessOption = false;
                    scope.showJobOption = false;
                    scope.showStudentOptions = false;
                }
            };

            scope.changeOffice = function (officeId) {
                resourceFactory.clientTemplateResource.get({staffInSelectedOfficeOnly:true, officeId: officeId
                }, function (data) {
                    scope.staffs = data.staffOptions;
                    scope.savingproducts = data.savingProductOptions;
                });
            };

            scope.setChoice = function () {
                if (this.formData.active) {
                    scope.choice = 1;
                }
                else if (!this.formData.active) {
                    scope.choice = 0;
                }
            };
            if(routeParams.groupId) {
                scope.cancel = '#/viewgroup/' + routeParams.groupId
                scope.groupid = routeParams.groupId;
            }else {
                scope.cancel = "#/clients"
            }

            //return input type
            //return input type
            scope.fieldType = function (type) {
                var fieldType = "";
                if (type) {
                    if (type == 'CODELOOKUP' || type == 'CODEVALUE') {
                        fieldType = 'SELECT';
                    } else if (type == 'DATE') {
                        fieldType = 'DATE';
                    } else if (type == 'DATETIME') {
                        fieldType = 'DATETIME';
                    } else if (type == 'BOOLEAN') {
                        fieldType = 'BOOLEAN';
                    } else {
                        fieldType = 'TEXT';
                    }
                }
                return fieldType;
            };

            scope.dateTimeFormat = function (colHeaders) {
                angular.forEach(colHeaders, function (colHeader, i) {
                    if (colHeaders[i].columnDisplayType == 'DATETIME') {
                        return scope.df + " " + scope.tf;
                    }
                });
                return scope.df;
            };

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);

                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                this.formData.dateFormat = scope.df;
                this.formData.activationDate = reqDate;

                if (!_.isUndefined(scope.datatables) && scope.datatables.length > 0) {
                    angular.forEach(scope.datatables, function (datatable, index) {
                        scope.columnHeaders = datatable.columnHeaderData;
                        angular.forEach(scope.columnHeaders, function (colHeader, i) {
                            scope.dateFormat = scope.df + " " + scope.tf
                            if (scope.columnHeaders[i].columnDisplayType == 'DATE') {
                                if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName])) {
                                    scope.formData.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName],
                                        scope.dateFormat);
                                    scope.formData.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            } else if (scope.columnHeaders[i].columnDisplayType == 'DATETIME') {
                                if (!_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date) && !_.isUndefined(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time)) {
                                    scope.formData.datatables[index].data[scope.columnHeaders[i].columnName] = dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].date, scope.df)
                                        + " " + dateFilter(scope.formDat.datatables[index].data[scope.columnHeaders[i].columnName].time, scope.tf);
                                    scope.formData.datatables[index].data.dateFormat = scope.dateFormat;
                                }
                            }
                        });
                    });
                } else {
                    delete scope.formData.datatables;
                }

                if (routeParams.groupId) {
                    this.formData.groupId = routeParams.groupId;
                }

                if (routeParams.officeId) {
                    this.formData.officeId = routeParams.officeId;
                }

                if (scope.first.submitondate) {
                    reqDate = dateFilter(scope.first.submitondate, scope.df);
                    this.formData.submittedOnDate = reqDate;
                }

                if (scope.first.dateOfBirth) {
                    this.formData.dateOfBirth = dateFilter(scope.first.dateOfBirth, scope.df);
                }

                if (this.formData.legalFormId == scope.clientPersonId || this.formData.legalFormId == null) {
                    delete this.formData.fullname;
                } else {
                    delete this.formData.firstname;
                    delete this.formData.middlename;
                    delete this.formData.lastname;
                }

                if(scope.first.incorpValidityTillDate) {
                    this.formData.clientNonPersonDetails.locale = scope.optlang.code;
                    this.formData.clientNonPersonDetails.dateFormat = scope.df;
                    this.formData.clientNonPersonDetails.incorpValidityTillDate = dateFilter(scope.first.incorpValidityTillDate, scope.df);
                }

                if (!scope.savings.opensavingsproduct) {
                    this.formData.savingsProductId = null;
                }

                if(scope.enableAddress===true)
                {
                    scope.formData.address = [];
                    for(var i=0;i<scope.addressArray.length;i++)
                    {
                        var temp=new Object();
                        if(scope.addressArray[i].addressTypeId)
                        {
                            temp.addressTypeId=scope.addressArray[i].addressTypeId;
                        }
                        if (scope.addressArray[i].street) {
                            temp.street = scope.addressArray[i].street;
                        }
                        if(scope.addressArray[i].addressLine1)
                        {
                            temp.addressLine1=scope.addressArray[i].addressLine1;
                        }
                        if(scope.addressArray[i].addressLine2)
                        {
                            temp.addressLine2=scope.addressArray[i].addressLine2;
                        }
                        if(scope.addressArray[i].addressLine3)
                        {
                            temp.addressLine3=scope.addressArray[i].addressLine3;
                        }
                        if(scope.addressArray[i].townVillage)
                        {
                            temp.townVlage=scope.addressArray[i].townVillage;
                        }
                        if(scope.addressArray[i].city)
                        {
                            temp.city=scope.addressArray[i].city;
                        }
                        if(scope.addressArray[i].countyDistrict)
                        {
                            temp.countyDistrict=scope.addressArray[i].countyDistrict;
                        }
                        if(scope.addressArray[i].countryId)
                        {
                            temp.countryId=scope.addressArray[i].countryId;
                        }
                        if(scope.addressArray[i].stateProvinceId)
                        {
                            temp.stateProvinceId=scope.addressArray[i].stateProvinceId;
                        }
                        if(scope.addressArray[i].postalCode)
                        {
                            temp.postalCode=scope.addressArray[i].postalCode;
                        }
                        if(scope.addressArray[i].latitude)
                        {
                            temp.latitude=scope.addressArray[i].latitude;
                        }
                        if(scope.addressArray[i].longitude)
                        {
                            temp.longitude=scope.addressArray[i].longitude;
                        }
                        if(scope.addressArray[i].isActive)
                        {
                            temp.isActive=scope.addressArray[i].isActive;

                        }
                        if(scope.addressArray[i].lgaId)
                        {
                            temp.lgaId=scope.addressArray[i].lgaId;
                        }
                        scope.formData.address.push(temp);
                    }
                }


                // family array

                for(var i=0;i<scope.familyArray.length;i++)
                {
                    var temp=new Object();
                    if(scope.familyArray[i].relationshipId)
                    {
                        temp.relationshipId=scope.familyArray[i].relationshipId;
                    }
                    if(scope.familyArray[i].firstName)
                    {
                        temp.firstName=scope.familyArray[i].firstName;
                    }
                    if(scope.familyArray[i].middleName)
                    {
                        temp.middleName=scope.familyArray[i].middleName;
                    }
                    if(scope.familyArray[i].lastName)
                    {
                        temp.lastName=scope.familyArray[i].lastName;
                    }
                    if(scope.familyArray[i].qualification)
                    {
                        temp.qualification=scope.familyArray[i].qualification;
                    }
                    if(scope.familyArray[i].mobileNumber)
                    {
                        temp.mobileNumber=scope.familyArray[i].mobileNumber;
                    }
                    if(scope.familyArray[i].age)
                    {
                        temp.age=scope.familyArray[i].age;
                    }
                    if(scope.familyArray[i].isDependent)
                    {
                        temp.isDependent=scope.familyArray[i].isDependent;
                    }
                    if(scope.familyArray[i].genderId)
                    {
                        temp.genderId=scope.familyArray[i].genderId;
                    }
                    if(scope.familyArray[i].professionId)
                    {
                        temp.professionId=scope.familyArray[i].professionId;
                    }
                    if(scope.familyArray[i].maritalStatusId)
                    {
                        temp.maritalStatusId=scope.familyArray[i].maritalStatusId;
                    }
                    if(scope.familyArray[i].dateOfBirth)
                    {
                        temp.dateOfBirth=dateFilter(scope.familyArray[i].dateOfBirth, scope.df);
                    }
                    if(scope.familyArray[i].email)
                    {
                        temp.email=scope.familyArray[i].email;
                    }
                    if(scope.familyArray[i].addressLine1)
                    {
                        temp.address1=scope.familyArray[i].addressLine1;
                    }
                    if(scope.familyArray[i].addressLine2)
                    {
                         temp.address2=scope.familyArray[i].addressLine2;
                    }
                    if(scope.familyArray[i].addressLine3)
                    {
                         temp.address3=scope.familyArray[i].addressLine3;
                    }
                    if(scope.familyArray[i].cityId)
                    {
                        temp.cityId=scope.familyArray[i].cityId;
                    }
                    if(scope.familyArray[i].stateProvinceId)
                    {
                        temp.stateProvinceId=scope.familyArray[i].stateProvinceId;
                    }
                    if(scope.familyArray[i].countryId)
                    {
                        temp.countryId=scope.familyArray[i].countryId;
                    }
                    if(scope.familyArray[i].postalCode)
                    {
                        temp.postalCode=scope.familyArray[i].postalCode;
                    }

                    temp.locale = scope.optlang.code;
                    temp.dateFormat = scope.df;
                    scope.formData.familyMembers.push(temp);
                }

                // business Owners array
                if(scope.businessOwnerEnabled===true)
                {
                for(var i=0;i<scope.businessOwnersArray.length;i++)
                {
                    var temp=new Object();
                    scope.formData.businessOwners = [];
                    if(scope.businessOwnersArray[i].firstnameOwner)
                    {
                        temp.firstName=scope.businessOwnersArray[i].firstnameOwner;
                    }
                    if(scope.businessOwnersArray[i].titleId)
                    {
                        temp.titleId=scope.businessOwnersArray[i].titleId;
                    }
                    if(scope.businessOwnersArray[i].lastNameOwner)
                    {
                        temp.lastName=scope.businessOwnersArray[i].lastNameOwner;
                    }
                    if(scope.businessOwnersArray[i].ownershipOwner)
                    {
                        temp.ownership=scope.businessOwnersArray[i].ownershipOwner;
                    }
                    if(scope.businessOwnersArray[i].typeId)
                    {
                        temp.typeId=scope.businessOwnersArray[i].typeId;
                    }
                    if(scope.businessOwnersArray[i].mobileNumberOwner)
                    {
                        temp.mobileNumber=scope.businessOwnersArray[i].mobileNumberOwner;
                    }
                    if(scope.businessOwnersArray[i].businessOwnerNumber)
                    {
                        temp.businessOwnerNumber=scope.businessOwnersArray[i].businessOwnerNumber;
                    }
                    if(scope.businessOwnersArray[i].email)
                    {
                        temp.email=scope.businessOwnersArray[i].email;
                    }
                    if(scope.businessOwnersArray[i].streetNumberAndName)
                    {
                        temp.streetNumberAndName=scope.businessOwnersArray[i].streetNumberAndName;
                    }
                    if(scope.businessOwnersArray[i].address1)
                    {
                        temp.streetNumberAndName=scope.businessOwnersArray[i].address1;
                    }
                    if(scope.businessOwnersArray[i].address2)
                    {
                        temp.streetNumberAndName=scope.businessOwnersArray[i].address2;
                    }
                    if(scope.businessOwnersArray[i].address3)
                    {
                        temp.streetNumberAndName=scope.businessOwnersArray[i].address3;
                    }
                    if(scope.businessOwnersArray[i].postalCode)
                    {
                        temp.streetNumberAndName=scope.businessOwnersArray[i].postalCode;
                    }
                    if(scope.businessOwnersArray[i].cityId)
                    {
                        temp.cityId=scope.businessOwnersArray[i].cityId;
                    }
                    if(scope.businessOwnersArray[i].landmark)
                    {
                        temp.landmark=scope.businessOwnersArray[i].landmark;
                    }
                    if(scope.businessOwnersArray[i].countryId)
                    {
                        temp.countryId=scope.businessOwnersArray[i].countryId;
                    }
                    if(scope.businessOwnersArray[i].stateProvinceId)
                    {
                       temp.stateProvinceId=scope.businessOwnersArray[i].stateProvinceId;
                    }
                    if(scope.businessOwnersArray[i].bvn)
                    {
                         temp.bvn=scope.businessOwnersArray[i].bvn;
                    }
                    if(scope.businessOwnersArray[i].nin)
                    {
                         temp.nin=scope.businessOwnersArray[i].nin;
                    }
                    if(scope.businessOwnersArray[i].isActive)
                    {
                         temp.isActive=scope.businessOwnersArray[i].isActive;
                    }

                    temp.locale = scope.optlang.code;
                    temp.dateFormat = scope.df;
                    scope.formData.businessOwners.push(temp);
                }
                }
                if(scope.employmentInfoEnabled===true)
                {
                console.log(scope.formData.employmentStatusId);
                  for(var i=0;i<scope.employmentInfoArray.length;i++)
                  {
                    var temp=new Object();
                    scope.formData.employmentInformation = [];
                    temp.employmentStatusId=scope.formData.employmentStatusId;
                    delete scope.formData.employmentStatusId;

                    if(scope.employmentInfoArray[i].employerName)
                    {
                        temp.employerName=scope.employmentInfoArray[i].employerName;
                    }
                    if(scope.employmentInfoArray[i].businessName)
                    {
                        temp.businessName=scope.employmentInfoArray[i].businessName;
                    }
                    if(scope.employmentInfoArray[i].nameOfSchool)
                    {
                        temp.nameOfSchool=scope.employmentInfoArray[i].nameOfSchool;
                    }
                    if(scope.employmentInfoArray[i].monthlyIncome)
                    {
                        temp.monthlyIncome=scope.employmentInfoArray[i].monthlyIncome;
                    }
                    if(scope.employmentInfoArray[i].streetNumberAndName)
                    {
                        temp.streetNumberAndName=scope.employmentInfoArray[i].streetNumberAndName;
                    }
                    if(scope.employmentInfoArray[i].cityId)
                    {
                        temp.cityId=scope.employmentInfoArray[i].cityId;
                    }
                    if(scope.employmentInfoArray[i].lgaId)
                    {
                        temp.lgaId=scope.employmentInfoArray[i].lgaId;
                    }
                    if(scope.employmentInfoArray[i].countryId)
                    {
                        temp.countryId=scope.employmentInfoArray[i].countryId;
                    }
                    if(scope.employmentInfoArray[i].stateProvinceId)
                    {
                       temp.stateProvinceId=scope.employmentInfoArray[i].stateProvinceId;
                    }
                    if(scope.employmentInfoArray[i].isActive)
                    {
                         temp.isActive=scope.employmentInfoArray[i].isActive;
                    }
                    if(scope.employmentInfoArray[i].bankId)
                    {
                         temp.bankId=scope.employmentInfoArray[i].bankId;
                    }
                    if(scope.employmentInfoArray[i].industryId)
                    {
                         temp.industryId=scope.employmentInfoArray[i].industryId;
                    }
                    if(scope.employmentInfoArray[i].accountNumber)
                    {
                         temp.accountNumber=scope.employmentInfoArray[i].accountNumber;
                    }
                    temp.locale = scope.optlang.code;
                    temp.dateFormat = scope.df;
                    scope.formData.employmentInformation.push(temp);
                }
                }
                resourceFactory.clientResource.save(this.formData, function (data) {
                    location.path('/viewclient/' + data.clientId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateClientController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', 'Upload', '$rootScope', '$routeParams', 'WizardHandler', mifosX.controllers.CreateClientController]).run(function ($log) {
        $log.info("CreateClientController initialized");
    });
}(mifosX.controllers || {}));
