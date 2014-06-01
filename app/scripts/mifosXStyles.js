define(['underscore'], function () {
    var styles = {
        css: [
            'bootstrap.min',
			'bootstrap-ext',
            'bootswatch',
            'font-awesome.min',
            'app',
            'nv.d3',
            'style',
            'chosen.min'
        ]
    };

    require(_.reduce(_.keys(styles), function (list, pluginName) {
        return list.concat(_.map(styles[pluginName], function (stylename) {
            return pluginName + '!styles/' + stylename;
        }));
    }, []));
});
