'use strict';

/**
 * @ngdoc function
 * @name newsletterFrontendApp.controller:AboutCtrl
 * @description
 * # AboutCtrl
 * Controller of the newsletterFrontendApp
 */
angular.module('newsletterFrontendApp')
  .controller('AboutCtrl', function ($scope) {
    $scope.awesomeThings = [
      'HTML5 Boilerplate',
      'AngularJS',
      'Karma'
    ];
  });
