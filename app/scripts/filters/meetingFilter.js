(function (module) {
    mifosX.filters = _.extend(module, {
        meetingFilter: function ($filter) {
                  return function(collection, keyname) {
                    var output = [],
                    keys = [];
                    angular.forEach(collection, function(item) {
                        var date = item[keyname];
                        var frequency = item.frequency.value;
                        var key = date[0].toString() +  date[1].toString() + date[2].toString() + frequency;
                        if(keys.indexOf(key) === -1) {
                            keys.push(key);
                            output.push(item);
                        }
                    });
            return output;
          }
      }
});
    mifosX.ng.application.filter('meetingFilter', ['$filter', mifosX.filters.meetingFilter]).run(function ($log) {
        $log.info("Meeting filter initialized");
    });
}(mifosX.filters || {}));
