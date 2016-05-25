angular.module('wpIonic.controllers')

    // Login / User Management here

    .controller('LoginCtrl', function ($scope, $state,$localstorage,LoginRedirect,SemiFunction,UserService,$q,$ionicLoading,Facebook,$rootScope,popupService,$http,Sha1) {

        var statusLogin = $localstorage.get('loginStatus');
        $scope.inputType = 'password';
        $scope.passwordCheckbox = true ;
        $scope.IsLogin =  false ;
        if (statusLogin=="true") {
            $state.go($rootScope.semi.appHome);
        }

        //$scope.form = {
        //    signInForm: {}
        //};

        var email = $localstorage.get('userEmail');
        if (SemiFunction.checkNull(email)) {
            email = '' ;
        }

        $scope.data = {
            email : email ,
            name : '' ,
            password : ''
        };

        //var signInForm = angular.copy($scope.data) ;
        //
        //$scope.clearFields = function() {
        //    $scope.data = angular.copy(signInForm);
        //    $scope.form.signInForm.$setPristine();
        //};

        $scope.signIn = function (form) {
            if(form.$valid) {

                $ionicLoading.show();

                var data = this.data ;

                var name = $localstorage.get('userName');
                if (SemiFunction.checkNull(name)) {
                    name = '' ;
                }
                if (data.email==email){
                    data.name = name ;
                }
                var postsApi = $rootScope.semi.appUserLogin ;
                LoginRedirect.post(postsApi,data);

            }
        };

        $scope.signUp = function () {
            $state.go('signUp');
        };

        $scope.skip = function () {
            $state.go($rootScope.semi.appHome);
        };

        $scope.forgetPass = function(){

            var showParameter = {
                title: "Forget Password",
                cssClass: "",
                subTitle: "Please enter your email",
                template: '<input type="text" ng-model="data.value">',
                templateUrl: "",
                buttons: {
                    cancelText: "Cancel",
                    cancelType: "button-stable",
                    okText: "Accept",
                    okType: "button-positive"
                }
            };

            // An elaborate, custom popup
            var popupPromise = popupService.show(showParameter, $scope);
            popupPromise.then(function(res) {
                //console.log('Popup!', res);
                if (res){
                    $scope.data.value = '' ;
                    var data = {
                        email: res ,
                        timestamp : Math.round((new Date()).getTime() / 1000),

                    };
                    data.token = Sha1.genToken(data.timestamp) ;
                    var postsApi = $rootScope.semi.appUserForgotPass;
                    $ionicLoading.show();

                    $http.post(postsApi, data).then(function (response) {
                        $ionicLoading.hide();
                        if (response.data.status == "success") {
                            popupService.alert('กรุณาตรวจสอบรหัสผ่านใหม่ใน email ค่ะ');
                        } else {
                            popupService.alert(JSON.stringify(response.data.message));
                        }
                    }, function (response) {
                        $ionicLoading.hide();
                        popupService.alert(JSON.stringify(response));
                    });
                }

            });

        };



        //This method is executed when the user press the "Login with facebook" button
        $scope.facebookSignIn = function() {
            Facebook.loginFacebook();
        };

        $scope.hideShowPassword = function(){
            if ($scope.inputType == 'password')
                $scope.inputType = 'text';
            else
                $scope.inputType = 'password';
        };

    })

    .controller('FBnoEmailCtrl', function ($scope, $state,$rootScope,$ionicHistory,LoginRedirect,$ionicLoading) {

        $scope.hasPassword = false ;

        $scope.back = function () {
            $state.go('login');
        };
        $scope.form = {
            signUpForm: {}
        };
        $scope.data = {
            email : '' ,
            password : $rootScope.fbdata.password,
            fullName : $rootScope.fbdata.fullName,
            Isfacebook : 1
        };
        var signUpForm = angular.copy($scope.data) ;
        $scope.signUp = function (form) {
            //console.log('signUp');
            //console.log(form,' valid : '+form.$valid);
            if(form.$valid) {
                var data = this.data ;
                var postsApi = $rootScope.semi.appUserLogin ;
                $ionicLoading.show();
                //console.log(postsApi,data);
                $ionicHistory.clearHistory();
                LoginRedirect.post(postsApi,data);
                $scope.clearFields();
            }
        };
        $scope.clearFields = function() {
            $scope.data = angular.copy(signUpForm);
            $scope.form.signUpForm.$setPristine();
        };

    })




    .controller('SignUpCtrl', function ($scope, $state,LoginService,$rootScope,$ionicPopup,LoginRedirect,$ionicHistory,Sha1,$ionicLoading ) {
        $scope.title = "Sign Up" ;
        $scope.inputType = 'password';
        $scope.inputTypeConFirm = 'password';
        $scope.passwordCheckbox = true ;
        $scope.confirmPasswordCheckbox = true ;


        $scope.back = function () {
            $state.go('login');
        };
        $scope.form = {
            signUpForm: {}
        };

        $scope.hasPassword = true ;

        $scope.data = {
            email : '' ,
            password : '',
            confirmPassword : '',
            fullName : '',
            Isfacebook : 0
        };
        var signUpForm = angular.copy($scope.data) ;
        $scope.signUp = function (form) {
            //console.log('signUp');
            //console.log(form,' valid : '+form.$valid);
            if(form.$valid) {
                var data = this.data ;
                data.confirmPassword = Sha1.encode(data.confirmPassword);
                var postsApi = $rootScope.semi.appUserSingUp ;
                $ionicLoading.show();
                $ionicHistory.clearHistory();
                LoginRedirect.post(postsApi,data);
                $scope.clearFields();
            }
        };
        $scope.clearFields = function() {
            $scope.data = angular.copy(signUpForm);
            $scope.form.signUpForm.$setPristine();
        };
        $scope.skip = function () {
            $state.go($rootScope.semi.appHome);
        };
        $scope.hideShowPassword = function(input){
            //console.log('hideShowPassword');
            if ($scope[input] == 'password')
                $scope[input] = 'text';
            else
                $scope[input] = 'password';
        };

    })

    .controller('MyAccountCtrl', function ($scope,$localstorage,$state,$rootScope,SemiFunction,$ionicLoading) {
        $scope.title = "My Account" ;
        $rootScope.redirectUrl = 'tab.account' ;
        var statusLogin = $localstorage.get('loginStatus');

        $scope.IsLogin =  false ;
        if (statusLogin=="true") {
            $scope.IsLogin = true;
        }

        $scope.email = $localstorage.get('userEmail');
        if (SemiFunction.checkNull($scope.email)) {
            $scope.email = '' ;
        }
        $scope.name = $localstorage.get('userName');
        if (SemiFunction.checkNull($scope.name)) {
            $scope.name = '' ;
        }

        $scope.Logout = function () {
            $rootScope.redirectUrl = null ;
            $localstorage.set('loginStatus',false);

            var IsFB =  $localstorage.get('Isfacebook');
            if (!SemiFunction.checkNull(IsFB)&& IsFB=="1" ) {
                $localstorage.set('Isfacebook',"0");
                $state.go('login') ;
                //facebookConnectPlug.logout(function(r){
                //        // alert("logout success :"+JOSN.stringify(r)) ;
                //
                //    },
                //    function(fail){
                //        alert("logout fail:"+JOSN.stringify(fail)) ;
                //        $ionicLoading.hide();
                //    });
            }else{
                $state.go('login') ;
            }
        };

        $scope.Login = function () {
            $state.go('login') ;
        };

    })

    .controller('EditProfileCtrl', function ($window,$scope,$rootScope,$localstorage,LoginRedirect,SemiFunction,$ionicLoading) {
        $scope.title = "Edit Profile" ;

        var email = $localstorage.get('userEmail');

        $scope.data = {
            email : email,
            fullName : '',
            password : ''
        };

        $scope.data.fullName = $localstorage.get('userName');
        if (SemiFunction.checkNull($scope.data.fullName)) {
            $scope.data.fullName = '' ;
        }

        $scope.Edit = function (form) {
            if(form.$valid) {
                var data = this.data ;
                $rootScope.redirectUrl = 'app.myaccounts' ;
                var postsApi = $rootScope.semi.appUserUpdate ;
                $ionicLoading.show();
                LoginRedirect.post(postsApi,data);
            }
        };
    })

    .controller('ChangePassCtrl', function ($scope, $state,$localstorage,DataLoader,$rootScope,Sha1,$ionicLoading) {
        $scope.title = "Change Password" ;
        $scope.currentInputType = 'password' ;
        $scope.inputType = 'password' ;
        $scope.inputTypeConFirm = 'password';
        $scope.currentPasswordCheckbox = true ;
        $scope.passwordCheckbox = true ;
        $scope.confirmPasswordCheckbox = true ;

        $scope.IsLogin = false ;
        $scope.form = {
            changePassForm: {}
        };

        var email = $localstorage.get('userEmail');

        $scope.data = {
            email : email ,
            oldPassword : '' ,
            newPassword : '' ,
            newPasswordConfirm : ''
        };
        var changePassForm = angular.copy($scope.data) ;
        $scope.clearFields = function() {
            $scope.data = angular.copy(changePassForm);
            $scope.form.changePassForm.$setPristine();
        };
        $scope.changePass = function (form) {
            if(form.$valid) {
                var data = this.data ;
                var postsApi = $rootScope.semi.appUserChangePass ;
                data.oldPassword = Sha1.encode(data.oldPassword) ;
                data.newPassword = Sha1.encode(data.newPassword) ;
                data.newPasswordConfirm = Sha1.encode(data.newPasswordConfirm) ;

                data.timestamp = Math.round((new Date()).getTime() / 1000);
                data.token  = Sha1.genToken(data.timestamp) ;
                //console.log('time stamp : ', data.timestamp ) ;
                //console.log('token : ', data.token ) ;
                $ionicLoading.show();
                DataLoader.post(postsApi,data);
                $scope.clearFields();
            }
        };
        $scope.hideShowPassword = function(input){
            if ($scope[input] == 'password')
                $scope[input] = 'text';
            else
                $scope[input] = 'password';
        };

    })

;






