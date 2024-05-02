(function (module) {
    mifosX.controllers = _.extend(module, {
        XBRLReportController: function (scope, resourceFactory, location, $rootScope) {

            scope.xmlData = $rootScope.xmlData;
            var table = $("<table width='100%' border='1'></table>");
            var header = $("<tr></tr>").append("<th>Title</th>", "<th>Dimension</th>", "<th>Value</th>");
            table.append(header);
            
            $(scope.xmlData).find("*[contextRef]").each(function (i) {
                var contextId = $(this).attr("contextRef");
                var context = $(scope.xmlData).find("#" + contextId).find("scenario").text();
                
                var row = $("<tr></tr>");
                row.append('<td>' + this.tagName + '</td>');
                row.append('<td>' + context + '</td>');

                var inputId = this.tagName + "|" + contextId;
                var input = $('<td><input type="text" class="report"></td>');
                input.find('input').attr('id', inputId).val($(this).text());
                row.append(input);

                table.append(row);
            });
            
            $("#xbrlreport").empty().append(table);

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