angular.module('wpIonic.services')
    .factory('Facebook', function ($http, $localstorage,$rootScope,$state,SemiFunction,LoginRedirect,$ionicLoading,popupService) {
        function getFacebookProfileInfo(r) {

            if($rootScope.semi.facebookNoEmail){
                facebookConnectPlugin.api('/me?fields=email,name&access_token=' + r.accessToken, null,
                    function (response) {
                        console.log(response);

                        //info.resolve(response);
                        var email = $localstorage.get('userEmail');
                        if (SemiFunction.checkNull(email)) {
                            email = '' ;
                        }
                        var name = response.name ;
                        if (response.email==email){
                            var nameGet = $localstorage.get('userName');
                            console.log('name : '+nameGet);
                            if (!SemiFunction.checkNull(nameGet)){
                                name = nameGet ;
                                console.log('in adname');
                            }
                        }
                        if (SemiFunction.checkNull(response.email)){
                            $rootScope.fbdata = {
                                email : '' ,
                                Isfacebook : 1,
                                password : response.id ,
                                fullName : name
                            } ;
                            $state.go('fbNoEmail');
                            console.log('in fb no email');
                        }else{
                            var data = {
                                email : response.email ,
                                Isfacebook : 1,
                                password : response.id ,
                                fullName : name
                            } ;
                            var postsApi = $rootScope.semi.appUserLogin ;
                            LoginRedirect.post(postsApi,data);
                            $ionicLoading.hide();
                        }
                    },
                    function (response) {
                        popupService.alert('Login with facebook fail!'+JSON.stringify(response));
                    }
                );
            }else{
                $rootScope.fbdata = {
                    email : '' ,
                    Isfacebook : 1,
                    password : '123456789' ,
                    fullName : 'pok test'
                } ;
                $state.go('fbNoEmail');
                console.log('in fb no email');
            }

        }


        function loginFacebook(scope){

            if($rootScope.semi.facebookNoEmail){
                facebookConnectPlugin.getLoginStatus(function(success){
                    if(success.status === 'connected'){
                        getFacebookProfileInfo(success.authResponse) ;
                    } else {
                        console.log('getLoginStatus', JSON.stringify(success));
                        $ionicLoading.show({
                            template: 'Logging in...'
                        });
                        // Ask the permissions you need. You can learn more about
                        // FB permissions here: https://developers.facebook.com/docs/facebook-login/permissions/v2.4
                        facebookConnectPlugin.login(['email', 'public_profile'], fbLoginSuccess, fbLoginError);
                    }
                });
            }else{
                getFacebookProfileInfo('authResponse') ;
            }
        }

        function fbLoginSuccess(response) {
            if (!response.authResponse){
                fbLoginError("Cannot find the authResponse");
                return;
            }
            getFacebookProfileInfo(response.authResponse) ;
        };

        // This is the fail callback from the login method
        function fbLoginError(error){
            console.log('fbLoginError', JSON.stringify(error));
            popupService.alert('Login with facebook fail!'+JSON.stringify(error));
            $ionicLoading.hide();
        };

        return {
            loginFacebook: function (r,$scope) {
                // Simple index lookup
                return loginFacebook(r,$scope);
            }
        }
    })
;