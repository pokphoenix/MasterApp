angular.module('wpIonic.services', [])

/**
 * A simple example service that returns some data.
 */
    .factory('DataLoader', function ($http, $ionicHistory,popupService,$ionicLoading) {

        function postData(url,data) {
            $http.post(url,data).then(function (response) {
                //console.log("response : "+JSON.stringify(response));
                $ionicLoading.hide();
                if(response.data.status == "success") {
                    $ionicHistory.goBack();
                }else{
                    popupService.alert(JSON.stringify(response.data.message));
                }
            }, function (response) {
                $ionicLoading.hide();
                popupService.alert(JSON.stringify(response));
            });
        }

        return {
            get: function (url) {
                // Simple index lookup
                return $http.get(url);
            },
            post: function (url,data) {
                return postData(url,data);
            }
        }
    })

    .factory('SemiFunction', function ($http, $localstorage,$rootScope,$state,Sha1) {
        function checkNull(val) {
            return angular.isUndefined(val) || val === null || val === 'undefined'
        }



        return {
            checkNull : function (val) {
                // Simple index lookup
                return checkNull(val);
            }


        }
    })

    .factory('Sha1', function () {
        function encode(val) {
            var shaObj = new jsSHA("SHA-1", "TEXT");
            shaObj.update(val);
            var hash = shaObj.getHash("HEX");
            //console.log('Sha1 : '+hash);
            return hash
        }

        function genToken(ts) {
            return  encode(ts+","+encode(_hashkey+","+ts)) ;
        }


        return {
            encode : function (val) {
                // Simple index lookup
                return encode(val);
            },
            genToken : function(val){
                return genToken(val);
            }
        }
    })

    .factory('LoginRedirect', function ($http, $localstorage,$rootScope,$state,popupService,Sha1,$ionicLoading) {




        function postData(url,data) {

            //var shaObj = new jsSHA("SHA-1", "TEXT");
            //shaObj.setHMACKey("DWg7V6eAdnXXiBmgnYsUiGhrOs1m8rxt", "TEXT");
            //shaObj.update(data);
            //var hmac = shaObj.getHMAC("HEX");
            //
            //console.log('hash : ',hmac);



            //console.log('data.password : '+data.password);


            data.password = Sha1.encode(data.password) ;
            data.timestamp = Math.round((new Date()).getTime() / 1000);
            data.token  = Sha1.genToken(data.timestamp) ;

            //console.log('time stamp : ', data.timestamp ) ;
            //console.log('token : ', data.token ) ;

            $http.post(url,data).then(function (response) {
                //console.log("[in service] response : "+response);
                //console.log("[in service] redirect url : "+$rootScope.redirectUrl);
                $ionicLoading.hide();
                $localstorage.set('userEmail',data.email);
                data.password = '' ;
                if(response.data.status == "success") {
                    //console.log('[in service] login success!!!');
                    //console.log('[in service] data.fullName : '+response.data.message.fullName);
                    $localstorage.set('loginStatus',true);
                    $localstorage.set('userName',response.data.message.fullName);
                    $localstorage.set('Isfacebook',data.Isfacebook);
                    (($rootScope.redirectUrl!=$rootScope.semi.appHome) && (!angular.isUndefined($rootScope.redirectUrl)) && ($rootScope.redirectUrl !== null)  )  ? $state.go($rootScope.redirectUrl) :  $state.go('app.promotions');
                }else{
                    popupService.alert(JSON.stringify(response.data.message));
                }
            }, function (response) {
                popupService.alert(JSON.stringify(response));
                $ionicLoading.hide();
            });
        }
        return {
            post: function (url,data) {
                // Simple index lookup
                return postData(url,data);
            }
        }
    })


    .service('ModalService', function($ionicModal, $rootScope) {


        var init = function(tpl, $scope) {

            var promise;
            $scope = $scope || $rootScope.$new();

            promise = $ionicModal.fromTemplateUrl(tpl, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                return modal;
            });

            $scope.openModal = function() {
                $scope.modal.show();
            };
            $scope.closeModal = function() {
                $scope.modal.hide();
            };
            $scope.$on('$destroy', function() {
                $scope.modal.remove();
            });

            return promise;
        }

        return {
            init: init
        }

    })

    .factory('popupService', function ($ionicPopup) {

        function show(param, scope) {
            var show = $ionicPopup.show({
                title: param.title, // String. The title of the popup.
                cssClass: param.cssClass, // String, The custom CSS class name
                subTitle: param.subTitle, // String (optional). The sub-title of the popup.
                template: param.template, // String (optional). The html template to place in the popup body.
                templateUrl: param.templateUrl, // String (optional). The URL of an html template to place in the popup   body.
                scope: scope, // Scope (optional). A scope to link to the popup content.
                buttons: [{ // Array[Object] (optional). Buttons to place in the popup footer.
                    text: param.buttons.cancelText,
                    type: param.buttons.cancelType,
                    onTap: function(e) {
                        return false;
                    }
                }, {
                    text: param.buttons.okText,
                    type: param.buttons.okType,
                    onTap: function(e) {
                        // Returning a value will cause the promise to resolve with the given value.
                        return scope.data.value;
                    }
                }]
            });
            return show;
        }

        function alert(param){
            var alertPopup = $ionicPopup.alert({
                template: param
            });
            return alertPopup;
        }

        return{
            show: function (url,data) {
                return show(url,data);
            },
            alert: function (param) {
                return alert(param);
            }
        };

    })



    .factory('DataPost', function ($http) {

        var headers = {
            'Access-Control-Allow-Origin' : '*',
            'Access-Control-Allow-Methods' : 'POST, GET, OPTIONS, PUT',
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        };

        return {
            post: function (url, data) {
                return $http.post(url, data,{ headers: headers });
            }
        }
    })

    .factory('Bookmark', function (CacheFactory) {

        if (!CacheFactory.get('bookmarkCache')) {
            CacheFactory.createCache('bookmarkCache');
        }

        var bookmarkCache = CacheFactory.get('bookmarkCache');

        return {
            set: function (id) {
                bookmarkCache.put(id, 'bookmarked');
            },
            get: function (id) {
                bookmarkCache.get(id);
                console.log(id);
            },
            check: function (id) {
                var keys = bookmarkCache.keys();
                var index = keys.indexOf(id);
                if (index >= 0) {
                    return true;
                } else {
                    return false;
                }
            },
            remove: function (id) {
                bookmarkCache.remove(id);
            }
        }

    })
    .service('LoginService', function ($q) {
        return {
            loginUser: function (name, pw) {
                var deferred = $q.defer();
                var promise = deferred.promise;

                if (name == 'user' && pw == 'secret') {
                    deferred.resolve('Welcome ' + name + '!');
                } else {
                    deferred.reject('Wrong credentials.');
                }
                promise.success = function (fn) {
                    promise.then(fn);
                    return promise;
                };
                promise.error = function (fn) {
                    promise.then(null, fn);
                    return promise;
                };
                return promise;
            }
        }
    })

    .service('appServices', function appServices($q) {
        // Wrap the barcode scanner in a service so that it can be shared easily.
        this.scanBarcode = function() {
            // The plugin operates asynchronously so a promise
            // must be used to display the results correctly.
            var deferred = $q.defer();
            try {
                cordova.plugins.barcodeScanner.scan(
                    function (result) {  // success
                        deferred.resolve({'error':false, 'result': result});
                    },
                    function (error) {  // failure
                        deferred.resolve({'error':true, 'result': error.toString()});
                    }
                );
            }
            catch (exc) {
                deferred.resolve({'error':true, 'result': 'exception: ' + exc.toString()});
            }
            return deferred.promise;
        };
    })

    .factory('$localstorage', ['$window', function ($window) {
        return {
            set: function (key, value) {
                $window.localStorage[key] = value;
            },
            get: function (key, defaultValue) {
                return $window.localStorage[key] || defaultValue;
            },
            setObject: function (key, value) {
                $window.localStorage[key] = JSON.stringify(value);
            },
            getObject: function (key) {
                return JSON.parse($window.localStorage[key] || '{}');
            }
        }
    }])

    .service('UserService', function() {
        // For the purpose of this example I will store user data on ionic local storage but you should save it on a database
        var setUser = function(user_data) {
            window.localStorage.starter_facebook_user = JSON.stringify(user_data);
        };

        var getUser = function(){
            return JSON.parse(window.localStorage.starter_facebook_user || '{}');
        };

        return {
            getUser: getUser,
            setUser: setUser
        };
    })
;
