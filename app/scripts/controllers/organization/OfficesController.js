(function(module) {
  mifosX.controllers = _.extend(module, {
    OfficesController: function(scope, resourceFactory,location) {

      scope.offices = [];
      scope.isTreeView = false;
      var idToNodeMap = {};
      scope.routeTo = function(id){
          location.path('/viewoffice/' + id);
      };

      //getting deep clone object to call the getDeepCopyObject
      var deepCloneObject = new mifosX.models.DeepClone();

      resourceFactory.officeResource.getAllOffices(function(data){
        scope.offices = deepCloneObject.getDeepCopyObject(data);;
        for(var i in data){
          data[i].children = [];
          idToNodeMap[data[i].id] = data[i];
        }
        function sortByParentId(a, b){
          return a.parentId - b.parentId;
        }
        data.sort(sortByParentId);

        var root = [];
        for(var i = 0; i < data.length; i++) {
          var currentObj = data[i];
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
  mifosX.ng.application.controller('OfficesController', ['$scope', 'ResourceFactory','$location', mifosX.controllers.OfficesController]).run(function($log) {
    $log.info("OfficesController initialized");
  });
}(mifosX.controllers || {}));
