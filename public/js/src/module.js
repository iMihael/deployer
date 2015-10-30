angular.module('app', [
    'ngRoute',
    'ui.bootstrap',
    'angular-loading-bar',
    'angular-growl',
    'dndLists',
    'main'
]).config(['$routeProvider', 'growlProvider', function($routeProvider, growlProvider){

    growlProvider.globalPosition('top-left');
    growlProvider.globalTimeToLive(4000);
    growlProvider.globalDisableCountDown(true);

    $routeProvider
        .otherwise({
            redirectTo: '/'
        });
}]).run(['$rootScope', function($rootScope){
    $rootScope.$on('$routeChangeSuccess', function (event, current, previous) {
        if (current.hasOwnProperty('$$route')) {
            if(current.$$route.hasOwnProperty('title'))
                $rootScope.title = current.$$route.title;

            $rootScope.navbarCollapsed = false;
        }
    });
}]);