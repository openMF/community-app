(function (module) {
    mifosX.controllers = _.extend(module, {
        EditPledgeController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.formData = {};
            scope.formData.collateralDetails = {};
            scope.pledgeId = routeParams.pledgeId;
            scope.isshowAddCollateralDetails = false;
            scope.invalidUserPrice = false;
            scope.requiredCollateral = false;
            scope.requiredQualityStandard = false;
            scope.requiredGrossWeight = false;
            scope.invalidStoneWeight = false;

            resourceFactory.pledgeResource.getCollateralDetails({'pledgeId' : scope.pledgeId}, function(data){
                scope.formData = data;
                scope.collateralDetails = data.collateralDetailsData;
            });

            scope.getCollaterals = function(){
                resourceFactory.collateralsResource.getAll(function(data){
                    if(data.length>0){
                        scope.collaterals = data;
                    }
                });
            }
            scope.getCollaterals();

            scope.showAddCollateralDetails = function(){
                scope.isshowAddCollateralDetails = true;
            }

            scope.changeCollateral = function(collateralId){
                this.formData.collateralDetails = {};
                scope.invalidUserPrice = false;
                this.formData.collateralDetails.collateralId = collateralId;
                scope.getQualityStandards(collateralId);
                scope.validateCollateral(collateralId);
            };

            scope.changeQualityStandards = function(collateralId,qualityStandardId){
                scope.invalidUserPrice = false;
                this.formData.collateralDetails.qualityStandardId = qualityStandardId;
                resourceFactory.collateralsQualityStandardsResource.get({collateralId: collateralId, qualityId: qualityStandardId},function(data){
                    scope.qualityStandard = data;
                    if(data.hasOwnProperty('percentagePrice')){
                        scope.unitPrice = (data.percentagePrice*scope.collateralQualityStandards.baseUnitPrice)/100;
                    }else{
                        scope.unitPrice = scope.collateralQualityStandards.baseUnitPrice;
                    }
                });
                scope.validateQualityStandard(qualityStandardId);
            };

            scope.getQualityStandards = function(id,sealNumber){
                resourceFactory.collateralsResource.getCollateralQualityStandards({collateralId: id, association: 'qualityStandards'},function(data){
                    scope.collateralQualityStandards = data;
                    scope.isOther = (data.typeClassifier==3);
                });
            };

            scope.clear = function () {
                scope.formData.collateralDetails = {};
            }

            scope.submit = function () {
                if(scope.isOther==true){
                    this.formData.collateralDetails.systemPrice = scope.unitPrice;
                    this.formData.collateralDetails.netWeight = undefined;
                    this.formData.collateralDetails.stoneWeight = undefined;
                }else{
                    var stoneWeight = 0;
                    if(this.formData.collateralDetails.stoneWeight){
                        stoneWeight = this.formData.collateralDetails.stoneWeight;
                    }
                    this.formData.collateralDetails.netWeight = this.formData.collateralDetails.grossWeight-stoneWeight;
                    this.formData.collateralDetails.systemPrice = scope.unitPrice*this.formData.collateralDetails.netWeight;
                    this.formData.collateralDetails.stoneWeight = undefined;
                }
                if(angular.isUndefined(this.formData.collateralDetails.userPrice)){
                    this.formData.collateralDetails.userPrice = this.formData.collateralDetails.systemPrice
                }
                scope.collateralDetails.push(this.formData.collateralDetails);
                var len = scope.collateralDetails.length;
                for(var i=0 ;i<scope.collateralDetails.length;i++){
                    scope.getNames(i,scope.collateralDetails[i].collateralId,scope.collateralDetails[i].qualityStandardId)
                }
                scope.calculatedValue(scope.collateralDetails);
                this.formData.collateralDetails = {};
                scope.getCollaterals();
                scope.collateralQualityStandards = [];
                scope.invalidUserPrice = false;
                scope.requiredCollateral = false;
                scope.requiredQualityStandard = false;
                scope.requiredGrossWeight = false;
                scope.invalidStoneWeight = false;
            }

            scope.deleteCollateralDetail = function(index){
                scope.collateralDetails.splice(index, 1);
                scope.calculatedValue(scope.collateralDetails);
            };

            scope.calculatedValue = function(data){
                var totalSystemPrice = 0;
                var totalUserPrice = 0;
                for(var j=0;j<data.length;j++){
                    totalSystemPrice = totalSystemPrice+ parseInt(data[j].systemPrice);
                    totalUserPrice = totalUserPrice+ parseInt(data[j].userPrice);
                }
                scope.totalSystemPrice = totalSystemPrice;
                scope.totalUserPrice = totalUserPrice;
            };

            scope.getNames = function(index, collateralId, qualityStandardsId){
                resourceFactory.collateralsResource.getCollateralQualityStandards({collateralId: collateralId},function(data){
                    scope.collateralDetails[index]['name'] = data.name;
                });
            };

            scope.validateUserPrice = function(price){
                scope.invalidUserPrice = true;
                if(price) {
                    var netWeight = 0;
                    var systemPrice = 0;
                    if (scope.collateralQualityStandards.typeClassifier != 3) {
                        if (this.formData.collateralDetails.stoneWeight) {
                            netWeight = this.formData.collateralDetails.grossWeight - this.formData.collateralDetails.stoneWeight
                        } else {
                            netWeight = this.formData.collateralDetails.grossWeight;
                        }
                        systemPrice = (netWeight * scope.unitPrice);
                    } else {
                        systemPrice = scope.unitPrice;
                    }
                    scope.invalidUserPrice = (price > systemPrice);
                }else{
                    scope.invalidUserPrice = false;
                }

            };

            scope.validateData = function(){
                if(this.formData.collateralDetails){
                    scope.requiredCollateral = (angular.isUndefined(this.formData.collateralDetails.collateralId) || this.formData.collateralDetails.collateralId.length==0);
                    scope.requiredQualityStandard = (angular.isUndefined(this.formData.collateralDetails.qualityStandardId) || this.formData.collateralDetails.qualityStandardId.length==0);
                    if(!scope.isOther) {
                        scope.requiredGrossWeight = (angular.isUndefined(this.formData.collateralDetails.grossWeight) || this.formData.collateralDetails.grossWeight.length==0);
                        if(!scope.requiredGrossWeight){
                            scope.invalidStoneWeight = (angular.isDefined(this.formData.collateralDetails.stoneWeight) && (this.formData.collateralDetails.grossWeight <= this.formData.collateralDetails.stoneWeight));
                        }else{
                            scope.invalidStoneWeight = false;
                        }
                    }else{
                        scope.requiredGrossWeight = false;
                        scope.invalidStoneWeight = false;
                    }
                    scope.validateUserPrice(this.formData.collateralDetails.userPrice);
                }else{
                    scope.requiredCollateral = true;
                    scope.requiredQualityStandard = true;
                }

                return ( !scope.requiredCollateral  && !scope.requiredQualityStandard  && !scope.invalidUserPrice && !scope.requiredGrossWeight && !scope.invalidStoneWeight);
            };

            scope.validateCollateral = function(id){
                scope.requiredCollateral = (angular.isUndefined(id) || id.length==0);
            };

            scope.validateStoneWeight = function(weight){
                scope.invalidStoneWeight = (scope.requiredGrossWeight || weight > this.formData.collateralDetails.grossWeight);
            };

            scope.validateQualityStandard = function(id){
                scope.requiredQualityStandard = (angular.isUndefined(id) || id.length==0);
            };

            scope.validateGrossWeight = function(weight){
                scope.requiredGrossWeight = (angular.isUndefined(weight) || weight.length==0);
                scope.invalidStoneWeight = false;
            };


            scope.updatePledge = function () {
                this.formData.locale = scope.optlang.code;
                delete this.formData.id ;
                delete this.formData.officeName ;
                delete this.formData.clientName ;
                delete this.formData.pledgeNumber ;
                delete this.formData.collateralDetailsData ;
                delete this.formData.status;
                delete this.formData.createdBy ;
                delete this.formData.createdDate;
                delete this.formData.updatedBy ;
                delete this.formData.updatedDate;
                this.formData.systemValue = scope.totalSystemPrice;
                this.formData.userValue = scope.totalUserPrice;
                this.formData.collateralDetails = scope.collateralDetails;
                resourceFactory.pledgeResource.update({'pledgeId': scope.pledgeId}, this.formData, function (data) {
                    location.path('/viewpledge/' + scope.pledgeId);
                });
            };


        }
    });

    mifosX.ng.application.controller('EditPledgeController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.EditPledgeController]).run(function ($log) {
        $log.info("EditPledgeController initialized");
    });
}(mifosX.controllers || {}));