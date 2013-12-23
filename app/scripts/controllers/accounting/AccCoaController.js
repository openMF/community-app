(function(module) {
  mifosX.controllers = _.extend(module, {
    AccCoaController: function(scope, resourceFactory,location) {
      scope.coadata = [];
      scope.isTreeView = false;
        scope.routeTo = function(id){
          location.path('/viewglaccount/' + id);
        };

      scope.deepCopy = function (obj) {
         if (Object.prototype.toString.call(obj) === '[object Array]') {
             var out = [], i = 0, len = obj.length;
             for ( ; i < len; i++ ) {
                 out[i] = arguments.callee(obj[i]);
             }
             return out;
         }
         if (typeof obj === 'object') {
             var out = {}, i;
             for ( i in obj ) {
                 out[i] = arguments.callee(obj[i]);
             }
             return out;
         }
         return obj;
      }

      resourceFactory.accountCoaResource.getAllAccountCoas(function(data) {
          scope.coadatas = scope.deepCopy(data);

          var assetObject = {id:-1, name:"ASSET", parentId:-999, children:[]};
          var liabilitiesObject = {id:-2, name:"LIABILITY", parentId:-999, children:[]};
          var equitiyObject = {id:-3, name:"EQUITY", parentId:-999, children:[]};
          var incomeObject = {id:-4, name:"INCOME", parentId:-999, children:[]};
          var expenseObject = {id:-5, name:"EXPENSE", parentId:-999, children:[]};
          var rootObject = {id:-999, name:"Accounting", children:[]};
          var rootArray = [rootObject, assetObject, liabilitiesObject, equitiyObject, incomeObject, expenseObject];
          
          var idToNodeMap = {};
          for(var i in rootArray){
            idToNodeMap[rootArray[i].id] = rootArray[i];
          }
          
          for(i=0;i<data.length;i++){
            if (data[i].type.value == "ASSET") {
              if (data[i].parentId == null)  data[i].parentId = -1;
            } else if (data[i].type.value == "LIABILITY") {
              if (data[i].parentId == null)  data[i].parentId = -2;
            } else if (data[i].type.value == "EQUITY") {
              if (data[i].parentId == null)  data[i].parentId = -3;
            } else if (data[i].type.value == "INCOME") {
              if (data[i].parentId == null)  data[i].parentId = -4;
            } else if (data[i].type.value == "EXPENSE") {
              if (data[i].parentId == null)  data[i].parentId = -5;
            }
            delete data[i].disabled;
            delete data[i].manualEntriesAllowed;
            delete data[i].type;
            delete data[i].usage;
            delete data[i].description;
            delete data[i].nameDecorated;
            delete data[i].tagId;
            data[i].children = [];
            idToNodeMap[data[i].id] = data[i];
          }

          function sortByParentId(a, b){
              return a.parentId - b.parentId;
          }
          data.sort(sortByParentId);
          var glAccountsArray = rootArray.concat(data);

          var root = [];
          for(var i = 0; i < glAccountsArray.length; i++) {
            var currentObj = glAccountsArray[i];
              if(currentObj.children){
                  currentObj.collapsed = "true";
              }
            if(typeof currentObj.parentId === "undefined") {
                  root.push(currentObj);        
            } else {
                  parentNode = idToNodeMap[currentObj.parentId];
                  parentNode.children.push(currentObj);
            }
          }
          scope.treedata = root;


      });
    }
  });
  mifosX.ng.application.controller('AccCoaController', ['$scope', 'ResourceFactory','$location', mifosX.controllers.AccCoaController]).run(function($log) {
    $log.info("AccCoaController initialized");
  });
}(mifosX.controllers || {}));