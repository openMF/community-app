(function(module) {
  mifosX.controllers = _.extend(module, {

    RunReportsController: function(scope, routeParams, resourceFactory, location, API_VERSION) {

      scope.isCollapsed = false; //displays options div on startup
      scope.hideTable = true; //hides the results div on startup
      scope.hidePentahoReport = true; //hides the results div on startup
      scope.formData = {};
      scope.reportParams = new Array();
      scope.reportDateParams = new Array();
      scope.reqFields = new Array();
      scope.reportData = {};
      scope.reportData.columnHeaders = [];
      scope.reportData.data = [];
      scope.baseURL="#";

      scope.reportName = routeParams.name;
      scope.reportType = routeParams.type;
      scope.pentahoReportDetail=[];

      resourceFactory.runReportsResource.getReport({reportSource: 'FullParameterList', parameterType : true, R_reportListing: "'"+routeParams.name+"'"}, function(data){
        
        for (var i in data.data ) {
            var temp = {
                  name: data.data[i].row[0],
                  variable: data.data[i].row[1],
                  label: data.data[i].row[2],
                  displayType: data.data[i].row[3],
                  formatType: data.data[i].row[4],
                  defaultVal: data.data[i].row[5],
                  selectOne: data.data[i].row[6],
                  selectAll: data.data[i].row[7],
                  parentParameterName: data.data[i].row[8],
                  inputName: "R_"+ data.data[i].row[1] //model name
            };
            scope.reqFields.push(temp);
            if (temp.displayType == 'select' && temp.parentParameterName == null) {
             intializeParams(temp,{});
            } else if (temp.displayType == 'date') {
              scope.reportDateParams.push(temp);
            }
          }
      });

      if (scope.reportType == 'Pentaho') {
        resourceFactory.runReportsResource.getReport({reportSource: 'FullReportDetails', parameterType : true, R_reportName: routeParams.name}, function(data){

          var prevId = -1;
          var currId;
          var tmpParameters;
          for (var i in data.data )
          {
            currId = data.data[i].row[0]
            if (currId != prevId)
            {
              tmpParameters = [];
              if (!(data.data[i].row[5] == null))
              {
                tmpParam = [];
                tmpParam.push(data.data[i].row[6]);
                tmpParam.push(data.data[i].row[7]);
                tmpParameters.push(tmpParam);
              }
              tmpRow = {
                    id: data.data[i].row[0],
                    name: data.data[i].row[1],
                    type: data.data[i].row[2],
                    subtype: data.data[i].row[3],
                    category: data.data[i].row[4],
                    parameters: tmpParameters
              }
              scope.pentahoReportDetail.push(tmpRow); 
              prevId = currId;

            }
            else
            { 
              tmpParam = [];
              tmpParam.push(data.data[i].row[6]);
              tmpParam.push(data.data[i].row[7]);
              scope.pentahoReportDetail[(scope.pentahoReportDetail.length - 1)].parameters.push(tmpParam);
            }
          }
        });
      }

      function getSuccuessFunction (paramData) {
        var tempDataObj = new Object();
        var successFunction = function(data) {
          var selectData = [];
          var isExistedRecord = false;
          for (var i in data.data ) {
            selectData.push({id: data.data[i].row[0], name: data.data[i].row[1]});
          }
          for (var i in scope.reportParams ) {
            if (scope.reportParams[i].name == paramData.name) {
              scope.reportParams[i].selectOptions = selectData;
              isExistedRecord = true;
            }
          }
          if (!isExistedRecord) {
            paramData.selectOptions = selectData;
            scope.reportParams.push(paramData);
          }
        };
        return successFunction;
      }

      function intializeParams (paramData, params) {
        params.reportSource = paramData.name;
        params.parameterType = true;
        var successFunction = getSuccuessFunction(paramData);
        resourceFactory.runReportsResource.getReport(params, successFunction);
      }

      scope.getDependencies = function (paramData) {
        for (var i = 0; i < scope.reqFields.length; i++) {
          var temp = scope.reqFields[i];
          if (temp.parentParameterName == paramData.name) {
            if (temp.displayType == 'select') {
              var parentParamValue = this.formData[paramData.inputName];
              if (parentParamValue != undefined) {
                eval("var params={};params." + paramData.inputName + "='" + parentParamValue + "';");
                intializeParams(temp, params);
              }
            } else if (temp.displayType == 'date') {
              scope.reportDateParams.push(temp);
            }
          }
        }
      };

      scope.checkStatus = function () {
        var collapsed = false;
        if (scope.isCollapsed) {
          collapsed = true;
        }
        return collapsed;
      };

      function buildReportParms() {
        var paramCount = 1;
        var reportParams = "";
        for (var i = 0; i < scope.reqFields.length; i++) {
          var reqField = scope.reqFields[i];
          for (var j = 0; j < scope.pentahoReportDetail.length; j++) {
            var tempParam = scope.pentahoReportDetail[j];
            for (var k = 0; k < tempParam.parameters.length; k++) {
              if (reqField.name == tempParam.parameters[k][1]) {
                var paramName = "R_"+tempParam.parameters[k][0];
                if (paramCount > 1) reportParams += "&"
                reportParams += encodeURIComponent(paramName) + "=" + encodeURIComponent(scope.formData[scope.reqFields[i].inputName]);
                paramCount = paramCount + 1;
              }
            }
          }
        }
        return reportParams;
      }

      scope.runReport = function (){
        scope.isCollapsed=true;

        switch(scope.reportType)
        {
          case "Table":
            scope.hideTable=false;
            scope.hidePentahoReport = true;
            scope.formData.reportSource = scope.reportName;
            resourceFactory.runReportsResource.getReport(scope.formData, function(data){
              scope.reportData.columnHeaders = data.columnHeaders;
              scope.reportData.data = data.data;
            });
          break;
          
          case "Pentaho":

            scope.hideTable=true;
            scope.hidePentahoReport = false;
            scope.baseURL = API_VERSION + "/runreports/" + encodeURIComponent(scope.reportName); 
            scope.baseURL += "?output-type="+encodeURIComponent(scope.formData.outputType)+"&tenantIdentifier=default";
            var inQueryParameters = buildReportParms();
            if (inQueryParameters > "") scope.baseURL += "&" + inQueryParameters;
          break;

          default:
              alert("System Error: Unknown Report Type: " + scope.reportType);
        }
        
      };
    }
  });
  mifosX.ng.application.controller('RunReportsController', ['$scope', '$routeParams', 'ResourceFactory', '$location', 'API_VERSION', mifosX.controllers.RunReportsController]).run(function($log) {
    $log.info("RunReportsController initialized");
  });
}(mifosX.controllers || {}));
