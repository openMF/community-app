angular.module('configurations', [])
    .constant('API_VERSION', '/mifosng-provider/api/v1')
    .constant('IDLE_DURATION', 30 * 60)
    .constant('WARN_DURATION', 10)
    .constant('KEEPALIVE_INTERVAL', 15 * 60);
