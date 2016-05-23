angular.module('wpIonic.controllers')


    .controller('ViewsCtrl', function ($scope, $stateParams, DataLoader, $ionicLoading, $rootScope, $sce, CacheFactory, $log, $cordovaSocialSharing) {


        console.log('PostCtrl');
        if (!CacheFactory.get('postCache')) {
            CacheFactory.createCache('postCache');
        }
        var shareLink = '';
        var postCache = CacheFactory.get('postCache');
        $scope.itemID = $stateParams.postId;
        var singlePostApi = _wpurl + 'posts/' + $scope.itemID;



        if ($stateParams.pageStatus == 1) {
            var singlePostApi = _wpurl + 'pages/' + $scope.itemID;
        }


        singlePostApi = "http://masterpiececlinic.com/wp-json/wp/v2/pages/5790" ;

        function regexYoutube(html) {
            var contentHtml = html;
            //var pattern = /<iframe.*?\/iframe>/i;

            var pattern = /<iframe width="1500".*?\/iframe>/i;

            var width = (880*window.screen.width)/1500 ;
            var height = (880*width)/1500 ;



            var reg = new RegExp(pattern);
            var result;
            while (result = reg.exec(contentHtml)) {
                var Match = result[0];
                console.log('Match : ', Match);
                var url = /src="(.*?)"/g.exec(Match), //extract current iframe video source
                    source = url[1];

                console.log('youtubeUrl : ', source);

                var patternId = /embed\/([\d\w]+)/;
                match = patternId.exec(source);
                var youtubeId = match[1];
                console.log('youtubeId : ', youtubeId);
                contentHtml = contentHtml.replace(Match, '<iframe src="'+source+'" frameborder="0" width="'+width+'" height="'+height+'" allowfullscreen></iframe>');
            }

            return contentHtml;
        }
        console.log('singlePostApi : ' + singlePostApi);
        $scope.loadPost = function () {

            // Fetch remote post

            $rootScope.loading = true ;

            DataLoader.get(singlePostApi).then(function (response) {
                $scope.post = response.data;
                $log.debug($scope.post);
                shareLink = response.data.link;
                if ($rootScope.semi.regexYoutube){
                    var contentHtml = regexYoutube(response.data.content.rendered) ;
                }else{
                    var contentHtml = response.data.content.rendered;
                }

                // Don't strip post html
                $scope.content = $sce.trustAsHtml(contentHtml);
                // add post to our cache
                postCache.put(response.data.id, response.data);
                //$ionicLoading.hide();
                $rootScope.loading = false ;
            }, function (response) {
                $log.error('error', response);
                //$ionicLoading.hide();
                $rootScope.loading = false ;
            });

        };


        if (!postCache.get($scope.itemID)) {
            // Item is not in cache, go get it
            $scope.loadPost();
        } else {
            console.log('$scope.itemID : ' + $scope.itemID);

            // Item exists, use cached item
            $scope.post = postCache.get($scope.itemID);
            if ($rootScope.semi.regexYoutube){
                var contentHtml = regexYoutube($scope.post.content.rendered);
            }else{
                var contentHtml = $scope.post.content.rendered ;
            }

            console.log('final :',contentHtml);

            $scope.content = $sce.trustAsHtml(contentHtml);
        }


        $scope.share = function () {
            console.log('share : ', shareLink);

            //"http://www.masterpiececlinic.com/news/nongchat-meet-and-greet/" ;
            //shareViaFacebook('Message via Facebook',null, shareLink) ;
            share(null, null, null, shareLink);
        };

        function shareViaFacebook(message, image, link) {
            $cordovaSocialSharing.shareViaFacebook(message, image, link);
        }

        function share(message, subject, file, link) {

            $cordovaSocialSharing.share(message, subject, file, link);
        }

        //to delete
        //// Bookmarking
        //$scope.bookmarked = Bookmark.check($scope.itemID);
        //$scope.bookmarkItem = function (id) {
        //    if ($scope.bookmarked) {
        //        Bookmark.remove(id);
        //        $scope.bookmarked = false;
        //    } else {
        //        Bookmark.set(id);
        //        $scope.bookmarked = true;
        //    }
        //};
        //
        //// Pull to refresh
        //$scope.doRefresh = function () {
        //    $timeout(function () {
        //        $scope.loadPost();
        //        //Stop the ion-refresher from spinning
        //        $scope.$broadcast('scroll.refreshComplete');
        //    }, 1000);
        //};

    })

    .controller('ListViewCtrl', function ($scope, $http, $ionicHistory, DataLoader, $timeout, $ionicSlideBoxDelegate, $rootScope, $log, $stateParams, $ionicSideMenuDelegate, $ionicScrollDelegate, $ionicLoading) {
        var postsApi = _wpurl + 'posts?filter[category_name]=' + $stateParams.category;
        //$ionicHistory.nextViewOptions({
        //    disableBack: true
        //});
        $scope.showMenuIcon = true;

        //$scope.toggleMenu = function () {
        //    console.log('toggleMenu');
        //    $ionicSideMenuDelegate.toggleLeft(true);
        //};

        $timeout(function () {
            $scope.$watch(function () {
                    return $ionicSideMenuDelegate.getOpenRatio();
                },

                function (ratio) {
                    if (ratio == 0) {
                        $ionicScrollDelegate.$getByHandle('my-handle').scrollTop();
                    }
                    else {
                    }
                });
        });

        $scope.category = $stateParams.category;


        //console.log('PostsCtrl');
        console.log('postsApi : ' + postsApi);
        $scope.moreItems = false;

        $scope.loadPosts = function () {
            // Get all of our posts
            //$ionicLoading.show({noBackdrop: true});

            $rootScope.loading = true ;

            DataLoader.get(postsApi).then(function (response) {
                //$ionicLoading.hide();
                //console.log('response :',JSON.stringify(response));
                $rootScope.loading = false ;
                $scope.posts = response.data;
                $scope.testImage = 'img/Bootstrap-Tutorials.png';
                $scope.moreItems = true;
                $log.log(postsApi, response.data);
            }, function (response) {
                //$ionicLoading.hide();
                $rootScope.loading = false ;
                $log.log(postsApi, response.data);
            });

        };

        // Load posts on page load
        $scope.loadPosts();

        paged = 2;

        // Load more (infinite scroll)
        $scope.loadMore = function () {

            if (!$scope.moreItems) {
                return;
            }

            var pg = paged++;

            $log.log('loadMore ' + pg);

            $timeout(function () {

                DataLoader.get(postsApi + '&page=' + pg).then(function (response) {

                    angular.forEach(response.data, function (value, key) {
                        $scope.posts.push(value);
                    });

                    if (response.data.length <= 0) {
                        $scope.moreItems = false;
                    }
                }, function (response) {
                    $scope.moreItems = false;
                    $log.error(response);
                });

                $scope.$broadcast('scroll.infiniteScrollComplete');
                $scope.$broadcast('scroll.resize');

            }, 1000);

        };

        $scope.moreDataExists = function () {
            return $scope.moreItems;
        };

        // Pull to refresh
        $scope.doRefresh = function () {
            $timeout(function () {
                $scope.loadPosts();
                //Stop the ion-refresher from spinning
                $scope.$broadcast('scroll.refreshComplete');
            }, 1000);
        };

    })

    .controller('CosmeticsCtrl', function ($scope) {
        $scope.itemList = [
            {"name": "Laser", "link": "#/app/lasers"},
            {"name": "Facial Design", "link": "#/app/facialDesign"},
            {"name": "Anti-Aging", "link": "#/app/antiAging"},
            {"name": "Body", "link": "#/app/bodys"}
        ];
        $scope.titleView = "cosmetics";
    })

    .controller('LasersCtrl', function ($scope) {
        $scope.itemList = [
            {"name": "Clear and Brilliant(C&B)", "link": "#/app/pages/3624/1"},
            {"name": "E-matrix(แก้หลุมสิว)", "link": "#/app/pages/3614/1"},
            {"name": "IPL", "link": "#/app/pages/3603/1"},
            {"name": "Motif", "link": "#/app/pages/3620/1"},
            {"name": "Spectra Gold(Q-swicth)", "link": "#/app/pages/3639/1"},
            {"name": "Sublime", "link": "#/app/pages/3610/1"},
            {"name": "Thermage(ยกกระชับใบหน้าเรียว)", "link": "#/app/pages/3630/1"},
            {"name": "Uni Tightening(Davinchi)", "link": "#/app/pages/3644/1"},
            {"name": "VBeam", "link": "#/app/pages/3634/1"},
            {"name": "HIFU3", "link": "#/app/pages/9220/1"},
            {"name": "AQUALEAN", "link": "#/app/pages/10175/1"}
        ];
        $scope.titleView = "Lasers";
    })

    .controller('FacialDesignCtrl', function ($scope) {
        $scope.itemList = [
            {"name": "Barbed Thread Lift", "link": "#/app/pages/3599/1"},
            {"name": "Botox", "link": "#/app/pages/3562/1"},
            {"name": "Filler", "link": "#/app/pages/3578/1"},
            {"name": "Master Slim(face)", "link": "#/app/pages/3590/1"},
            {"name": "Master V Lift(Spring Thread Lift)(การร้อยไหม)", "link": "#/app/pages/3596/1"}
        ];
        $scope.titleView = "Facial Design";
    })

    .controller('AntiAgingCtrl', function ($scope) {
        $scope.itemList = [
            {"name": "Cinderella (Powerful Antioxidant)", "link": "#/app/pages/3657/1"},
            {"name": "Super Aura(Skin Nutrition)", "link": "#/app/pages/3650/1"}
        ];
        $scope.titleView = "Anti Aging";
    })

    .controller('BodysCtrl', function ($scope) {
        $scope.itemList = [
            {"name": "Angel legs", "link": "#/app/pages/4012/1"},
            {"name": "Fat Burner", "link": "#/app/pages/8667/1"},
            {"name": "Master Slim (body)", "link": "#/app/pages/8616/1"},
            {"name": "Super Burn", "link": "#/app/pages/8631/1"},
            {"name": "Vaser Shape", "link": "#/app/pages/4024/1"}

        ];
        $scope.titleView = "Bodys";
    })
;






