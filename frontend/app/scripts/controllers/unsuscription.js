'use strict';

angular.module('newsletterFrontendApp')
  .controller('UnsuscriptionCtrl', function ($scope, $routeParams, ENV,  $http, usSpinnerService) {
    var token = $routeParams.token;
    usSpinnerService.spin('spinner-unsuscribe');

    $scope.backendURL = ENV.apiEndpoint + "/recipients/unsuscribe/";

    $scope.status = 'info';
    $scope.message = "Estamos procesando su solicitud";

    $http({
      method: 'POST',
      url: $scope.backendURL,
      data:{
        "operation": "unsuscribe",
        "token": token
      },
      headers: {
        'Content-Type': 'application/json; charset=utf-8'
      }
    })
    .then(function(res){
      if (res.status === 200){
        $scope.status = 'success';

        $scope.message = "Ha sido dado de alta de nuestro boletin."
      } else {
        $scope.status = 'warning';

        $scope.message = "Ha ocurrido un error al procesar su solicitud"
      }
      console.log(res);
    })
    .catch(function(err){
      $scope.status = 'warning';

      $scope.message = "Ha ocurrido un error al procesar su solicitud"

      console.log(err);
    })
    .finally(function(){
      usSpinnerService.stop('spinner-verify');
    });
  });
