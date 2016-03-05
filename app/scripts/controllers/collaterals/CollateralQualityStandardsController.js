(function (module) {
    mifosX.controllers = _.extend(module, {
        CollateralQualityStandardsController: function (scope, resourceFactory, location, routeParams) {
            scope.formData = {};
            scope.requiredPrice = false;
            scope.requiredName = false;
            scope.editPropertyToSetUndefined = ['createdName', 'updatedName', 'id', 'createdBy', 'updatedBy', 'createdDate', 'updatedDate'];

            scope.getData = function(){
                resourceFactory.collateralsResource.getCollateralQualityStandards({collateralId: routeParams.collateralId, association: 'qualityStandards'},function(data){
                    scope.collaterals = data;
                    if(scope.collaterals.qualityStandards && scope.collaterals.qualityStandards.length>0){
                        for(var i=0;i<scope.collaterals.qualityStandards.length;i++){
                            scope.getName(i,scope.collaterals.qualityStandards[i].createdBy,'createdName');
                            if(scope.collaterals.qualityStandards[i].hasOwnProperty('updatedBy')){
                                scope.getName(i,scope.collaterals.qualityStandards[i].updatedBy,'updatedName');
                            }
                        }
                    }

                });
            };

            scope.getData();

            scope.submit = function () {
                scope.requiredPrice = false;
                scope.requiredName = false;
                if (this.formData.isPercentage) {
                    this.formData['percentagePrice'] = this.formData.price;
                    this.formData['absolutePrice'] = null;
                } else {
                    this.formData['absolutePrice'] = this.formData.price;
                    this.formData['percentagePrice'] = null;
                }
                this.formData.collateralId = routeParams.collateralId;
                this.formData.locale = scope.optlang.code;
                this.formData.isPercentage = undefined;
                this.formData.price = undefined;
                resourceFactory.collateralsQualityStandardsResource.save({collateralId: routeParams.collateralId}, this.formData, function (data) {
                    scope.formData = {};
                    scope.getData();
                });

            };

            scope.deleteQualityStandards = function(qualityStandards){
                resourceFactory.collateralsQualityStandardsResource.delete({collateralId: qualityStandards.collateralId,qualityId: qualityStandards.id}, function (data) {
                    scope.formData = {};
                    scope.getData();
                });
            };

            scope.validateData = function(){
                scope.requiredName = (angular.isUndefined(this.formData.name) || this.formData.name.length==0);
                scope.requiredPrice = (angular.isUndefined(this.formData.price) || this.formData.price.length==0);
                return (!scope.requiredName && !scope.requiredPrice);
            };

            scope.validateName = function(name){
                scope.requiredName = (this.formData.name.length==0);
            };

            scope.validatePrice = function(price){
                scope.requiredPrice = (this.formData.price.length==0);
            };

            scope.setUndefined = function(data,editArr){
                for(var i=0;i<editArr.length;i++){
                    data[editArr[i]] = undefined;
                }
                return data;
            };

            scope.getName = function(index,id,name) {
                resourceFactory.userResource.getUser({userId: id}, function (datas) {
                    scope.collaterals.qualityStandards[index][name] = datas.username;
                });
                return name;
            };

        }
    });

    mifosX.ng.application.controller('CollateralQualityStandardsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.CollateralQualityStandardsController]).run(function ($log) {
        $log.info("CollateralQualityStandardsController initialized");
    });
}(mifosX.controllers || {}));
