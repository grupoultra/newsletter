'use strict';

/**
 * @ngdoc function
 * @name newsletterFrontendApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the newsletterFrontendApp
 */
angular.module('newsletterFrontendApp')
  .controller('MainCtrl', function ($scope, $http, ENV) {
      $scope.backendURL = ENV.apiEndpoint + "/Recipients/";

      $scope.news = [{"header": "", "content": "", "type": "news", "link": "" }];

      $scope.addNews = function(){
          $scope.news.push({"header": "", "content": "", "type": "news", "link": ""});
      };

      $scope.registerUser = function () {
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
              data: {
                  "subject": "Boletin diario",
                  "content": $scope.news
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
