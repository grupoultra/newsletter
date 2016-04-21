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
        $scope.backendURL = ENV.apiEndpoint + "/Clients/";
        $scope.isLoggedIn = function(){
            var auth_token = store.get('authentication_token');

            return !( auth_token === null || auth_token === undefined );
        }

        $scope.login = function (email, password) {
            $http({
                method: 'POST',
                url: $scope.backendURL + "login",
                data:{
                    "username": $scope.username,
                    "password": $scope.password
                }
            })
            .then(function(res){
                store.set('authentication_token', res.data.id);
                console.log(res);
            })
            .catch(function(err){
                console.log(err);
            });
        }

        $scope.logout = function () {
            store.remove('authentication_token');
        }
    });
