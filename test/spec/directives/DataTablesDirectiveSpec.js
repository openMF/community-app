describe("dataTablesDirective", function() {
  var itemsWatcherFn;
  beforeEach(function() {
    $ = jQuery = jasmine.createSpy('jQuery');
    scope = {
      $eval: jasmine.createSpy("$scope.$eval").andCallFake(function(expr) {
        if (expr === "test_options") return {test_option: 'test_value'};
      }),
      $evalAsync: jasmine.createSpy('$scope.$evalAsync').andCallFake(function(callback) {
        callback();
      }),
      $watch: jasmine.createSpy("scope.$watch").andCallFake(function(expr, callback) {
        if (expr === "test_items") itemsWatcherFn = callback;
      })
    };
    linkFunction = mifosX.directives.dataTableDirective();

    linkFunction(scope, "test-element", {mfDataTable: "test_options", mfDataTableItems: "test_items"});
  });

  it("should watch the expression representing the data items in the table", function() {
    expect(scope.$watch).toHaveBeenCalledWith("test_items", jasmine.any(Function));
  });
  it("should not render the table if the items number is not defined", function() {
    itemsWatcherFn(undefined);

    expect(jQuery).not.toHaveBeenCalled();
  });
  it("should not render the table if the items have not changed", function() {
    itemsWatcherFn([1, 2], [1, 2]);

    expect(jQuery).not.toHaveBeenCalled();
  });
  it("should not render the table if the items number is not greater than 0", function() {
    itemsWatcherFn([]);

    expect(jQuery).not.toHaveBeenCalled();
  });
  it("should render the table if the items number is greater than 0 and they have changed", function() {
    var jQueryStub = {
      dataTable: jasmine.createSpy('$.dataTable()')
    };
    jQuery.andReturn(jQueryStub);

    itemsWatcherFn([1, 2, 3], [4, 5, 6]);

    expect(jQuery).toHaveBeenCalledWith('test-element');
    expect(jQueryStub.dataTable).toHaveBeenCalledWith({
      bDeferRender: true,
      bJQueryUI: true,
      bPaginate: true,
      test_option: 'test_value'
    });
  });  
});