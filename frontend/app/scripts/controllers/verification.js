'use strict';

angular.module('newsletterFrontendApp')
  .controller('VerificationCtrl', function ($scope, $routeParams, $http) {
    var token = $routeParams.token;
    $scope.backendURL = ENV.apiEndpoint + "/recipients/";

    $scope.verify = function(){
      $http({
        method: 'POST',
        url: $scope.backendURL,
        data:{
          "operation": "verify",
          "token": token
        },
        headers: {
          'Content-Type': 'application/json; charset=utf-8'
        }
      })
      .then(function(res){
        console.log("lo que sea");
      });
    };
  });
