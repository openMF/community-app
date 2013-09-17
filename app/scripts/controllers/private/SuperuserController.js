(function(module) {
    mifosX.controllers = _.extend(module, {
        SuperuserController: function(scope, resourceFactory) {
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
            var colorArray = ['#000000', '#0000ff', '#808080', '#008000', '#FFE6E6'];
            scope.colorFunction = function() {
                return function(d, i) {
                    return colorArray[i];
                };
            };

            scope.BarData = [
                              {
                                 "key": "Last Week",
                                 "values": [ [ 1 , 50] , [ 2 , 20] , [ 3 , 30] , [ 4 , 15] , [ 5 , 30] , [ 6 , 45] , [ 7 , 18]  ]
                             }

            ];

         }
    });
    mifosX.ng.application.controller('SuperuserController', ['$scope', 'ResourceFactory', mifosX.controllers.SuperuserController]).run(function($log) {
        $log.info("SuperuserController initialized");
    });
}(mifosX.controllers || {}));




    
    

