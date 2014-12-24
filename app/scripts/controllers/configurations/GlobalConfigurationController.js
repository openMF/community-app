(function (module) {
    mifosX.controllers = _.extend(module, {
        GlobalConfigurationController: function (scope,$rootScope, resourceFactory, location, route) {
            scope.configs = [];
            resourceFactory.configurationResource.get(function (data) {
                for (var i in data.globalConfiguration) {
                    data.globalConfiguration[i].showEditvalue = true;
                    scope.configs.push(data.globalConfiguration[i])
                }
				
                resourceFactory.cacheResource.get(function (data) {
                    for (var i in data) {
                        if (data[i].cacheType && data[i].cacheType.id == 2) {
                            var cache = {};
                            cache.name = 'Is Cache Enabled';
                            cache.enabled = data[i].enabled;
                            cache.showEditvalue = false;
                            scope.configs.push(cache);
                        }
                    }
                });
            });
			

            scope.enable = function (id, name) {
                if (name == 'Is Cache Enabled') {
                    var temp = {};
                    temp.cacheType = 2;
                    resourceFactory.cacheResource.update(temp, function (data) {
                        route.reload();
                    });
                }
                else {
                    var temp = {'enabled': 'true'};
                    resourceFactory.configurationResource.update({'id': id}, temp, function (data) {
                        route.reload();
                    });
                }
            };
            scope.disable = function (id, name) {
                if (name == 'Is Cache Enabled') {
                    var temp = {};
                    temp.cacheType = 1;
                    resourceFactory.cacheResource.update(temp, function (data) {
                        route.reload();
                    });
                }
                else {
                    var temp = {'enabled': 'false'};
                    resourceFactory.configurationResource.update({'id': id}, temp, function (data) {
                        route.reload();
                    });
                }
            };
			
			scope.setDescript = function()
			{
				if(tooltiplang == 'en')
					{
						var descriptions = ['Determine if the maker-checker system will be used.','Determines if file and image uploads will be handled by alternative Amazon S3 cloud storage.',
						'If enabled, reschedules repayments which fall on a non-working day to configured repayment rescheduling rule.','Determine if repayments that occur on holidays will be rescheduled.',
						'Determine if transactions will be permitted on holidays.','Determine if transactions will be permitted on non-working days, such as weekends.',
						'Determines whether the Code Value Name or the Code Value ID will be stored in the generated data table.','Defined in terms of days. Defines how many days overdue before an overdue penalty will be charged.',
						'Determine if passwords expire and whether or not users will be required to reset their passwords after a certain number of days.','Determines whether Moratorium functionality is permitted. If enabled, Moratorium functionality is allowed; if disabled, Moratorium functionality is not allow.',
						'Recommended to be changed only once during start of production. When set as false(default), interest will be posted on the first date of next period. If set as true, interest will be posted on last date of current period. There is no difference in the interest amount posted.',
						'This should be set at the database level before any savings interest is posted. Allowed values 1 - 12 (January - December). Interest posting periods are evaluated based on this configuration.',
						'Determines if caching is enabled in the platform to improve performance.'];
						
							for(var i in scope.configs)
							{
								scope.configs[i].description = descriptions[i];
							}
												
					}//default - English
					else if(tooltiplang == 'fr')
					{
						//add here translated descriptions in array like above
						for(var i in scope.configs)
						{
							scope.configs[i].description = 'Need a French translation'; // here get description for configs[i] from array and set it, like above
						}
					}//French
					else if(tooltiplang == 'es')
					{
						//add here translated descriptions in array like above
						for(var i in scope.configs)
						{
							scope.configs[i].description = 'Need a Spanish translation'; // here get description for configs[i] from array and set it, like above
						}
					}//Espanyol
					else if(tooltiplang == 'pt')
					{
						//add here translated descriptions in array like above
						for(var i in scope.configs)
						{
							scope.configs[i].description = 'Need a Portugese translation'; // here get description for configs[i] from array and set it, like above
						}
					}//Portugese
					else if(tooltiplang == 'zh_CN')
					{	
						//add here translated descriptions in array like above
						for(var i in scope.configs)
						{
							scope.configs[i].description = 'Need a Chinese translation'; // // here get description for configs[i] from array and set it, like above
						}
					}//Chinese
					else if(tooltiplang == 'hi')
					{
						//add here translated descriptions in array like above
						for(var i in scope.configs)
						{
							scope.configs[i].description = 'Need a Hindi translation'; // // here get description for configs[i] from array and set it, like above
						}
					}//Hindi
					else if(tooltiplang == 'ka')
					{
						//add here translated descriptions in array like above
						for(var i in scope.configs)
						{
							scope.configs[i].description = 'Need a Georgian translation'; // here get description for configs[i] from array and set it, like above
						}
					}//Georgian
					
			
			};

        }
    });
    mifosX.ng.application.controller('GlobalConfigurationController', ['$scope','$rootScope', 'ResourceFactory', '$location', '$route', mifosX.controllers.GlobalConfigurationController]).run(function ($log) {
        $log.info("GlobalConfigurationController initialized");
    });
}(mifosX.controllers || {}));
