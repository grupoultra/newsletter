'use strict';

angular.module('newsletterFrontendApp')
  .controller('VerificationCtrl', function ($scope, $routeParams, ENV,  $http) {
    var token = $routeParams.token;
    $scope.backendURL = ENV.apiEndpoint + "/recipients/";
    $scope.verified = false;

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
        if (res.status === 200){
          $scope.verified = true;
        }
          console.log(res)
        console.log("lo que sea");
      });
    };
  });
