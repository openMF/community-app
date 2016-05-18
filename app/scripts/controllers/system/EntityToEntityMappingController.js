(function (module) {
    mifosX.controllers = _.extend(module, {
        EntityToEntityMappingController: function (scope, dateFilter, routeParams, route, location, resourceFactory, $uibModal) {
            scope.entityMappings = [];
            scope.formData = {};
            scope.addFormData = {};
            scope.editFormData = {};
            scope.offices = [];
            scope.roles = [];
            scope.products = [];
            scope.savingsproducts = [];
            scope.charges = [];
            scope.selectedMappingType = 0;
            scope.selectedFromId = 0;
            scope.selectedToId = 0;
            scope.hasClickedFilters = false;
            scope.addScreenFilter = false;
            scope.editScreenFilter=false;
            scope.mapId = 0;
            scope.retrieveById = 0;
            scope.showTableData=false;


            scope.showFilters = function (id) {
                scope.selectedMappingType = id;
                scope.hasClickedFilters = false;
                scope.addScreenFilter = false;
                scope.editScreenFilter = false;
                scope.fetchRelatedData(scope.selectedMappingType);
                scope.selectedFromId = 0;
                scope.selectedToId = 0;
            }

            scope.cancelOperation= function(){
               this.showFilteredData();
            };

            scope.fetchRelatedData = function(id){
                scope.retrieveById = id;
                switch (scope.retrieveById) {

                    case 1:
                        resourceFactory.officeResource.getAllOffices(function (data) {
                            scope.offices = data;
                        });
                        resourceFactory.loanProductResource.getAllLoanProducts(function (data) {
                            scope.products = data;
                        });
                        break;
                    case 2:
                        resourceFactory.officeResource.getAllOffices(function (data) {
                            scope.offices = data;
                        });
                        resourceFactory.savingsTemplateResource.get(scope.inparams, function (data) {
                            scope.savingsproducts = data.productOptions;
                        });
                        break;
                    case 3:
                        resourceFactory.officeResource.getAllOffices(function (data) {
                            scope.offices = data;
                        });
                        resourceFactory.chargeResource.getAllCharges(function (data) {
                            scope.charges = data;
                        });
                        break;
                    case 4:
                        resourceFactory.roleResource.getAllRoles(function (data) {
                            scope.roles = data;
                        });
                        resourceFactory.loanProductResource.getAllLoanProducts(function (data) {
                            scope.products = data;
                        });
                        break;
                    case 5:
                        resourceFactory.roleResource.getAllRoles(function (data) {
                            scope.roles = data;
                        });
                        resourceFactory.savingsTemplateResource.get(scope.inparams, function (data) {
                            scope.savingsproducts = data.productOptions;
                        });
                        break;
                }

            }

            scope.showFilteredData = function () {
                scope.hasClickedFilters = true;
                scope.addScreenFilter = false;
                scope.editScreenFilter=false;
                if (scope.formData.selectedFromId > 0)
                    scope.selectedFromId = scope.formData.selectedFromId;
                else
                    scope.selectedFromId = 0;
                if (scope.formData.selectedToId > 0)
                    scope.selectedToId = scope.formData.selectedToId;
                else
                    scope.selectedToId = 0;
                resourceFactory.entityToEntityResource.getAllEntityMapping(
                        {
                            mappingId: scope.selectedMappingType,
                            fromId: scope.selectedFromId,
                            toId: scope.selectedToId
                        }, function (data) {
                            scope.entityMappingsList = data;
                });
            }

            scope.showAddScreen = function (selectedMappingType) {
                scope.relId = selectedMappingType;
                scope.hasClickedFilters = false;
                scope.editScreenFilter=false;
                scope.addScreenFilter=true;
                scope.fetchRelatedData(scope.relId);
                this.addFormData=null;

            }

            scope.showEditScreen = function (mapIdToEdit,selectedMappingType) {
                scope.hasClickedFilters = false;
                scope.addScreenFilter=false;
                scope.editScreenFilter=true;
                scope.relId = selectedMappingType;
                scope.mapIdToEdit=mapIdToEdit;
                resourceFactory.entityMappingResource.getEntityMapValues({'mapId':mapIdToEdit},function (data) {
                    scope.entityMap = data;
                    scope.editFormData.fromId =scope.entityMap[0].fromId;
                    scope.editFormData.toId =scope.entityMap[0].toId;
                    if (scope.entityMap[0].startDate) {
                        var startDate = dateFilter(scope.entityMap[0].startDate, scope.df);
                        scope.editFormData.startDate = new Date(startDate);
                    }
                    if (scope.entityMap[0].endDate) {
                        var endDate = dateFilter(scope.entityMap[0].endDate, scope.df);
                        scope.editFormData.endDate = new Date(endDate);
                    }

                });
                scope.fetchRelatedData(scope.relId);
            }

            scope.deleteMapping = function (mapId) {
                $uibModal.open({
                    templateUrl: 'deletemap.html',
                    controller: mapDeleteCtrl,
                    resolve: {
                        mapId: function () {
                            return mapId;
                        }
                    }
                });
            }

            scope.addEntityMappings = function (relationId) {
                scope.selectedMappingType = selectedMappingType;
                scope.fromId = 0;
                scope.toId = 0;
            }

            scope.submit = function (id) {
                scope.relId=id;
                var startDate = dateFilter(scope.addFormData.startDate, scope.df);
                var endDate = dateFilter(scope.addFormData.endDate, scope.df);

                this.addFormData.locale = scope.optlang.code;
                this.addFormData.dateFormat = scope.df;
                this.addFormData.startDate = startDate;
                this.addFormData.endDate = endDate;

                resourceFactory.entityMappingResource.save(
                    {mapId:scope.relId},this.addFormData, function (data) {
                        scope.showFilteredData();
                    });
            };

            scope.submitEdit = function(editId){
                scope.editMap = editId;
                var startDate = dateFilter(scope.editFormData.startDate, scope.df);
                var endDate = dateFilter(scope.editFormData.endDate, scope.df);

                this.editFormData.locale = scope.optlang.code;
                this.editFormData.dateFormat = scope.df;
                this.editFormData.startDate = startDate;
                this.editFormData.endDate = endDate;

                resourceFactory.entityMappingResource.update({'mapId':scope.editMap},this.editFormData, function (data) {
                    scope.showFilteredData();
                });
            };

            var mapDeleteCtrl = function ($scope, $uibModalInstance, mapId) {
                $scope.delete = function () {
                    resourceFactory.entityMappingResource.delete({
                        mapId: mapId,
                    }, function (data) {
                        $uibModalInstance.close('delete');
                        scope.showFilteredData();

                    });
                };
                $scope.cancel = function () {
                    $uibModalInstance.dismiss('cancel');
                };
            };



            scope.routeTo = function(id, relationId) {
                location.path('/editentitymapping/'+id + '/' +relationId);
            }


            resourceFactory.entityToEntityResource.getAllEntityMapping(function (data) {
                scope.entityMappings = data;
            });


        }
    });
    mifosX.ng.application.controller('EntityToEntityMappingController', ['$scope','dateFilter','$routeParams', '$route', '$location', 'ResourceFactory', '$uibModal', mifosX.controllers.EntityToEntityMappingController]).run(function ($log) {
        $log.info("EntityToEntityMappingController initialized");
    });
}(mifosX.controllers || {}));
