define(['underscore'], function() {
  var styles = {
    css: [
      'bootstrap-combined.min',
      'bootswatch',
      'font-awesome.min',
      'app',
      'nv.d3',
      'jquery-ui/redmond/jquery-ui-1.10.3.custom',
      'angularjs-file-upload/war/common'
    ],
    less: [
      'mifosX'
    ]
  };

  require(_.reduce(_.keys(styles), function(list, pluginName) {
    return list.concat(_.map(styles[pluginName], function(stylename) { return pluginName + "!styles/" + stylename; }));
  }, []));
});
