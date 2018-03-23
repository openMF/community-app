define(['underscore'], function () {
    var styles = {
        css: [
            'fontawesome.8f41798f.css',
            'styles.be582001.css'
            ]
    };

    require(_.reduce(_.keys(styles), function (list, pluginName) {
        return list.concat(_.map(styles[pluginName], function (stylename) {
            return pluginName + '!styles/' + stylename;
        }));
    }, []));
});
