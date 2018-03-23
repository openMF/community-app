(function (module) {
    mifosX.services = _.extend(module, {
        PaginatorService: function (scope, httpService) {

            this.paginate = function (fetchFunction, pageSize) {
                var paginator = {
                    hasNextVar: false,
                    next: function () {
                        if (this.hasNextVar) {
                            this.currentOffset += pageSize;
                            this._load();
                        }
                    },
                    _load: function () {
                        var self = this;
                        fetchFunction(this.currentOffset, pageSize, function (items) {
                            self.currentPageItems = items.pageItems;
                            self.hasNextVar = items.pageItems.length === pageSize;
                        });
                    },
                    hasNext: function () {
                        return this.hasNextVar;
                    },
                    previous: function () {
                        if (this.hasPrevious()) {
                            this.currentOffset -= pageSize;
                            this._load();
                        }
                    },
                    hasPrevious: function () {
                        return this.currentOffset !== 0;
                    },
                    currentPageItems: [],
                    currentOffset: 0
                };
                // Load the first page
                paginator._load();
                return paginator;
            };

        }
    });
    mifosX.ng.services.service('PaginatorService', ['$rootScope', 'HttpService', mifosX.services.PaginatorService]).run(function ($log) {
        $log.info("PaginatorService initialized");
    });
}(mifosX.services || {}));
