(function (module) {
    mifosX.controllers = _.extend(module, {
        CreateClientController: function (scope, resourceFactory, location, http, dateFilter, API_VERSION, $upload, $rootScope, routeParams) {
            scope.offices = [];
            scope.staffs = [];
            scope.savingproducts = [];
            scope.first = {};
            scope.first.date = new Date();
            scope.first.submitondate = new Date ();
            scope.formData = {};
            scope.clientNonPersonDetails = {};
            scope.restrictDate = new Date();
            scope.showSavingOptions = false;
            scope.opensavingsproduct = false;
            scope.forceOffice = null;
            scope.showNonPersonOptions = false;
            scope.clientPersonId = 1;
            //address
            scope.addressTypes=[];
            scope.countryOptions=[];
            scope.stateOptions=[];
            scope.addressTypeId={};
            entityname="client";
            //scope.editable=false;
            //  clientId=routeParams.id;




            resourceFactory.clientaddressFields.get(function(data){
                    scope.addressTypes=data.addressTypeIdOptions;
                    scope.countryOptions=data.countryIdOptions;
                    scope.stateOptions=data.stateProvinceIdOptions;
                }
            )
            // clientId=sharedVariables.getClientId();

            resourceFactory.addressFieldConfiguration.get({entity:entityname},function(data){
                scope.addresstypId=data[0].is_enabled;
                scope.street=data[1].is_enabled;
                scope.address_line_1=data[2].is_enabled;
                scope.address_line_2=data[3].is_enabled;
                scope.address_line_3=data[4].is_enabled;
                scope.town_village=data[5].is_enabled;
                scope.city=data[6].is_enabled;
                scope.county_district=data[7].is_enabled;
                scope.state_province=data[8].is_enabled;
                scope.country=data[9].is_enabled;
                scope.postal_code=data[10].is_enabled;
                scope.latitue=data[11].is_enabled;
                scope.longitude=data[12].is_enabled;
                scope.isActive=data[13].is_enabled;
            })

            scope.addAddress=function()
            {
                scope.addressArray.push({});
            }

            scope.removeAddress=function(index)
            {
                scope.addressArray.splice(index,1);
            }

            resourceFactory.configurationResource.get({id:29},function(data)
            {
                scope.enableAddress=data.enabled;
            });












// end of address


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
            });

            scope.displayPersonOrNonPersonOptions = function (legalFormId) {
                if(legalFormId == scope.clientPersonId || legalFormId == null) {
                    scope.showNonPersonOptions = false;
                }else {
                    scope.showNonPersonOptions = true;
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

            scope.submit = function () {
                var reqDate = dateFilter(scope.first.date, scope.df);

                this.formData.locale = scope.optlang.code;
                this.formData.active = this.formData.active || false;
                this.formData.dateFormat = scope.df;
                this.formData.activationDate = reqDate;

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

                if (!scope.opensavingsproduct) {
                    this.formData.savingsProductId = null;
                }


                for(var i=0;i<scope.addressArray.length;i++)
                {
                    var temp=new Object();
                    if(scope.addressArray[i].addressTypeId)
                    {
                        temp.addressTypeId=scope.addressArray[i].addressTypeId;
                    }
                    if(scope.addressArray[i].street)
                    {
                        temp.street=scope.addressArray[i].street;
                    }
                    if(scope.addressArray[i].address_line_1)
                    {
                        temp.address_line_1=scope.addressArray[i].address_line_1;
                    }
                    if(scope.addressArray[i].address_line_2)
                    {
                        temp.address_line_2=scope.addressArray[i].address_line_2;
                    }
                    if(scope.addressArray[i].address_line_3)
                    {
                        temp.address_line_3=scope.addressArray[i].address_line_3;
                    }
                    if(scope.addressArray[i].town_village)
                    {
                        temp.town_village=scope.addressArray[i].town_village;
                    }
                    if(scope.addressArray[i].city)
                    {
                        temp.city=scope.addressArray[i].city;
                    }
                    if(scope.addressArray[i].county_district)
                    {
                        temp.county_district=scope.addressArray[i].county_district;
                    }
                    if(scope.addressArray[i].country_id)
                    {
                        temp.country_id=scope.addressArray[i].country_id;
                    }
                    if(scope.addressArray[i].state_province_id)
                    {
                        temp.state_province_id=scope.addressArray[i].state_province_id;
                    }
                    if(scope.addressArray[i].postal_code)
                    {
                        temp.postal_code=scope.addressArray[i].postal_code;
                    }
                    if(scope.addressArray[i].latitude)
                    {
                        temp.latitude=scope.addressArray[i].latitude;
                    }
                    if(scope.addressArray[i].longitude)
                    {
                        temp.longitude=scope.addressArray[i].longitude;
                    }
                    if(scope.addressArray[i].is_active)
                    {
                        temp.is_active=scope.addressArray[i].is_active;
                    }
                    scope.formData.address.push(temp);
                }

                resourceFactory.clientResource.save(this.formData, function (data) {
                    location.path('/viewclient/' + data.clientId);
                });
            };
        }
    });
    mifosX.ng.application.controller('CreateClientController', ['$scope', 'ResourceFactory', '$location', '$http', 'dateFilter', 'API_VERSION', '$upload', '$rootScope', '$routeParams', mifosX.controllers.CreateClientController]).run(function ($log) {
        $log.info("CreateClientController initialized");
    });
}(mifosX.controllers || {}));
