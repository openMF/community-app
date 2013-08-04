describe("dataTablesDirective", function() {
  var itemsWatcherFn, jQueryStub, dataTableObj;
  beforeEach(function() {
    dataTableObj = jasmine.createSpyObj('$.dataTable()', ['fnClearTable', 'fnAddData']);
    jQueryStub = {
      dataTable: jasmine.createSpy('$.dataTable()').andReturn(dataTableObj)
    };
    $ = jQuery = jasmine.createSpy('jQuery').andReturn(jQueryStub);

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

    linkFunction(scope, "test-element", {
      mfDataTable: "test_options",
      mfDataTableItems: "test_items",
      mfDataTableColumns: "test_col1,test_col2"
    });
  });

  it("should set up the dataTable with the correct options", function() {
    expect(jQuery).toHaveBeenCalledWith('test-element');
    expect(jQueryStub.dataTable).toHaveBeenCalledWith({
      bDeferRender: true,
      bJQueryUI: true,
      bPaginate: true,
      aoColumns: [{mData: 'test_col1'}, {mData: 'test_col2'}],
      bRetrieve: true,
      test_option: 'test_value'
    });
  });
  it("should watch the expression representing the data items in the table", function() {
    expect(scope.$watch).toHaveBeenCalledWith("test_items", jasmine.any(Function), true);
  });

  describe("Table data population", function() {
    it("should not add table data if the items number is not defined", function() {
      itemsWatcherFn(undefined);

      expect(dataTableObj.fnAddData).not.toHaveBeenCalled();
    });
    it("should not add table data if the items have not changed", function() {
      itemsWatcherFn([1, 2], [1, 2]);

      expect(dataTableObj.fnAddData).not.toHaveBeenCalled();
    });
    it("should not add table data if the items number is not greater than 0", function() {
      itemsWatcherFn([]);

      expect(dataTableObj.fnAddData).not.toHaveBeenCalled();
    });
    it("should add table data if the items number is greater than 0 and they have changed", function() {
      itemsWatcherFn([1, 2, 3], [4, 5, 6]);

      expect(dataTableObj.fnClearTable).toHaveBeenCalled();
      expect(dataTableObj.fnAddData).toHaveBeenCalledWith([1, 2, 3]);
    });
  });
});