(function (module) {
    mifosX.controllers = _.extend(module, {
        EditCollateralQualityStandardsController: function (scope, resourceFactory, location, routeParams) {
            scope.formData = {};
            scope.collateralId = routeParams.collateralId;
            resourceFactory.collateralsQualityStandardsResource.get({collateralId: routeParams.collateralId, qualityId: routeParams.qualityStandardId}, function (data) {
                scope.formData = data;
                if(scope.formData.hasOwnProperty('percentagePrice')){
                    scope.formData.isPercentage = true;
                    scope.formData.price = data.percentagePrice;
                }else{
                    scope.formData.isPercentage = false;
                    scope.formData.price = data.absolutePrice;
                }
            });

            scope.editPropertyToSetUndefined = ['createdName', 'updatedName', 'id', 'createdBy', 'updatedBy', 'createdDate', 'updatedDate'];

            scope.submit = function () {
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
                var id = this.formData.id;
                this.formData = scope.setUndefined(this.formData,scope.editPropertyToSetUndefined);
                    resourceFactory.collateralsQualityStandardsResource.update({collateralId: routeParams.collateralId,qualityId: id}, this.formData, function (data) {
                        location.path('viewcollateralqualitystandards/'+routeParams.collateralId);
                    });

            };

            scope.setUndefined = function(data,editArr){
                for(var i=0;i<editArr.length;i++){
                    data[editArr[i]] = undefined;
                }
                return data;
            };

            scope.clear = function(){
                scope.formData = {};
            };

        }
    });



    mifosX.ng.application.controller('EditCollateralQualityStandardsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.EditCollateralQualityStandardsController]).run(function ($log) {
        $log.info("EditCollateralQualityStandardsController initialized");
    });
}(mifosX.controllers || {}));

