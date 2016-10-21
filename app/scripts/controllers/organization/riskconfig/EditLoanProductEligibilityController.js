(function (module) {
    mifosX.controllers = _.extend(module, {
        EditLoanProductEligibilityController: function (scope, routeParams, resourceFactory, location, $modal, route) {
            scope.formData = {
                isActive: true,
                criterias: []
            };

            scope.eligibilityData = {};
            resourceFactory.loanProductEligibility.get({loanProductId: routeParams.id},
                function (data) {
                    scope.eligibilityData = data;
                    scope.formData.criterias = data.criterias ;
                    scope.formData.isActive = data.isActive;
                    scope.formData.loanProductId = routeParams.id;
                }
            );
            scope.criteriaData = {};

            scope.riskCriterias = [];
            scope.loanProducts = [];
            scope.riskCriteriaMap = {};

            scope.comparators = {
                "STRING": [
                    {display: "==", value: "eq"},
                    {display: "!=", value: "ne"},
                    {display: "contains", value: "contains"},
                    {display: "Starts With", value: "startswith"}
                ],
                "NUMBER": [
                    {display: "==", value: "eq"},
                    {display: "!=", value: "ne"},
                    {display: ">", value: "gt"},
                    {display: "<", value: "lt"},
                    {display: ">=", value: "ge"},
                    {display: "<=", value: "le"}
                ],
                "BOOLEAN": [
                    {display: "==", value: "eq"},
                    {display: "!=", value: "ne"}
                ]
            };

            function populateDefaultCriteria () {
                scope.criteriaData = {riskCriteriaId:scope.riskCriterias[0].id};
            };

            function populateRiskCriteriaMap () {
                scope.riskCriterias.forEach(function (item) {
                    if(item.valueType == 'BOOLEAN' && item.options == undefined){
                        item.options = [{key:"true",value:"true"},{key:"false",value:"false"}];
                    }
                    if(item.options !== undefined && item.options.length > 0 && item.valueType != 'NUMBER'){
                        item.comparators = [{display: "==", value: "eq"},
                            {display: "!=", value: "ne"}];
                    }else{
                        item.comparators = scope.comparators[item.valueType];
                    }
                    scope.riskCriteriaMap[item.id] = item;
                });
            };

            scope.onSave = function () {
                // this.formData.locale = "en";
                //console.log(JSON.stringify(scope.formData));
                resourceFactory.loanProductEligibility.update({loanProductId: scope.formData.loanProductId},
                    this.formData, function (response) {
                    location.path('/loanproduct/listeligibility')
                });
            };

            scope.addEligibilityCriteria = function () {
                var riskCriteria;
                var valueType;
                var defaultValue;
                var criteriaId = scope.criteriaData.riskCriteriaId;
                if(criteriaId !== undefined){
                    riskCriteria = scope.riskCriteriaMap[criteriaId];
                    if(riskCriteria!== undefined){
                        defaultValue = riskCriteria.possibleOutputs[0].key;
                        valueType = riskCriteria.valueType;
                    }
                }
                var newCriteria = {
                    minAmount: scope.criteriaData.minAmount,
                    maxAmount: scope.criteriaData.maxAmount,
                    riskCriteriaId: scope.criteriaData.riskCriteriaId,
                    approvalLogic: {expression:{parameter:"criteria",comparator:"eq",valueType:valueType,value:defaultValue}},
                    rejectionLogic: {expression:{parameter:"criteria",comparator:"eq",valueType:valueType,value:defaultValue}}
                };
                scope.formData.criterias.push(newCriteria);
                populateDefaultCriteria();
            };

            scope.onChangeCriteria = function (eligibilityCriteria) {
                var riskCriteria;
                var criteriaId = eligibilityCriteria.riskCriteriaId;
                if(criteriaId !== undefined){
                    riskCriteria = scope.riskCriteriaMap[criteriaId];
                    if(riskCriteria!== undefined){
                        eligibilityCriteria.value = riskCriteria.possibleOutputs[0].key;
                        eligibilityCriteria.valueType = riskCriteria.valueType;
                    }
                }
            };

            scope.removeCriteria = function (index) {
                scope.formData.criterias.splice(index, 1);
            };

            resourceFactory.loanProductResource.getAllLoanProducts(function(data){
                scope.loanProducts = data;
            });

            resourceFactory.riskCriteria.getAll({}, function (data) {
                scope.riskCriterias = data;
                populateRiskCriteriaMap();
                populateDefaultCriteria();
            });

            // scope.expressionstr = function(){
            //     scope.ruleData.buckets.forEach(function (item) {
            //         item.filterstr = computed(item.filter);
            //     });
            //     return JSON.stringify(scope.ruleData.buckets,null,2);
            // };
        }
    });
    mifosX.ng.application.controller('EditLoanProductEligibilityController', ['$scope', '$routeParams', 'ResourceFactory', '$location', '$modal', '$route', mifosX.controllers.EditLoanProductEligibilityController]).run(function ($log) {
        $log.info("EditLoanProductEligibilityController initialized");
    });

}(mifosX.controllers || {}));