'use strict';

/**
 * @ngdoc overview
 * @name newsletterFrontendApp
 * @description
 * # newsletterFrontendApp
 *
 * Main module of the application.
 */
angular
  .module('newsletterFrontendApp', [
    'ngAnimate',
    'ngCookies',
    'ngResource',
    'ngRoute',
    'ngSanitize',
    'ngTouch'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/enviar', {
        templateUrl: 'views/enviar.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
