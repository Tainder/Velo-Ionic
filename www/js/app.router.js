var app = angular.module('app');

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise('/');

    $stateProvider
        .state('countriesList', {
            url: '/',
            controller: 'countriesListController',
            templateUrl: '/template/countries/List.html'
        })
        .state('countryDetail', {
            url: '/country/:iso2/:pays',
            controller: 'countryDetailController',
            templateUrl: '/template/countries/Detail.html'
        })
        .state('stationDetail', {
            url: '/country/:contractName/:pays/:idContract',
            controller: 'stationDetailController',
            templateUrl: '/template/countries/Station.html'
        })
        .state('currentPosition', {
            url: '/Map',
            controller: 'currentPositionController',
            templateUrl: '/template/countries/Map.html'
        })

});
