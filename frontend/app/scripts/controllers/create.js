'use strict';

/**
 * @ngdoc function
 * @name newsletterFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newsletterFrontendApp
 */
angular.module('newsletterFrontendApp')
  .controller('MainCtrl', function ($scope, $http, ENV, store, usSpinnerService) {
      $scope.backendURL = ENV.apiEndpoint + "/recipients/";

      setEmptyNews();

      $scope.addNews = function(){
        $scope.news.push({"header": "", "content": "", "type": "news", "link": ""});
      };

      function setEmptyNews () {
        $scope.news = [{"header": "", "content": "", "type": "news", "link": "" }];
      };

      $scope.registerUser = function () {
        $scope.registrationDisabled = true;
        usSpinnerService.spin('spinner-register');

        $http({
          method: 'POST',
          url: $scope.backendURL,
          data:{
            "address": $scope.email,
            "fullname": $scope.fullname,
            "operation": "create"
          },
          headers: {
            'Content-Type': 'application/json; charset=utf-8'
          }
        })
        .then(function(res){
          $scope.clicked = true;

          if( res.status === 200 ){
            $scope.success = true;
            $scope.fullname = '';
            $scope.email = '';
            $scope.success = true;
          } else{
            $scope.error = true;
          }
          console.log(res);
        })
        .catch(function(err){
          $scope.error = true;

          console.log("Error: ", err);
        })
        .finally(function(){

          $scope.registrationDisabled = false;
          usSpinnerService.stop('spinner-register');
        });
      };

      $scope.sendEmail = function () {
        $scope.sendingDisabled = true;
        usSpinnerService.spin('spinner-send');

        $http({
          method: 'POST',
          url: $scope.backendURL,
          headers:{
            "Authorization": store.get("authentication_token")
          },
          data: {
            "operation": "send",
            "subject": "Boletin diario",
            "content": $scope.news
          }
        })
        .then(function(res){

          if( res.status === 200 ) {
            setEmptyNews();
            $scope.success = true;
          } else {
            $scope.error = true;
          }

          console.log(res);
        })
        .catch(function(err){
          $scope.error = true;

          console.log(err);
        })
        .finally(function(){
          $scope.sendingDisabled = false;
          usSpinnerService.stop('spinner-send');
        });
      }

  });
