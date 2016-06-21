'use strict';

/**
 * @ngdoc function
 * @name newsletterFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newsletterFrontendApp
 */
angular.module('newsletterFrontendApp')
    .controller('LoginCtrl', function ($scope, $http, ENV, store) {
        $scope.backendURL = ENV.apiEndpoint + "/users/";
        $scope.isLoggedIn = function(){
            var auth_token = store.get('Authorization');

            return !( auth_token === null || auth_token === undefined );
        };

        $scope.login = function (email, password) {
            $http({
                method: 'POST',
                url: $scope.backendURL,
                data:{
                    "operation": "login",
                    "username": $scope.username,
                    "password": $scope.password
                }
            })
            .then(function(res){
                if(res.data.errorMessage){
                  $scope.errorMessage = res.data.errorMessage;
                  $scope.error = true;
                  $scope.success = false;
                } else{
                  $scope.success = true;
                  $scope.error = false;
                  store.set('Authorization', res.data.id);
                }
                console.log(res);
            })
            .catch(function(err){
                console.log(err);
            });
        }

        $scope.logout = function () {
          $scope.error = false;
          $scope.success = false;
            store.remove('Authorization');
        }
    });
