define(['underscore'], function() {
  var styles = {
    css: [
      'skeleton/base',
      'skeleton/skeleton',
      'skeleton/layout',
      'data-tables/css/jquery.dataTables',
      'jquery-ui/redmond/jquery-ui-1.10.3.custom'
    ],
    less: [
      'mifosX'
    ]
  };

  require(_.reduce(_.keys(styles), function(list, pluginName) {
    return list.concat(_.map(styles[pluginName], function(stylename) { return pluginName + "!styles/" + stylename; }));
  }, []));
});
