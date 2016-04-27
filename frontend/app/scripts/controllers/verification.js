'use strict';

angular.module('newsletterFrontendApp')
  .controller('VerificationCtrl', function ($scope, $routeParams, ENV,  $http, usSpinnerService) {
    var token = $routeParams.token;
    usSpinnerService.spin('spinner-verify');

    $scope.backendURL = ENV.apiEndpoint + "/recipients/";

    $scope.status = 'info';
    $scope.message = "Estamos verificando su correo electronico";

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
        $scope.status = 'success';

        $scope.message = "Su correo ha sido verificado. A partir de ahora recibira nuestros boletines."
      } else {
        $scope.status = 'warning';

        $scope.message = "Ha ocurrido un error al verificar su correo electronico"
      }
      console.log(res);
    })
    .catch(function(err){
      $scope.status = 'warning';

      $scope.message = "Ha ocurrido un error al verificar su correo electronico"

      console.log(err);
    })
    .finally(function(){
      usSpinnerService.stop('spinner-verify');
    });
  });
