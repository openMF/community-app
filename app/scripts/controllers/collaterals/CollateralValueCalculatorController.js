(function (module) {
    mifosX.controllers = _.extend(module, {
        CollateralValueCalculatorController: function (scope, resourceFactory, location, routeParams) {
            scope.formData = {};
            scope.pledgeFormData = {};
            scope.percentagePrice = 1;
            scope.isOther = false;
            scope.collateralDetails = [];
            scope.totalSystemPrice = 0;
            scope.totalUserPrice = 0;
            scope.unitPrice = 0;
            scope.invalidUserPrice = false;
            scope.requiredCollateral = false;
            scope.requiredQualityStandard = false;
            scope.requiredGrossWeight = false;
            scope.invalidStoneWeight = false;
            scope.isRedirectedFromClient = angular.isDefined(routeParams.clientId);

            scope.getCollaterals = function(){
                resourceFactory.collateralsResource.getAll(function(data){
                    if(data.length>0){
                        scope.collaterals = data;
                    }
                });
            }
            scope.getCollaterals();

            scope.changeCollateral = function(collateralId){
                this.formData = {};
                this.formData.collateralId = collateralId;
                scope.unitPrice = 0;
                scope.getQualityStandards(collateralId);
                scope.invalidUserPrice = false;
                scope.validateCollateral(collateralId);
            };

            scope.changeQualityStandards = function(collateralId,qualityStandardId){
                scope.invalidUserPrice = false;
                this.formData.qualityStandardId = qualityStandardId;
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
                scope.formData = {};
            }
            scope.submit = function () {
                if(scope.isOther==true){
                    this.formData.systemPrice = scope.unitPrice;
                    this.formData.netWeight = undefined;
                    this.formData.stoneWeight = undefined;
                }else{
                    var stoneWeight = 0;
                    if(this.formData.stoneWeight){
                        stoneWeight = this.formData.stoneWeight;
                    }
                    this.formData.netWeight = this.formData.grossWeight-stoneWeight;
                    this.formData.systemPrice = scope.unitPrice*this.formData.netWeight;

                    this.formData.stoneWeight = undefined;
                }
                if(angular.isUndefined(this.formData.userPrice)){
                    this.formData.userPrice = this.formData.systemPrice
                }
                scope.collateralDetails.push(this.formData);
                for(var i=0 ;i<scope.collateralDetails.length;i++){
                    scope.getNames(i,scope.collateralDetails[i].collateralId,scope.collateralDetails[i].qualityStandardId)
                }
                scope.calculatedValue(scope.collateralDetails);
                this.formData = {};
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

            scope.validateData = function(){
                scope.requiredCollateral = (angular.isUndefined(this.formData.collateralId) || this.formData.collateralId.length==0);
                scope.requiredQualityStandard = (angular.isUndefined(this.formData.qualityStandardId) || this.formData.qualityStandardId.length==0);
                if(!scope.isOther) {
                    scope.requiredGrossWeight = (angular.isUndefined(this.formData.grossWeight) || this.formData.grossWeight.length==0);
                    if(this.formData.stoneWeight && !scope.requiredGrossWeight){
                        scope.invalidStoneWeight = parseInt(this.formData.grossWeight)<= parseInt(this.formData.stoneWeight)
                    }else{
                        scope.invalidStoneWeight = false;
                    }

                }else{
                    scope.requiredGrossWeight = false;
                    scope.invalidStoneWeight = false;
                }
                return ( !scope.requiredCollateral  && !scope.requiredQualityStandard  && !scope.requiredGrossWeight && !scope.invalidStoneWeight);
            };

            scope.validateUserPrice = function(price){
                scope.invalidUserPrice = true;
                if(price) {
                    var netWeight = 0;
                    var systemPrice = 0;
                    if (scope.collateralQualityStandards.typeClassifier != 3) {
                        if (this.formData.stoneWeight) {
                            netWeight = parseInt(this.formData.grossWeight) - parseInt(this.formData.stoneWeight);
                        } else {
                            netWeight = parseInt(this.formData.grossWeight);
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

            scope.validateCollateral = function(id){
                scope.requiredCollateral = (angular.isUndefined(id) || id.length==0);
            };

            scope.validateStoneWeight = function(weight){
                if(this.formData.grossWeight){
                    scope.invalidStoneWeight = parseInt(weight) > parseInt(this.formData.grossWeight);
                }else{
                    scope.invalidStoneWeight = false;
                }
            };

            scope.validateQualityStandard = function(id){
                scope.requiredQualityStandard = (angular.isUndefined(id) || id.length==0);
            };

            scope.validateGrossWeight = function(weight){
                if(this.formData.stoneWeight){
                    scope.invalidStoneWeight = parseInt(weight) < parseInt(this.formData.stoneWeight);
                }else{
                    scope.invalidStoneWeight = false;
                }
                scope.requiredGrossWeight = (angular.isUndefined(weight) || weight.length==0);
            };

            scope.calculatedValue = function(data){
                var totalSystemPrice = 0;
                var totalUserPrice = 0;
                for(var i=0;i<data.length;i++){
                    totalSystemPrice = totalSystemPrice+ parseInt(data[i].systemPrice);
                    totalUserPrice = totalUserPrice+ parseInt(data[i].userPrice);
                }
                scope.totalSystemPrice = totalSystemPrice;
                scope.totalUserPrice = totalUserPrice;
            };

            scope.getNames = function(index, collateralId, qualityStandardsId){
                resourceFactory.collateralsResource.getCollateralQualityStandards({collateralId: collateralId},function(data){
                    scope.collateralDetails[index]['collateralName'] = data.name;
                });
                resourceFactory.collateralsQualityStandardsResource.get({collateralId: collateralId, qualityId: qualityStandardsId},function(qualityData){
                    scope.collateralDetails[index]['qualityStandardsName'] = qualityData.name;
                });
            };

            scope.savePledge = function(path){
                if(routeParams.clientId){
                    this.pledgeFormData.clientId = routeParams.clientId;
                }
                this.pledgeFormData.systemValue = scope.totalSystemPrice;
                this.pledgeFormData.userValue = scope.totalUserPrice;
                this.pledgeFormData.locale = scope.optlang.code;
                this.pledgeFormData.status = 1;
                this.pledgeFormData.collateralDetails = scope.collateralDetails;
                resourceFactory.pledgeResource.save(this.pledgeFormData,function(data){
                    if(routeParams.clientId){
                        location.path('/viewclient/'+routeParams.clientId);
                    }else{
                        if(path=='/collateralvaluecalculator'){
                            location.path(path);
                        }else{
                            path = path+data.resourceId;
                            location.path(path);
                        }
                    }

                });

            };
        }
    });



    mifosX.ng.application.controller('CollateralValueCalculatorController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.CollateralValueCalculatorController]).run(function ($log) {
        $log.info("CollateralValueCalculatorController initialized");
    });
}(mifosX.controllers || {}));


