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
    'ngTouch',
    'config'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/crear.html',
        controller: 'MainCtrl'
      })
      .when('/enviar', {
        templateUrl: 'views/enviar.html',
        controller: 'MainCtrl',
          authenticated: true
      })
      .otherwise({
        redirectTo: '/'
      });
  });
