(function (module) {
    mifosX.controllers = _.extend(module, {
        XBRLReportController: function (scope, resourceFactory, location, $rootScope) {

            scope.xmlData = $rootScope.xmlData;
            var html = "<table width='100%' border='1'><tr><th>Title</th><th>Dimension</th><th>Value</th></tr>";
            $(scope.xmlData).find("*[contextRef]").each(function (i) {
                var contextId = $(this).attr("contextRef");
                var context = $(scope.xmlData).find("#" + contextId).find("scenario").text();
                html += '<tr>';
                html += '<td>' + this.tagName + '</td>';
                html += '<td>' + context + '</td>';
                var inputId = this.tagName + "|" + contextId;
                html += '<td><input type="text" class="report" id="' + inputId + '" value="' + $(this).text() + '" ></td>';
                html += '</tr>';
            });
            $("#xbrlreport").html(html);

            scope.saveReport = function () {
                var string = (new XMLSerializer()).serializeToString(scope.xmlData);
                window.location.href = 'data:Application/octet-stream;Content-Disposition:attachment;filename=file.xml,' + escape(string);
            };


        }
    });
    mifosX.ng.application.controller('XBRLReportController', ['$scope', 'ResourceFactory', '$location', '$rootScope', mifosX.controllers.XBRLReportController]).run(function ($log) {
        $log.info("XBRLReportController initialized");
    });
}(mifosX.controllers || {}));
