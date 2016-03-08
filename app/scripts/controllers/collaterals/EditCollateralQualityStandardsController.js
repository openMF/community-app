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

            scope.editPropertyToSetUndefined = ['price','isPercentage','createdName', 'updatedName', 'createdBy', 'updatedBy', 'createdDate', 'updatedDate'];
            scope.requestParameter = ['id','absolutePrice','percentagePrice','description','locale','name'];
            scope.submit = function () {
                var id = this.formData.id;
                var isPercentage = this.formData.isPercentage;
                var price = this.formData.price;
                if (this.formData.isPercentage) {
                    this.formData['percentagePrice'] = this.formData.price;
                    this.formData['absolutePrice'] = null;
                } else {
                    this.formData['absolutePrice'] = this.formData.price;
                    this.formData['percentagePrice'] = null;
                }
                this.formData.collateralId = routeParams.collateralId;
                this.formData.locale = scope.optlang.code;
                var data = {};
                for(var i=0;i<scope.requestParameter.length;i++){
                    data[scope.requestParameter[i]] = this.formData[scope.requestParameter[i]];
                }
                    resourceFactory.collateralsQualityStandardsResource.update({collateralId: routeParams.collateralId,qualityId: id}, data, function (data) {
                        location.path('viewcollateralqualitystandards/'+routeParams.collateralId);
                    });

            };

            scope.setUndefined = function(data,editArr){
                for(var i=0;i<editArr.length;i++){
                    data[editArr[i]] = undefined;
                }
                return data;
            };

        }
    });



    mifosX.ng.application.controller('EditCollateralQualityStandardsController', ['$scope', 'ResourceFactory', '$location', '$routeParams', mifosX.controllers.EditCollateralQualityStandardsController]).run(function ($log) {
        $log.info("EditCollateralQualityStandardsController initialized");
    });
}(mifosX.controllers || {}));

