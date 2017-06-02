(function (module) {
    mifosX.filters = _.extend(module, {
        SearchFilter: function () {
            return function (list, searchText) {
            	var searchRegx = new RegExp(searchText, "i");
                if (searchText == undefined) {
                    return list;
                }
                var result = [];
                for (i = 0; i < list.length; i++) {
                    if (list[i].name.search(searchRegx) != -1 || 
                        list[i].glCode.toString().search(searchRegx) != -1 || list[i].type.value.search(searchRegx) != -1 ) {
                        result.push(list[i]);
                    }
                }
                return result;
            }
        }
    });
    mifosX.ng.application.filter('SearchFilter', [mifosX.filters.SearchFilter]).run(function ($log) {
        $log.info("SearchFilter filter initialized");
    });
}(mifosX.filters || {}));
