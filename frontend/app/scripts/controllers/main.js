'use strict';

/**
 * @ngdoc function
 * @name newsletterFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newsletterFrontendApp
 */
angular.module('newsletterFrontendApp')
  .controller('MainCtrl', function ($scope, $http) {
      $scope.backendURL = 'http://localhost:3000/api/Recipients/';

      $scope.registerUser = function () {
          console.log("Entrando");
          $http({
              method: 'POST',
              url: $scope.backendURL,
              data:{
                  "address": $scope.email,
                  "name": $scope.name
              }
          })
              .then(function(res){
                  console.log(res);
              })
              .catch(function(err){
                  console.log(err);
              });
      };

      $scope.sendEmail = function () {
          $http({
              method: 'POST',
              url: $scope.backendURL + 'send',
              data:{
                  "subject": $scope.subject,
                  "content": $scope.content
              }
          })
              .then(function(res){
                  console.log(res);
              })
              .catch(function(err){
                  console.log(err);
              });
      }
      
  });
