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
    'angular-storage',
    'config',
    'angularSpinner',
    'vcRecaptcha',
    'ngLodash'
  ])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/crear.html',
        controller: 'MainCtrl'
      })
      .when('/login', {
        templateUrl: 'views/login.html',
        controller: 'LoginCtrl'
      })
      .when('/logout', {
        controller: 'LoginCtrl'
      })
      .when('/verificar/:token', {
        controller: 'VerificationCtrl',
        templateUrl: 'views/verify.html'
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
