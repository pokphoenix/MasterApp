angular.module('wpIonic.controllers', [])

    .controller('HomeCtrl', function ($scope) {
    })



    .controller('StampCtrl', function ($scope, $cordovaBarcodeScanner, $ionicPlatform, $localstorage, $state, $rootScope, $http, SemiFunction, popupService, DataLoader, Sha1, $ionicLoading) {

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
