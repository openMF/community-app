define(['underscore'], function () {
    var styles = {
        css: [
            'bootstrap.min.css',
            'bootstrap-ext.css',
            'bootswatch.css',
            'font-awesome.min.css',
            'app.css',
            'nv.d3.css',
            'style.css',
            'chosen.min.css'
        ]
    };

    require(_.reduce(_.keys(styles), function (list, pluginName) {
        return list.concat(_.map(styles[pluginName], function (stylename) {
            return pluginName + '!styles/' + stylename;
        }));
    }, []));
});
