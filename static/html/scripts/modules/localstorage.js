angular.module('LocalStorageModule', [])
    // You should set a prefix to avoid overwriting any local storage variables from the rest of your app
    // e.g. angularLocalStorage.constant('prefix', 'youAppName');
    .value('prefix', 'ls')
    // Cookie options (usually in case of fallback)
    // expiry = Number of days before cookies expire // 0 = Does not expire
    // path = The web path the cookie represents
    .constant('cookie', {
        expiry: 30,
        path: '/'
    })

    .constant('notify', {
        setItem: true,
        removeItem: false
    })

    .service('localStorageService', ['$rootScope', 'prefix', 'cookie', 'notify', function ($rootScope, prefix, cookie, notify) {
        // If there is a prefix set in the config lets use that with an appended period for readability
        //var prefix = angularLocalStorage.constant;
        if (prefix.substr(-1) !== '.')
            prefix = !!prefix ? prefix + '.' : '';

        return {
            // Checks the browser to see if local storage is supported
            browserSupportsLocalStorage: function () {
                try {
                    return ('localStorage' in window && window['localStorage'] !== null);
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return false;
                }
            },

            // Directly adds a value to local storage
            // If local storage is not available in the browser use cookies
            // Example use: localStorageService.addToLocalStorage('library','angular');
            addToLocalStorage: function (key, value) {
                // If this browser does not support local storage use cookies
                if (!this.browserSupportsLocalStorage()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
                    if (notify.setItem) {
                        $rootScope.$broadcast('LocalStorageModule.notification.setitem', {
                            key: key,
                            newvalue: value,
                            storageType: 'cookie'
                        });
                    }
                    return this.addToCookies(key, value);
                }

                // Let's convert undefined values to null to get the value consistent
                if (typeof value == "undefined") {
                    value = null;
                }

                try {
                    if (angular.isObject(value) || angular.isArray(value))
                        value = angular.toJson(value);
                    localStorage.setItem(prefix + key, value);
                    if (notify.setItem) {
                        $rootScope.$broadcast('LocalStorageModule.notification.setitem', {
                            key: key,
                            newvalue: value,
                            storageType: 'localStorage'
                        });
                    }
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return this.addToCookies(key, value);
                }
                return true;
            },

            // Directly get a value from local storage
            // Example use: localStorageService.getFromLocalStorage('library'); returns 'angular'
            getFromLocalStorage: function (key) {
                if (!this.browserSupportsLocalStorage()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
                    return this.getFromCookies(key);
                }

                var item = localStorage.getItem(prefix + key);
                // angular.toJson will convert null to 'null', so a proper conversion is needed
                // FIXME not a perfect solution, since a valid 'null' string can't be stored
                if (!item || item === 'null') return null;

                if (item.charAt(0) === "{" || item.charAt(0) === "[") {
                    return angular.fromJson(item);
                }
                return item;
            },

            // Remove an item from local storage
            // Example use: localStorageService.removeFromLocalStorage('library'); removes the key/value pair of library='angular'
            removeFromLocalStorage: function (key) {
                if (!this.browserSupportsLocalStorage()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
                    if (notify.removeItem) {
                        $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {
                            key: key,
                            storageType: 'cookie'
                        });
                    }
                    return this.removeFromCookies(key);
                }

                try {
                    localStorage.removeItem(prefix + key);
                    if (notify.removeItem) {
                        $rootScope.$broadcast('LocalStorageModule.notification.removeitem', {
                            key: key,
                            storageType: 'localStorage'
                        });
                    }
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return this.removeFromCookies(key);
                }
                return true;
            },

            // Return array of keys for local storage
            // Example use: var keys = localStorageService.getKeysForLocalStorage()
            getKeysFromLocalStorage: function () {
                if (!this.browserSupportsLocalStorage()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
                    return false;
                }

                var prefixLength = prefix.length;
                var keys = [];
                for (var key in localStorage) {
                    // Only return keys that are for this app
                    if (key.substr(0, prefixLength) === prefix) {
                        try {
                            keys.push(key.substr(prefixLength));
                        } catch (e) {
                            $rootScope.$broadcast('LocalStorageModule.notification.error', e.Description);
                            return [];
                        }
                    }
                }
                return keys;
            },

            // Remove all data for this app from local storage
            // Example use: localStorageService.clearAllFromLocalStorage();
            // Should be used mostly for development purposes
            clearAllFromLocalStorage: function () {
                if (!this.browserSupportsLocalStorage()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.warning', 'LOCAL_STORAGE_NOT_SUPPORTED');
                    return this.clearAllFromCookies();
                }

                var prefixLength = prefix.length;

                for (var key in localStorage) {
                    // Only remove items that are for this app
                    if (key.substr(0, prefixLength) === prefix) {
                        try {
                            this.removeFromLocalStorage(key.substr(prefixLength));
                        } catch (e) {
                            $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                            return clearAllFromCookies();
                        }
                    }
                }
                return true;
            },

            // Checks the browser to see if cookies are supported
            browserSupportsCookies: function () {
                try {
                    return navigator.cookieEnabled ||
                        ("cookie" in document && (document.cookie.length > 0 ||
                        (document.cookie = "test").indexOf.call(document.cookie, "test") > -1));
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return false;
                }
            },

            // Directly adds a value to cookies
            // Typically used as a fallback is local storage is not available in the browser
            // Example use: localStorageService.addToCookies('library','angular');
            addToCookies: function (key, value) {
                if (typeof value == "undefined")
                    return false;

                if (!this.browserSupportsCookies()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
                    return false;
                }

                try {
                    var expiry = '', expiryDate = new Date();
                    if (value === null) {
                        // Mark that the cookie has expired one day ago
                        expiryDate.setTime(expiryDate.getTime() + (-1 * 24 * 60 * 60 * 1000));
                        expiry = "; expires=" + expiryDate.toGMTString();
                        value = '';
                    } else if (cookie.expiry !== 0) {
                        expiryDate.setTime(expiryDate.getTime() + (cookie.expiry * 24 * 60 * 60 * 1000));
                        expiry = "; expires=" + expiryDate.toGMTString();
                    }
                    if (!!key)
                        document.cookie = prefix + key + "=" + encodeURIComponent(value) + expiry + "; path=" + cookie.path;
                } catch (e) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', e.message);
                    return false;
                }
                return true;
            },

            // Directly get a value from a cookie
            // Example use: localStorageService.getFromCookies('library'); returns 'angular'
            getFromCookies: function (key) {
                if (!this.browserSupportsCookies()) {
                    $rootScope.$broadcast('LocalStorageModule.notification.error', 'COOKIES_NOT_SUPPORTED');
                    return false;
                }

                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    var thisCookie = cookies[i];
                    while (thisCookie.charAt(0) == ' ')
                        thisCookie = thisCookie.substring(1, thisCookie.length);
                    if (thisCookie.indexOf(prefix + key + '=') === 0)
                        return decodeURIComponent(thisCookie.substring(prefix.length + key.length + 1, thisCookie.length));
                }
                return null;
            },

            removeFromCookies: function (key) {
                this.addToCookies(key, null);
            },

            clearAllFromCookies: function () {
                var thisCookie = null, thisKey = null;
                var prefixLength = prefix.length;
                var cookies = document.cookie.split(';');
                for (var i = 0; i < cookies.length; i++) {
                    thisCookie = cookies[i];
                    while (thisCookie.charAt(0) == ' ')
                        thisCookie = thisCookie.substring(1, thisCookie.length);
                    key = thisCookie.substring(prefixLength, thisCookie.indexOf('='));
                    this.removeFromCookies(key);
                }
            }
        }
    }]);