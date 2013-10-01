(function(module) {
    mifosX.controllers = _.extend(module, {
        SuperuserController: function(scope, resourceFactory) {
            scope.client = [];

            scope.formatdate = function(){
                var bardate = new Date();
                scope.formattedDate = [];
                for(var i=0; i<15;i++){
                    var temp_date = bardate.getDate();
                    bardate.setDate(temp_date - 1);
                    var curr_date = bardate.getDate();
                    var curr_month = bardate.getMonth() +1;
                    scope.formattedDate[i] = curr_date + "/" + curr_month;
                }
            };
            scope.formatdate();

            resourceFactory.runReportsResource.get({reportSource: 'ClientTrends', genericResultSet:false} , function(data) {
                scope.client = data;
                resourceFactory.runReportsResource.get({reportSource: 'LoanTrends', genericResultSet:false} , function(data) {
                    scope.BarData = [

                                        {
                                            "key": "New Client Joining",
                                            "values": [
                                                                [ scope.formattedDate[14] , scope.client[0].count] ,
                                                                [ scope.formattedDate[13] , scope.client[1].count] ,
                                                                [ scope.formattedDate[12] , scope.client[2].count] ,
                                                                [ scope.formattedDate[11] , scope.client[3].count] ,
                                                                [ scope.formattedDate[10] , scope.client[4].count] ,
                                                                [ scope.formattedDate[9] , scope.client[5].count] ,
                                                                [ scope.formattedDate[8] , scope.client[6].count] ,
                                                                [ scope.formattedDate[7] , scope.client[7].count] ,
                                                                [ scope.formattedDate[6] , scope.client[8].count] ,
                                                                [ scope.formattedDate[5] , scope.client[9].count] ,
                                                                [ scope.formattedDate[4] , scope.client[10].count] ,
                                                                [ scope.formattedDate[3] , scope.client[11].count] ,
                                                                [ scope.formattedDate[2] , scope.client[12].count] ,
                                                                [ scope.formattedDate[1] , scope.client[13].count] ,
                                                                [ scope.formattedDate[0] , scope.client[14].count]
                                                       ]
                                        },

                                        {
                                            "key": "Loans Disbursed",
                                            "values": [
                                                                [ scope.formattedDate[14] , data[0].lcount] ,
                                                                [ scope.formattedDate[13] , data[1].lcount] ,
                                                                [ scope.formattedDate[12] , data[2].lcount] ,
                                                                [ scope.formattedDate[11] , data[3].lcount] ,
                                                                [ scope.formattedDate[10] , data[4].lcount] ,
                                                                [ scope.formattedDate[9] , data[5].lcount] ,
                                                                [ scope.formattedDate[8] , data[6].lcount] ,
                                                                [ scope.formattedDate[7] , data[7].lcount] ,
                                                                [ scope.formattedDate[6] , data[8].lcount] ,
                                                                [ scope.formattedDate[5] , data[9].lcount] ,
                                                                [ scope.formattedDate[4] , data[10].lcount] ,
                                                                [ scope.formattedDate[3] , data[11].lcount] ,
                                                                [ scope.formattedDate[2] , data[12].lcount] ,
                                                                [ scope.formattedDate[1] , data[13].lcount] ,
                                                                [ scope.formattedDate[0] , data[14].lcount]
                                                        ]
                                        }

                                  ];
                });
            });
            scope.exampleData = [
                {key:"Morning", y:35},
                {key:"Afternoon", y:20},
                {key:"Evening", y:25},
                {key:"Night", y:20}
            ];
            scope.xFunction = function(){
                return function(d) {
                    return d.key;
                };
            };
            scope.yFunction = function(){
                return function(d) {
                    return d.y;
                };
            };
            var colorArray = ['#0f82f5', '#008000', '#808080', '#000000', '#FFE6E6'];
            scope.colorFunction = function() {
                return function(d, i) {
                    return colorArray[i];
                };
            };

            scope.stackData = [

                {
                    "key": "Last Week",
                    "values": [ [1  , 50] , [ 2 , 20] , [ 3 , 30] , [ 4 , 15] , [ 5 , 30] , [ 6  , 45] , [ 7 , 18]  ]
                }

            ];

         }
    });
    mifosX.ng.application.controller('SuperuserController', ['$scope', 'ResourceFactory', mifosX.controllers.SuperuserController]).run(function($log) {
        $log.info("SuperuserController initialized");
    });
}(mifosX.controllers || {}));




    
    

