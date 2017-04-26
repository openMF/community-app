(function (module) {
    mifosX.filters = _.extend(module, {
        AddUpTotalFor: function () {
            return function (data, key, conditionfield, conditionvalue) {
                if (typeof (data) === 'undefined' && typeof (key) === 'undefined') {
                    return 0;
                }
                if (data) {
                    var sum = 0;
                    for (var i = 0; i < data.length; i++) {
                        if (data[i][key]) {
                            if (conditionfield) {
                                condFields = conditionfield.split(".");
                                if (condFields.length == 1) {
                                    if (data[i][condFields[0]] == conditionvalue) {
                                        sum = sum + data[i][key];    
                                    }
                                } else if (condFields.length == 2) {
                                    if (data[i][condFields[0]][condFields[1]] == conditionvalue) {
                                        sum = sum + data[i][key];
                                    }
                                } else  if (condFields.length == 3) {
                                    if (data[i][condFields[0]][condFields[1]][condFields[2]] == conditionvalue) {
                                        sum = sum + data[i][key];    
                                    }
                                }
                            } else {
                                sum = sum + data[i][key];
                            }
                        }
                    }
                    return sum;
                } else {
                    return 0;
                }
            }
        }
    });
    mifosX.ng.application.filter('AddUpTotalFor', [mifosX.filters.AddUpTotalFor]).run(function ($log) {
        $log.info("AddUpTotalFor filter initialized");
    });
}(mifosX.filters || {}));
