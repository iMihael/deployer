angular.module('app', [
    'ngRoute',
    'angular-loading-bar',
    'main'
]).config(['$routeProvider', function($routeProvider){
    $routeProvider
        .otherwise({
            redirectTo: '/'
        });
}]).run(['$rootScope', function($rootScope){
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.hasOwnProperty('$$route')) {
            if(current.$$route.hasOwnProperty('title'))
                $rootScope.title = current.$$route.title;
        }
    });
}]);