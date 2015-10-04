angular.module('main', ['ngRoute', 'ngResource'])
    .config(['$routeProvider', function($routeProvider){

        var viewPath = 'js/src/modules/main/views/';

        $routeProvider
            .when('/', {
                templateUrl: viewPath + 'project/list.html',
                controller: 'projectList',
                title: 'Deployer - Projects'
            })
            .when('/projects/create', {
                templateUrl: viewPath + 'project/create.html',
                controller: 'projectCreate',
                title: 'Deployer - Create Project'
            })
            .when('/project/:id', {
                templateUrl: viewPath + 'project/view.html',
                title: 'Deployer - Project',
                controller: 'projectView'
            });
    }]);