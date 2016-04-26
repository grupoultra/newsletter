'use strict';

/**
 * @ngdoc function
 * @name newsletterFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newsletterFrontendApp
 */
angular.module('newsletterFrontendApp')
  .controller('MainCtrl', function ($scope, $http, ENV, store) {
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
          $http({
              method: 'POST',
              url: $scope.backendURL,
              data:{
                  "address": $scope.email,
                  "fullname": $scope.fullname,
                  "operation": "create"
              }
          })
          .then(function(res){
              $scope.clicked = true;

              console.log("estoy aqui");

              if( res.status === 200 ){
                  $scope.success = true;
                  $scope.fullname = '';
                  $scope.email = '';
                  $scope.success = true;
              } else{
                  $scope.error = true;
              }
              $scope.registrationDisabled = false;

              console.log(res);
          })
          .catch(function(err){
              $scope.error = true;

              console.log("Error: ", err);
          });
      };

      $scope.sendEmail = function () {
          $scope.sendingDisabled = true;
          $http({
              method: 'POST',
              url: $scope.backendURL + 'send',
              headers:{
                  "Authorization": store.get("authentication_token")
              },
              data: {
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
              $scope.sendingDisabled = false;

          })
          .catch(function(err){
              $scope.error = true;

              $scope.sendingDisabled = false;
              console.log(err);
          });
      }

  });
