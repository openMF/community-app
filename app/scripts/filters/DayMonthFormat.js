(function (module) {
    mifosX.filters = _.extend(module, {
        DayMonthFormat: function () {
            return function (input) {
                if (input) {
                    var MM;
                    var input0 = Number(input[0]);
                    var input1 = Number(input[1]);
                    var input2 = input[2] || '';
                        switch (input0) {
                            case 1:
                                MM = 'January';
                                break;
                            case 2:
                                MM = 'February';
                                break;
                            case 3:
                                MM = 'March';
                                break;
                            case 4:
                                MM = 'April';
                                break;
                            case 5:
                                MM = 'May';
                                break;
                            case 6:
                                MM = 'June';
                                break;
                            case 7:
                                MM = 'July';
                                break;
                            case 8:
                                MM = 'August';
                                break;
                            case 9:
                                MM = 'September';
                                break;
                            case 10:
                                MM = 'October';
                                break;
                            case 11:
                                MM = 'November';
                                break;
                            case 12:
                                MM = 'December';
                                break;
                        }
                        return input1 + ' ' + MM + ' ' + input2;
                    }
                    
                };
        }
    });
    mifosX.ng.application.filter('DayMonthFormat', ['dateFilter', mifosX.filters.DayMonthFormat]).run(function ($log) {
        $log.info("DayMonthFormat filter initialized");
    });
}(mifosX.filters || {}));
