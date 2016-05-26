// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'ionic.service.core', 'wpIonic.controllers', 'wpIonic.services', 'wpIonic.filters', 'ngCordova', 'angular-cache', 'semi.directives', 'ngMessages', 'starter.services'])

    .run(function ($ionicPlatform, $rootScope,$state,$cordovaStatusbar) {

        var bReal = true;
        if (bReal) {
            $rootScope.semi = {
                facebookNoEmail: true,
                regexYoutube: true
            };
        } else {
            $rootScope.semi = {
                facebookNoEmail: false,
                regexYoutube: false
            };
        }

        window._hashkey = "DWg7V6eAdnXXiBmgnYsUiGhrOs1m8rxt";

        window._wpurl = 'http://masterpiececlinic.com/wp-json/wp/v2/';

        window._basePath = 'http://semsame.com/masterpos/public/';
        //window._basePath = "http://192.168.1.20/masterpos/public/" ;

        $rootScope.semi.appUserLogin = _basePath + "app-user/login";
        $rootScope.semi.appUserSingUp = _basePath + "app-user/store";
        $rootScope.semi.appUserUpdate = _basePath + "app-user/update";
        $rootScope.semi.appUserChangePass = _basePath + "app-user/change-pass";
        $rootScope.semi.appUserForgotPass = _basePath + "app-user/forgot-pass";

        $rootScope.semi.appQrcodeScore = _basePath + "app-qrcode/score";

        $rootScope.semi.appHome = "tab.home";


        $ionicPlatform.ready(function () {
            // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
            // for form inputs)
            //if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
            //  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            //  cordova.plugins.Keyboard.disableScroll(true);
            //
            //}


            $ionicPlatform.registerBackButtonAction(function (event) {
                if($state.current.name=="tab.home"){
                    navigator.app.exitApp(); //<-- remove this line to disable the exit
                }else{
                    navigator.app.backHistory();
                }
            }, 100);

            $cordovaStatusbar.overlaysWebView(false);

            if (ionic.Platform.isAndroid()) {
                //$cordovaStatusbar.hide();
                //$cordovaStatusbar.overlaysWebView(false);
                //$cordovaStatusbar.backgroundColorByHexString("#FF0000");

            } else if (ionic.Platform.isIOS()) {
                //StatusBar.styleLightContent();
            }
            document.addEventListener("deviceready", onDeviceReady, false);
            function onDeviceReady() {
                //ionic.Platform.fullScreen();
                if(window.StatusBar) {
                    // org.apache.cordova.statusbar required
                    StatusBar.styleDefault();
                }
                screen.lockOrientation('portrait');
            }

        });
    })

    .config(function ($stateProvider, $urlRouterProvider, $ionicConfigProvider, CacheFactoryProvider) {


        $ionicConfigProvider.backButton.text('Go Back').icon('ion-chevron-left');
        $ionicConfigProvider.navBar.alignTitle('center'); //Places them at the bottom for all OS
        $ionicConfigProvider.tabs.position('bottom'); //Places them at the bottom for all OS
        $ionicConfigProvider.tabs.style('standard'); //Makes them all look the same across all OS

        angular.extend(CacheFactoryProvider.defaults, {
            'storageMode': 'localStorage',
            'capacity': 10,
            'maxAge': 10800000,
            'deleteOnExpire': 'aggressive',
            'recycleFreq': 10000
        });

        // Native scrolling
        if (ionic.Platform.isAndroid()) {
            $ionicConfigProvider.scrolling.jsScrolling(false);
        }

        // Ionic uses AngularUI Router which uses the concept of states
        // Learn more here: https://github.com/angular-ui/ui-router
        // Set up the various states which the app can be in.
        // Each state's controller can be found in controllers.js
        $stateProvider

            // setup an abstract state for the tabs directive
            .state('tab', {
                url: '/tab',
                abstract: true,
                templateUrl: 'templates/tabs.html',
                controller: 'TabCtrl'
            })

            // Each tab has its own nav history stack:

            .state('tab.home', {
                url: '/home',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/home.html',
                        controller: 'HomeCtrl'
                    }
                }
            })

            .state('login', {
                url: '/',
                templateUrl: 'templates/login/login.html',
                controller: 'LoginCtrl',
                cache: false
            })
            .state('signUp', {
                url: '/signup',
                templateUrl: 'templates/login/signup.html',
                controller: 'SignUpCtrl',
                cache: false
            })

            .state('fbNoEmail', {
                url: '/fbnoemail',
                templateUrl: 'templates/login/signup.html',
                controller: 'FBnoEmailCtrl',
                cache: false
            })

            .state('tab.myaccounts', {
                url: "/myaccounts",
                templateUrl: "templates/login/myacounts.html",
                controller: 'MyAccountCtrl',
                cache: false
            })


            .state('tab.editprofile', {
                url: "/editprofile",
                views: {
                    'tab-home': {
                        templateUrl: "templates/login/edit-profile.html",
                        controller: 'EditProfileCtrl'
                    }
                },
                cache: false
            })
            .state('tab.changepass', {
                url: "/changepass",
                views: {
                    'tab-home': {
                        templateUrl: "templates/login/change-pass.html",
                        controller: 'ChangePassCtrl'
                    }
                },
                cache: false
            })

            .state('tab.reviews', {
                url: '/reviews',
                params: {category: 'review'},
                views: {
                    'tab-home': {
                        templateUrl: 'templates/list-views.html',
                        controller: 'ListViewCtrl'
                    }
                }
            })
            .state('tab.promotions', {
                url: '/promotions',
                //params: {category: 'promotion'},
                params: {postId: 12709,pageStatus:1,title:'promotion'},
                views: {
                    'tab-home': {
                        templateUrl: 'templates/promotion.html',
                        controller: 'ViewsCtrl'
                    }
                }
            })



            .state('tab.news', {
                url: '/news',
                params: {category: 'news'},
                views: {
                    'tab-home': {
                        templateUrl: 'templates/list-views.html',
                        controller: 'ListViewCtrl'
                    }
                }
            })

            .state('tab.views', {
                url: "/views/:postId",
                views: {
                    'tab-home': {
                        templateUrl: "templates/views.html",
                        controller: 'ViewsCtrl'
                    }
                },
                cache: false
            })
            .state('tab.pages', {
                url: "/pages/:postId/:pageStatus",
                views: {
                    'tab-home': {
                        templateUrl: "templates/views.html",
                        controller: 'ViewsCtrl'
                    }
                },
                cache: false
            })


            .state('tab.stamps', {
                url: '/stamps',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/stamps.html',
                        controller: 'StampCtrl'
                    }
                },
                cache: false
            })


            .state('tab.chats', {
                url: '/chats',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/tab-chats.html',
                        controller: 'ChatsCtrl'
                    }
                }
            })
            .state('tab.chat-detail', {
                url: '/chats/:chatId',
                views: {
                    'tab-chats': {
                        templateUrl: 'templates/chat-detail.html',
                        controller: 'ChatDetailCtrl'
                    }
                }
            })

            .state('tab.testpromotion', {
                url: '/testpromotion',
                params: {postId: 5790,pageStatus:1},
                views: {
                    'tab-about': {
                        templateUrl: 'templates/promotion.html',
                        //controller: 'ViewsCtrl'
                    }
                }
            })


            .state('tab.about', {
                url: '/about',
                params: {postId: 1195,pageStatus:1},
                views: {
                    'tab-about': {
                        templateUrl: 'templates/about.html',
                        //controller: 'ViewsCtrl'
                    }
                }
            })

            .state('tab.packages', {
                url: "/packages",
                views: {
                    'tab-home': {
                        templateUrl: "templates/list-item.html",
                        controller: 'PackageCtrl'
                    }
                }
            })
            .state('tab.services', {
                url: "/services",
                views: {
                    'tab-home': {
                        templateUrl: "templates/list-item.html",
                        controller: 'ServiceCtrl'
                    }
                }
            })

            .state('tab.surgerys', {
                url: "/surgerys",
                views: {
                    'tab-home': {
                        templateUrl: "templates/list-item.html",
                        controller: 'SurgerysCtrl'
                    }
                }
            })
            .state('tab.surbodys', {
                url: "/sur-bodys",
                views: {
                    'tab-home': {
                        templateUrl: "templates/list-item.html",
                        controller: 'SurBodyCtrl'
                    }
                }
            })
            .state('tab.sureyes', {
                url: "/sur-eyes",
                views: {
                    'tab-home': {
                        templateUrl: "templates/list-item.html",
                        controller: 'SurEyeCtrl'
                    }
                }
            })
            .state('tab.surfaces', {
                url: "/sur-faces",
                views: {
                    'tab-home': {
                        templateUrl: "templates/list-item.html",
                        controller: 'SurFaceCtrl'
                    }
                }
            })



            .state('tab.cosmetics', {
                url: "/cosmetics",
                views: {
                    'tab-home': {
                        templateUrl: "templates/list-item.html",
                        controller: 'CosmeticsCtrl'
                    }
                }
            })

            .state('tab.lasers', {
                url: "/lasers",
                views: {
                    'tab-home': {
                        templateUrl: "templates/list-item.html",
                        controller: 'LasersCtrl'
                    }
                }
            })

            .state('tab.facialDesign', {
                url: "/facialDesign",
                views: {
                    'tab-home': {
                        templateUrl: "templates/list-item.html",
                        controller: 'FacialDesignCtrl'
                    }
                }
            })

            .state('tab.antiAging', {
                url: "/antiAging",
                views: {
                    'tab-home': {
                        templateUrl: "templates/list-item.html",
                        controller: 'AntiAgingCtrl'
                    }
                }
            })

            .state('tab.bodys', {
                url: "/bodys",
                views: {
                    'tab-home': {
                        templateUrl: "templates/list-item.html",
                        controller: 'BodysCtrl'
                    }
                }
            })


            .state('tab.branch', {
                url: '/branch',
                views: {
                    'tab-branch': {
                        templateUrl: 'templates/branch.html',
                        controller: 'BranchCtrl'
                    }
                }
            })



            .state('tab.account', {
                url: '/account',
                views: {
                    'tab-home': {
                        templateUrl: 'templates/login/myacounts.html',
                        controller: 'MyAccountCtrl'
                    }
                },
                cache: false
            });

        // if none of the above states are matched, use this as the fallback
        $urlRouterProvider.otherwise('/');

    });
