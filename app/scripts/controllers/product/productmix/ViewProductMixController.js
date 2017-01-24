(function (module) {
    mifosX.controllers = _.extend(module, {
        ViewProductMixController: function (scope, resourceFactory, routeParams, location, $uibModal) {
            scope.productmix = [];
            scope.choice = 0;
            scope.allowed = [];
            scope.restricted = [];
            resourceFactory.loanProductResource.getProductmix({loanProductId: routeParams.id, resourceType: 'productmix'}, function (data) {
                scope.productmix = data;
                scope.allowedProducts = data.allowedProducts;
                scope.restrictedProducts = data.restrictedProducts;
            });

            scope.deleteProductmix = function () {
                $uibModal.open({
                    templateUrl: 'deleteproductmix.html',
                    controller: ProductmixDeleteCtrl
                });
            };
            var ProductmixDeleteCtrl = function ($scope, $uibModalInstance) {
                $scope.delete = function () {
                    resourceFactory.loanProductResource.delete({loanProductId: routeParams.id, resourceType: 'productmix'}, {}, function (data) {
                        $uibModalInstance.close('delete');
                        location.path('/productmix');
                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };
            scope.restrict = function () {
                for (var i in this.allowed) {
                    for (var j in scope.allowedProducts) {
                        if (scope.allowedProducts[j].id == this.allowed[i]) {
                            var temp = {};
                            temp.id = this.allowed[i];
                            temp.name = scope.allowedProducts[j].name;
                            temp.includeInBorrowerCycle = scope.allowedProducts[j].includeInBorrowerCycle;
                            scope.restrictedProducts.push(temp);
                            scope.allowedProducts.splice(j, 1);
                        }
                    }
                }
                for (var i in this.allowed) {
                     for (var j in scope.restrictedProducts) {
                         if(scope.restrictedProducts[j].id == this.allowed[i]) {
                             scope.allowed.splice(i, 1);
                         }
                     }
                 }
            };
            scope.allow = function () {
                for (var i in this.restricted) {
                    for (var j in scope.restrictedProducts) {
                        if (scope.restrictedProducts[j].id == this.restricted[i]) {
                            var temp = {};
                            temp.id = this.restricted[i];
                            temp.name = scope.restrictedProducts[j].name;
                            temp.includeInBorrowerCycle = scope.restrictedProducts[j].includeInBorrowerCycle;
                            scope.allowedProducts.push(temp);
                            scope.restrictedProducts.splice(j, 1);
                        }
                    }
                }
                for (var i in this.restricted) {
                    for (var j in scope.allowedProducts) {
                        if(scope.allowedProducts[j].id == this.restricted[i]) {
                            scope.restricted.splice(i, 1);
                        }
                    }
                }            
            };
            scope.submit = function () {
                var temp = [];
                var final = {};
                for (var i in scope.restrictedProducts) {
                    temp[i] = scope.restrictedProducts[i].id;
                }
                final.restrictedProducts = temp;
                resourceFactory.loanProductResource.put({loanProductId: routeParams.id, resourceType: 'productmix'}, final, function (data) {
                    location.path('/viewproductmix/' + routeParams.id);
                });
            };


        }
    });
    mifosX.ng.application.controller('ViewProductMixController', ['$scope', 'ResourceFactory', '$routeParams', '$location', '$uibModal', mifosX.controllers.ViewProductMixController]).run(function ($log) {
        $log.info("ViewProductMixController initialized");
    });
}(mifosX.controllers || {}));
