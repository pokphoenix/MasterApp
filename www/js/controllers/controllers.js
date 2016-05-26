angular.module('wpIonic.controllers', [])

    .controller('HomeCtrl', function ($scope) {
        $scope.title = "Masterpiece Clinic" ;
    })

    .controller('TabCtrl', function ($scope,$ionicActionSheet) {
        $scope.actionsheet = [
            {
                "name": "Facebook",
                "link": "https://www.facebook.com/masterpiececlinicbeauty/",
                "children": null,
                "ex_link_mode": true,
                "schemeIos": "fb://",
                "schemeAndroid": "com.facebook.katana",
                "urlIos": "fb://page?id=187216948084405",  //-- 187216948084405 (masterpiece) , 327976304054625 (memo print)
                "urlAndroid": "fb://facewebmodal/f?href=https://www.facebook.com/masterpiececlinicbeauty"
            },
            {
                "name": "Line", "link": "app.bookmarks", "children": null, "ex_link_mode": true,
                "schemeIos": "line://ti/p/~masterpiececlinic",
                "schemeAndroid": "jp.naver.line.android",
                "urlIos": "line://ti/p/~masterpiececlinic",
                "urlAndroid": "line://ti/p/~masterpiececlinic"
            },
            {
                "name": "Instagram",
                "link": "https://www.instagram.com/masterpiece_clinic/",
                "children": null,
                "ex_link_mode": true,
                "schemeIos": "instagram://",
                "schemeAndroid": "com.instagram.android",
                "urlIos": "instagram://user?username=masterpiece_clinic",
                "urlAndroid": "instagram://user?username=masterpiece_clinic"
            },

        ];
        $scope.toggleGroup = function (index) {

            var  group = $scope.actionsheet[index] ;

            if (group.ex_link_mode && group.link !== null) {
                var scheme;
                if (ionic.Platform.isIOS()) {
                    scheme = group.schemeIos ;
                }
                else if (ionic.Platform.isAndroid()) {
                    scheme = group.schemeAndroid ;
                }
                appAvailability.check(
                    scheme, // URI Scheme
                    function () {  // Success callback
                        //console.log('[AppCtrl] success check', 1);
                        if (ionic.Platform.isIOS()) {
                            window.open( group.urlIos , '_system', 'location=no' );
                        }
                        else if (ionic.Platform.isAndroid()) {
                            //startApp.set({
                            //    /* params */
                            //    "action": "ACTION_VIEW",
                            //    "uri": group.urlAndroid
                            //}).start();
                            var sApp = startApp.set({ /* params */
                                "action": "ACTION_VIEW",
                                "uri": group.urlAndroid
                            });
                            sApp.start(function() { /* success */
                                //console.log("OK");
                            }, function(error) { /* fail */
                                //--- case have app but can not run that app
                                window.open( group.link , '_system', 'location=no' );
                            });
                        }
                    },
                    function () {  // Error callback
                        //console.log('[AppCtrl] error check', 2);
                        if (ionic.Platform.isAndroid()) {
                            //--- case haven't app go to url
                            window.open( group.link , '_blank', 'location=no' );
                        }else{
                            popupService.alert('ไม่สามารถเชื่อมต่อ '+group.name+' ได้ค่ะ');
                        }
                    }
                );
                //$ionicHistory.nextViewOptions({
                //    disableBack: true
                //});
                //$ionicSideMenuDelegate.toggleLeft();
                //var Ref = window.open(group.link, '_blank', 'location=no,hardwareback=yes');   //---   _blank = Loads in the InAppBrowser

            }
        };

        $scope.openActionSheet = function() {





            $ionicActionSheet.show({
                buttons: [
                    { text: '<i class="icon ion-social-facebook positive"></i><b>Facebook</b>' },
                    { text: '<i class="icon ion-ios-chatbubble balanced" ></i><b>Line</b>' },
                    { text: '<i class="icon ion-social-instagram-outline royal"></i><b>Instagram</b>' },

                ],

                titleText: 'Masterpiece Social',
                cancelText: 'Cancel',
                cancel: function() {
                    // add cancel code..
                },
                buttonClicked: function(index) {
                    console.log('index : '+index);

                    $scope.toggleGroup(index);

                    return true;
                }
            });
        }
    })

    .controller('BranchCtrl', function ($scope,$cordovaGeolocation,$compile,$rootScope) {
        $scope.title = "Contact Us" ;

        //console.log('branch');

        var myLatlng = new google.maps.LatLng(13.7454302,100.5308201);

        var mapOptions = {
            center: myLatlng,
            zoom: 17,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };

        var map = new google.maps.Map(document.getElementById("map"), mapOptions);

        navigator.geolocation.getCurrentPosition(function(pos) {
            map.setCenter(new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude));
            var myLocation = new google.maps.Marker({
                position: new google.maps.LatLng(pos.coords.latitude, pos.coords.longitude),
                map: map,
                title: "My Location"
            });
        });


        var marker = new google.maps.Marker({
            map: map,
            animation: google.maps.Animation.DROP,
            position: myLatlng
        });

        var infoWindow = new google.maps.InfoWindow({
            content: "Masterpiece Clinic"
        });

        google.maps.event.addListener(marker, 'click', function () {
            infoWindow.open(map, marker);
        });


        $scope.map = map;

    })

    .controller('StampCtrl', function ($scope, $cordovaBarcodeScanner, $ionicPlatform, $localstorage, $state, $rootScope, $http, SemiFunction, popupService, DataLoader, Sha1, $ionicLoading) {
        $scope.title = "Stamp" ;
        var statusLogin = $localstorage.get('loginStatus');
        $scope.StampCnt = 0 ;
        $scope.StampEmptyCnt = 5-$scope.StampCnt;
        $scope.StampText = "แสตมป์สะสมทั้งหมด "+$scope.StampCnt+" / 5 ดวง";

        $scope.statusLogin = statusLogin;

        console.log('statusLogin : '+statusLogin);
        if (statusLogin == "false" || SemiFunction.checkNull(statusLogin)) {
            console.log('in status login false');
            $rootScope.redirectUrl = 'tab.stamps';
            //$state.go('login') ;
            $scope.statusLogin = false;
        }else{

            console.log('status login true');
            var email = $localstorage.get('userEmail');
            if (SemiFunction.checkNull(email)) {
                email = '';
            }

            $scope.data = {
                email: email,
                qrcodeId: ''
            };

            $scope.data.timestamp = Math.round((new Date()).getTime() / 1000);
            $scope.data.token = Sha1.genToken($scope.data.timestamp);

            $ionicLoading.show();
            var postsApi = $rootScope.semi.appQrcodeScore + "?email=" + $scope.data.email + "&timestamp=" + $scope.data.timestamp + "&token=" + $scope.data.token;
            DataLoader.get(postsApi).then(function (response) {
                $ionicLoading.hide();
                if (response.data.status == "success") {
                    //$scope.ScoreTotal = response.data.message.ScoreTotal;
                    //$scope.ScoreUse = response.data.message.ScoreUse;
                    //$scope.ScoreRemain = response.data.message.ScoreRemain;

                    $scope.StampCnt = response.data.message.ScoreRemain ;
                    $scope.StampEmptyCnt = 5-$scope.StampCnt;
                    $scope.StampText = "แสตมป์สะสมทั้งหมด "+$scope.StampCnt+" / 5 ดวง";

                } else {
                    popupService.alert(JSON.stringify(response.data.message));
                    statusLogin == "false"
                }
            }, function (response) {
                $ionicLoading.hide();
                popupService.alert(JSON.stringify(response));
            });
        }



        $scope.Login = function () {
            $state.go('login') ;
        };

        $scope.getNumber = function(num) {
            return new Array(num);
        };

        $scope.scanBarcode = function () {
            $cordovaBarcodeScanner.scan().then(function (result) {
                $scope.data.qrcodeId = result.text;
                var data = $scope.data;
                var postsApi = $rootScope.semi.appQrcodeScore;

                data.timestamp = Math.round((new Date()).getTime() / 1000);
                data.token = Sha1.genToken(data.timestamp);
                $ionicLoading.show();
                $http.post(postsApi, data).then(function (response) {
                    $ionicLoading.hide();
                    if (response.data.status == "success") {
                        popupService.alert('get 1 coupon!!!');
                        $scope.ScoreTotal = response.data.message.ScoreTotal;
                        $scope.ScoreUse = response.data.message.ScoreUse;
                        $scope.ScoreRemain = response.data.message.ScoreRemain;

                        $scope.StampCnt = response.data.message.ScoreRemain ;
                        $scope.StampEmptyCnt = 5-$scope.StampCnt;
                        $scope.StampText = "แสตมป์สะสมทั้งหมด "+$scope.StampCnt+" / 5 ดวง";

                    } else {
                        popupService.alert(JSON.stringify(response.data.message));
                    }
                }, function (response) {
                    $ionicLoading.hide();
                    popupService.alert(JSON.stringify(response));
                });


            }, function (error) {
                //console.log("An error happened -> " + error);
                popupService.alert(JSON.stringify(error));
            });
        };

    })


    .controller('ChatsCtrl', function ($scope, Chats) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });
